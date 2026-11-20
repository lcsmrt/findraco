package com.lcs.findraco.transaction.service;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.transaction.request.NeutralCandidateFilter;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

/**
 * Finds the rows with no kind whose bank text looks like a neutral movement, for a member to review. A contributor
 * reviews only the rows they created. The text rules are in {@link NeutralMovementRules}.
 */
@Component
public class NeutralCandidateFinder {

    /** A row of the review and the kind proposed for it. */
    public record Candidate(Transaction transaction, TransactionKind proposedKind) {}

    private final TransactionRepository transactionRepository;
    private final PlanService planService;
    private final EntityManager entityManager;

    public NeutralCandidateFinder(
            TransactionRepository transactionRepository, PlanService planService, EntityManager entityManager) {
        this.transactionRepository = transactionRepository;
        this.planService = planService;
        this.entityManager = entityManager;
    }

    /**
     * One page of candidates, newest first. The text is matched here rather than in the query, since a name match
     * ignores accents and the plan's members decide it; the database only narrows the rows by their text.
     */
    public Page<Candidate> find(NeutralCandidateFilter filter, PlanContext ctx) {
        Plan plan = entityManager.getReference(Plan.class, ctx.planId());
        Long creatorId = ctx.role() == PlanRole.CONTRIBUTOR ? ctx.userId() : null;
        List<String> memberNames = planService.findMemberships(ctx.planId()).stream()
                .map(membership -> membership.getUser().getName())
                .toList();

        Map<Long, TransactionKind> proposedById = new LinkedHashMap<>();
        for (Object[] row : transactionRepository.findNeutralCandidateTexts(plan, creatorId)) {
            TransactionKind proposed = NeutralMovementRules.propose((String) row[1], memberNames);
            if (proposed != null) {
                proposedById.put((Long) row[0], proposed);
            }
        }

        PageRequest pageable = PageRequest.of(filter.page(), filter.size());
        List<Long> pageIds = proposedById.keySet().stream()
                .skip(pageable.getOffset())
                .limit(pageable.getPageSize())
                .toList();
        if (pageIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, proposedById.size());
        }

        List<Transaction> rows = transactionRepository.findAllWithDetailsByIdIn(pageIds);
        transactionRepository.fetchParticipants(rows);
        transactionRepository.fetchItems(rows);
        Map<Long, Transaction> rowsById =
                rows.stream().collect(Collectors.toMap(Transaction::getId, Function.identity()));
        List<Candidate> candidates = new ArrayList<>();
        pageIds.forEach(id -> candidates.add(new Candidate(rowsById.get(id), proposedById.get(id))));
        return new PageImpl<>(candidates, pageable, proposedById.size());
    }
}
