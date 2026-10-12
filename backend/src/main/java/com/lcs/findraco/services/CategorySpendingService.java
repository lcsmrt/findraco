package com.lcs.findraco.services;

import com.lcs.findraco.dtos.request.CategorySpendingFilterDto;
import com.lcs.findraco.dtos.response.CategorySpendingDto;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.Plan;
import com.lcs.findraco.repositories.FinancialTransactionCategoryRepository;
import com.lcs.findraco.repositories.FinancialTransactionRepository;
import com.lcs.findraco.repositories.PlanMembershipRepository;
import com.lcs.findraco.repositories.UserRepository;
import com.lcs.findraco.security.PlanContext;
import com.lcs.findraco.services.ItemShareAllocator.Allocation;
import com.lcs.findraco.services.ItemShareAllocator.MemberFact;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * The single source of category spend (AD-008): the Overview breakdown and the Categories tab both
 * read it, so the two can never disagree. Fetches the per category x member facts, allocates
 * categorized items across participants, and hands both to {@link CategorySpendingAssembler}.
 */
@Service
public class CategorySpendingService {

    private final FinancialTransactionRepository transactionRepository;
    private final FinancialTransactionCategoryRepository categoryRepository;
    private final PlanMembershipRepository planMembershipRepository;
    private final UserRepository userRepository;
    private final ItemShareAllocator itemShareAllocator;
    private final CategorySpendingAssembler assembler;
    private final OpenEndedSeriesTopUpService openEndedSeriesTopUpService;
    private final Clock clock;

    public CategorySpendingService(FinancialTransactionRepository transactionRepository,
                                   FinancialTransactionCategoryRepository categoryRepository,
                                   PlanMembershipRepository planMembershipRepository,
                                   UserRepository userRepository,
                                   ItemShareAllocator itemShareAllocator,
                                   CategorySpendingAssembler assembler,
                                   OpenEndedSeriesTopUpService openEndedSeriesTopUpService,
                                   Clock clock) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.planMembershipRepository = planMembershipRepository;
        this.userRepository = userRepository;
        this.itemShareAllocator = itemShareAllocator;
        this.assembler = assembler;
        this.openEndedSeriesTopUpService = openEndedSeriesTopUpService;
        this.clock = clock;
    }

    /**
     * The Categories tab (CAT-01/02): every category of the plan for the period. Open-ended series are
     * topped up first, as the dashboard does, so the tab and the Overview read the same transactions.
     */
    @Transactional(readOnly = true)
    public List<CategorySpendingDto> getSpending(CategorySpendingFilterDto filter, PlanContext ctx) {
        openEndedSeriesTopUpService.topUp(ctx.getPlan(), LocalDate.now(clock));
        return compute(ctx.getPlan(), filter.getStartDate(), filter.getEndDate(), null);
    }

    /** Every category of the plan (DEBIT then CREDIT trees, zero spend included) for the period. */
    @Transactional(readOnly = true)
    public List<CategorySpendingDto> compute(Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        Facts debit = facts(plan, FinancialTransactionType.DEBIT, startDate, endDate, memberId);
        Facts credit = facts(plan, FinancialTransactionType.CREDIT, startDate, endDate, memberId);
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
    public List<CategorySpendingDto> computeOverview(Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        Facts debit = facts(plan, FinancialTransactionType.DEBIT, startDate, endDate, memberId);
        List<FinancialTransactionCategory> categories = categoryRepository.findAllByPlanWithDetails(plan);
        Members members = members(plan, debit);
        return assembler.assembleOverview(debit.rowsA(), debit.removed(), debit.added(), categories,
                members.activeIds(), members.names(), memberId);
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
        planMembershipRepository.findAllByPlan(plan).forEach(membership -> {
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
            userRepository.findAllById(missing).forEach(user -> names.put(user.getId(), user.getName()));
        }
        return new Members(activeIds, names);
    }

    private record Facts(List<Object[]> rowsA, List<MemberFact> removed, List<MemberFact> added) {}

    private Facts facts(Plan plan, FinancialTransactionType type, LocalDate startDate, LocalDate endDate, Long memberId) {
        List<Object[]> rowsA = transactionRepository.findCategoryMemberFacts(plan, type, startDate, endDate, memberId);
        Allocation allocation = itemShareAllocator.allocate(
                transactionRepository.findCategorizedItemParticipantRows(plan, type, startDate, endDate));
        // The member filter applies after allocation, so a member's item portion is the same with or
        // without the filter (closes the former plan-total item gap of the member-filtered dashboard).
        return new Facts(rowsA, forMember(allocation.removed(), memberId), forMember(allocation.added(), memberId));
    }

    private static List<MemberFact> forMember(List<MemberFact> facts, Long memberId) {
        if (memberId == null) {
            return facts;
        }
        return facts.stream().filter(fact -> Objects.equals(fact.memberId(), memberId)).toList();
    }

    private static <T> List<T> concat(List<T> first, List<T> second) {
        List<T> all = new ArrayList<>(first);
        all.addAll(second);
        return all;
    }
}
