package com.lcs.findraco.category.service;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.category.repository.CategorySpendingRepository;
import com.lcs.findraco.category.request.CategorySpendingFilter;
import com.lcs.findraco.category.response.CategorySpendingResponse;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.service.ItemShareAllocator;
import com.lcs.findraco.transaction.service.ItemShareAllocator.Allocation;
import com.lcs.findraco.transaction.service.ItemShareAllocator.MemberFact;
import com.lcs.findraco.transaction.service.OpenEndedSeriesTopUpService;
import com.lcs.findraco.user.service.UserService;
import jakarta.persistence.EntityManager;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The single source of category spend (AD-008): the Overview breakdown and the Categories tab both
 * read it, so the two can never disagree. Fetches the per category x member facts, allocates
 * categorized items across participants, and hands both to {@link CategorySpendingAssembler}.
 */
@Service
public class CategorySpendingService {

    private final CategorySpendingRepository spendingRepository;
    private final CategoryRepository categoryRepository;
    private final PlanService planService;
    private final UserService userService;
    private final ItemShareAllocator itemShareAllocator;
    private final CategorySpendingAssembler assembler;
    private final OpenEndedSeriesTopUpService openEndedSeriesTopUpService;
    private final Clock clock;
    private final EntityManager entityManager;

    public CategorySpendingService(
            CategorySpendingRepository spendingRepository,
            CategoryRepository categoryRepository,
            PlanService planService,
            UserService userService,
            ItemShareAllocator itemShareAllocator,
            CategorySpendingAssembler assembler,
            OpenEndedSeriesTopUpService openEndedSeriesTopUpService,
            Clock clock,
            EntityManager entityManager) {
        this.spendingRepository = spendingRepository;
        this.categoryRepository = categoryRepository;
        this.planService = planService;
        this.userService = userService;
        this.itemShareAllocator = itemShareAllocator;
        this.assembler = assembler;
        this.openEndedSeriesTopUpService = openEndedSeriesTopUpService;
        this.clock = clock;
        this.entityManager = entityManager;
    }

    /**
     * The Categories tab (CAT-01/02): every category of the plan for the period. Open-ended series are
     * topped up first, as the dashboard does, so the tab and the Overview read the same transactions.
     */
    @Transactional(readOnly = true)
    public List<CategorySpendingResponse> getSpending(CategorySpendingFilter filter, PlanContext ctx) {
        openEndedSeriesTopUpService.topUp(ctx.planId(), LocalDate.now(clock));
        return compute(ctx.planId(), filter.startDate(), filter.endDate(), null);
    }

    /** Every category of the plan (DEBIT then CREDIT trees, zero spend included) for the period. */
    @Transactional(readOnly = true)
    public List<CategorySpendingResponse> compute(long planId, LocalDate startDate, LocalDate endDate, Long memberId) {
        Plan plan = entityManager.getReference(Plan.class, planId);
        Facts debit = facts(plan, TransactionType.DEBIT, startDate, endDate, memberId);
        Facts credit = facts(plan, TransactionType.CREDIT, startDate, endDate, memberId);
        Members members = members(plan, debit, credit);
        return assembler.assemble(
                concat(debit.rowsA(), credit.rowsA()),
                concat(debit.removed(), credit.removed()),
                concat(debit.added(), credit.added()),
                categoryRepository.findAllByPlanWithDetails(plan),
                members.activeIds(),
                members.names(),
                memberId);
    }

    /** The Overview breakdown: DEBIT roots with rolled-up spend, children nested. */
    @Transactional(readOnly = true)
    public List<CategorySpendingResponse> computeOverview(
            long planId, LocalDate startDate, LocalDate endDate, Long memberId) {
        Plan plan = entityManager.getReference(Plan.class, planId);
        Facts debit = facts(plan, TransactionType.DEBIT, startDate, endDate, memberId);
        List<Category> categories = categoryRepository.findAllByPlanWithDetails(plan);
        Members members = members(plan, debit);
        return assembler.assembleOverview(
                debit.rowsA(),
                debit.removed(),
                debit.added(),
                categories,
                members.activeIds(),
                members.names(),
                memberId);
    }

    private record Members(Set<Long> activeIds, Map<Long, String> names) {}

    /**
     * Active member ids and the display name of every member with spend facts. Membership rows are
     * hard-deleted on removal, so a user without one is a former member (CAT-14) whose name is
     * looked up separately.
     */
    private Members members(Plan plan, Facts... facts) {
        Map<Long, String> names = new HashMap<>();
        Set<Long> activeIds = new HashSet<>();
        planService.findMemberships(plan.getId()).forEach(membership -> {
            activeIds.add(membership.getUser().getId());
            names.put(membership.getUser().getId(), membership.getUser().getName());
        });
        Set<Long> missing = new HashSet<>();
        for (Facts fact : facts) {
            fact.rowsA().forEach(row -> missing.add((Long) row[1]));
            fact.removed().forEach(memberFact -> missing.add(memberFact.memberId()));
            fact.added().forEach(memberFact -> missing.add(memberFact.memberId()));
        }
        missing.removeAll(names.keySet());
        missing.remove(null);
        if (!missing.isEmpty()) {
            userService.findAllById(missing).forEach(user -> names.put(user.getId(), user.getName()));
        }
        return new Members(activeIds, names);
    }

    private record Facts(List<Object[]> rowsA, List<MemberFact> removed, List<MemberFact> added) {}

    private Facts facts(Plan plan, TransactionType type, LocalDate startDate, LocalDate endDate, Long memberId) {
        List<Object[]> rowsA = spendingRepository.findCategoryMemberFacts(plan, type, startDate, endDate, memberId);
        Allocation allocation = itemShareAllocator.allocate(
                spendingRepository.findCategorizedItemParticipantRows(plan, type, startDate, endDate));
        // The member filter applies after allocation, so a member's item portion is the same with or
        // without the filter (closes the former plan-total item gap of the member-filtered dashboard).
        return new Facts(rowsA, forMember(allocation.removed(), memberId), forMember(allocation.added(), memberId));
    }

    private static List<MemberFact> forMember(List<MemberFact> facts, Long memberId) {
        if (memberId == null) {
            return facts;
        }
        return facts.stream()
                .filter(fact -> Objects.equals(fact.memberId(), memberId))
                .toList();
    }

    private static <T> List<T> concat(List<T> first, List<T> second) {
        List<T> all = new ArrayList<>(first);
        all.addAll(second);
        return all;
    }
}
