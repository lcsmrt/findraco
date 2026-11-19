package com.lcs.findraco.transaction.service;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDeletion;
import com.lcs.findraco.transaction.model.TransactionDeletionKind;
import com.lcs.findraco.transaction.model.TransactionRetention;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionDeletionRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.transaction.request.TransactionTrashFilter;
import com.lcs.findraco.transaction.response.TransactionCreatorResponse;
import com.lcs.findraco.transaction.response.TransactionRestoredResponse;
import com.lcs.findraco.transaction.response.TransactionTrashEntryResponse;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The plan's transaction trash: what each delete moved there, restoring it as one action, and purging what is
 * older than the retention period.
 */
@Service
public class TransactionTrashService {

    private final TransactionDeletionRepository deletionRepository;
    private final TransactionRepository transactionRepository;
    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final PlanAuthorization planAuthorization;
    private final EntityManager entityManager;

    public TransactionTrashService(
            TransactionDeletionRepository deletionRepository,
            TransactionRepository transactionRepository,
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            PlanAuthorization planAuthorization,
            EntityManager entityManager) {
        this.deletionRepository = deletionRepository;
        this.transactionRepository = transactionRepository;
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.planAuthorization = planAuthorization;
        this.entityManager = entityManager;
    }

    private Plan plan(PlanContext ctx) {
        return entityManager.getReference(Plan.class, ctx.planId());
    }

    /** Owner and editor see every deletion of the plan; a contributor the ones they made. */
    @Transactional(readOnly = true)
    public Page<TransactionTrashEntryResponse> list(TransactionTrashFilter filter, PlanContext ctx) {
        planAuthorization.requireCanUseTransactionTrash(ctx.role());
        Long onlyDeletedBy = ctx.role() == PlanRole.CONTRIBUTOR ? ctx.userId() : null;

        Page<TransactionDeletion> page = deletionRepository.findNewestFirst(
                plan(ctx), onlyDeletedBy, PageRequest.of(filter.page(), filter.size()));
        if (!page.hasContent()) {
            return page.map(deletion -> null);
        }

        Map<Long, Object[]> totals = new HashMap<>();
        for (Object[] row : transactionRepository.summarizeDeletions(page.getContent())) {
            totals.put((Long) row[0], row);
        }
        List<Long> definitionIds = page.getContent().stream()
                .map(TransactionDeletion::getRecurrenceDefinitionId)
                .filter(Objects::nonNull)
                .toList();
        Map<Long, RecurrenceDefinition> definitions = definitionIds.isEmpty()
                ? Map.of()
                : recurrenceDefinitionRepository.findAllByIdIn(definitionIds).stream()
                        .collect(Collectors.toMap(RecurrenceDefinition::getId, definition -> definition));

        return page.map(deletion -> entry(deletion, totals.get(deletion.getId()), definitions));
    }

    private static TransactionTrashEntryResponse entry(
            TransactionDeletion deletion, Object[] totals, Map<Long, RecurrenceDefinition> definitions) {
        RecurrenceDefinition definition = deletion.getKind() == TransactionDeletionKind.SERIES
                ? definitions.get(deletion.getRecurrenceDefinitionId())
                : null;
        String description = definition != null ? definition.getDescription() : (String) totals[3];
        return new TransactionTrashEntryResponse(
                deletion.getId(),
                deletion.getKind(),
                deletion.getScope(),
                description,
                (Long) totals[1],
                (BigDecimal) totals[2],
                (TransactionType) totals[4],
                deletion.getDeletedAt(),
                deletion.getDeletedBy() == null ? null : TransactionCreatorResponse.from(deletion.getDeletedBy()),
                TransactionRetention.expiry(deletion.getDeletedAt()));
    }

    /**
     * Brings back every row of a deletion and undoes what it changed on the series, or refuses with nothing
     * changed. The deletion row is locked, so two restores of it run one after the other and the second finds
     * it gone.
     */
    @Transactional
    public TransactionRestoredResponse restore(Long deletionId, PlanContext ctx) {
        planAuthorization.requireCanUseTransactionTrash(ctx.role());
        TransactionDeletion deletion = deletionRepository
                .findByIdAndPlanForUpdate(deletionId, plan(ctx))
                .filter(found -> visibleTo(found, ctx))
                .orElseThrow(() -> new TransactionExceptions.TrashEntryNotFoundException(deletionId));

        List<Transaction> rows = transactionRepository.findAllByDeletion(deletion);
        for (Transaction row : rows) {
            Long creatorId =
                    row.getCreatedBy() == null ? null : row.getCreatedBy().getId();
            planAuthorization.requireCanModifyTransaction(ctx.role(), creatorId, ctx.userId());
        }

        if (deletion.getRecurrenceDefinitionId() != null) {
            undoSeriesChange(deletion, ctx);
        }
        rows.forEach(Transaction::restore);
        entityManager.flush();
        deletionRepository.delete(deletion);
        return new TransactionRestoredResponse(rows.size());
    }

    private static boolean visibleTo(TransactionDeletion deletion, PlanContext ctx) {
        return ctx.role() != PlanRole.CONTRIBUTOR
                || (deletion.getDeletedBy() != null
                        && deletion.getDeletedBy().getId().equals(ctx.userId()));
    }

    private void undoSeriesChange(TransactionDeletion deletion, PlanContext ctx) {
        RecurrenceDefinition definition = recurrenceDefinitionRepository
                .findByIdAndPlanForUpdate(deletion.getRecurrenceDefinitionId(), plan(ctx))
                .orElseThrow(TransactionExceptions.TrashSeriesChangedException::new);

        if (deletion.isDefinitionTrashed()) {
            // Nothing can edit a trashed series, so it is as the deletion left it.
            if (!definition.isTrashed()) {
                throw new TransactionExceptions.TrashSeriesChangedException();
            }
            definition.restore();
        } else {
            if (definition.isTrashed() || deletion.getDefinitionVersion() != definition.getRuleRevision()) {
                throw new TransactionExceptions.TrashSeriesChangedException();
            }
            if (deletion.getExceptionDate() != null) {
                definition.unexcept(deletion.getExceptionDate());
            }
            if (deletion.getScope() == SeriesEditScope.THIS_AND_FOLLOWING) {
                definition.restoreEnd(deletion.getPreviousParcelsNumber(), deletion.getPreviousEndDate());
            }
        }

        // The plan was told its open-ended series reach the horizon; this one may be behind it now.
        if (definition.getMode() == RecurrenceMode.RECURRING && definition.getEndDate() == null) {
            definition
                    .getPlan()
                    .lowerSeriesGeneratedUntil(
                            definition.getGeneratedThrough() != null
                                    ? definition.getGeneratedThrough()
                                    : definition.getStartDate());
        }
    }

    /** Ids of the deletions made at or before {@code cutoff}, oldest first, for the purge job. */
    @Transactional(readOnly = true)
    public List<Long> findDeletionIdsDueAt(Instant cutoff) {
        return deletionRepository.findIdsDeletedBefore(cutoff);
    }

    /** Deletes the deletion with its rows and trashed series in its own transaction; false when it is gone. */
    @Transactional
    public boolean purge(long deletionId, Instant cutoff) {
        return deletionRepository.deleteDeletedBefore(deletionId, cutoff) > 0;
    }
}
