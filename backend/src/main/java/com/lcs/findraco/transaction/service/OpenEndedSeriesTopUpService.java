package com.lcs.findraco.transaction.service;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.config.SeriesProperties;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Generates the missing occurrences of a plan's open-ended (mode = RECURRING, endDate = null) series
 * up to a date, each from its {@code generatedThrough} mark, with the definition's current amount,
 * category and split, and advances the plan's {@code seriesGeneratedUntil} mark. The daily
 * {@link SeriesTopUpJob} and {@link SeriesHorizon} (a read that goes past the mark) call it; a read
 * inside the mark never does.
 *
 * <p>Bounded series are never touched. Each due definition is row-locked ({@code PESSIMISTIC_WRITE}),
 * so two callers serialize and the later one finds the mark already advanced. Candidates are also
 * filtered against the series' persisted occurrence dates, so a mark reset backward cannot duplicate a row.
 */
@Service
public class OpenEndedSeriesTopUpService {

    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final TransactionRepository transactionRepository;
    private final RecurringTransactionGenerator recurringTransactionGenerator;
    private final SeriesProperties properties;
    private final EntityManager entityManager;

    public OpenEndedSeriesTopUpService(
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            TransactionRepository transactionRepository,
            RecurringTransactionGenerator recurringTransactionGenerator,
            SeriesProperties properties,
            EntityManager entityManager) {
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.transactionRepository = transactionRepository;
        this.recurringTransactionGenerator = recurringTransactionGenerator;
        this.properties = properties;
        this.entityManager = entityManager;
    }

    /** Tops the plan's open-ended series up to the horizon of {@code today}. */
    @Transactional
    public void topUp(long planId, LocalDate today) {
        extendTo(planId, properties.horizonFrom(today));
    }

    /** Tops the plan's open-ended series up through {@code through}, however far past the horizon. */
    @Transactional
    public void extendTo(long planId, LocalDate through) {
        Plan plan = entityManager.getReference(Plan.class, planId);

        List<RecurrenceDefinition> due = recurrenceDefinitionRepository.findOpenEndedDue(plan, through);
        for (RecurrenceDefinition definition : due) {
            topUpOne(definition, through);
        }
        plan.advanceSeriesGeneratedUntil(through);
    }

    private void topUpOne(RecurrenceDefinition definition, LocalDate through) {
        LocalDate afterExclusive = definition.getGeneratedThrough() != null
                ? definition.getGeneratedThrough()
                : definition.getStartDate().minusMonths(1);

        List<Share> shares = definition.getParticipants().stream()
                .map(participant -> new Share(participant.getMember(), participant.getShareAmount()))
                .toList();

        List<Transaction> candidates =
                recurringTransactionGenerator.generateForwardWindow(definition, afterExclusive, through, shares);

        if (!candidates.isEmpty()) {
            Set<LocalDate> existingDates =
                    transactionRepository
                            .findAllByPlanAndSeriesId(definition.getPlan(), definition.getSeriesId())
                            .stream()
                            .map(Transaction::getStartDate)
                            .collect(Collectors.toSet());

            List<Transaction> toPersist = candidates.stream()
                    .filter(occurrence -> !existingDates.contains(occurrence.getStartDate()))
                    .toList();
            if (!toPersist.isEmpty()) {
                transactionRepository.saveAll(toPersist);
            }
        }

        // The mark moves to the requested date even when no occurrence fell in the window, so the
        // series is not due again until the horizon moves.
        definition.markGeneratedThrough(through);
        recurrenceDefinitionRepository.save(definition);
    }
}
