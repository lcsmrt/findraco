package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.config.SeriesProperties;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceInterval;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesDraft;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.transaction.service.OpenEndedSeriesTopUpService;
import com.lcs.findraco.transaction.service.SeriesTopUpJob;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/** The daily job tops every plan's open-ended series up to today + the horizon and moves the plan's mark. */
class SeriesTopUpJobIT extends AbstractIntegrationTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 7, 1);
    private static final LocalDate HORIZON = TODAY.plusMonths(12);

    private final SeriesProperties properties = new SeriesProperties(12, "-");
    private final Clock fixedClock = Clock.fixed(Instant.parse("2026-07-01T10:00:00Z"), ZoneOffset.UTC);

    @Autowired
    private PlanService planService;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private OpenEndedSeriesTopUpService topUpService;

    @Autowired
    private RecurrenceDefinitionRepository recurrenceDefinitionRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private SeriesTopUpJob job() {
        return new SeriesTopUpJob(planService, topUpService, properties, fixedClock);
    }

    @Test
    void theJobTopsASeriesUpToTheHorizonAndAdvancesTheWatermarks() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        RecurrenceDefinition definition = anOpenEndedDefinition(plan, owner, TODAY.minusMonths(2));

        job().run();

        List<Transaction> occurrences = transactionRepository.findAllByPlanAndSeriesId(plan, definition.getSeriesId());
        assertThat(occurrences)
                .extracting(Transaction::getStartDate)
                .contains(TODAY.minusMonths(2), HORIZON)
                .doesNotContain(HORIZON.plusMonths(1))
                .hasSize(15);
        assertThat(recurrenceDefinitionRepository
                        .findById(definition.getId())
                        .orElseThrow()
                        .getGeneratedThrough())
                .isEqualTo(HORIZON);
        assertThat(planRepository.findById(plan.getId()).orElseThrow().getSeriesGeneratedUntil())
                .isEqualTo(HORIZON);
    }

    @Test
    void theWatermarkAdvancesEvenWhenNoOccurrenceFallsInTheWindow() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        // Day 20 of each month: from the 20th of June-next-year to the horizon (1 July) nothing is due.
        LocalDate start = LocalDate.of(2025, 7, 20);
        RecurrenceDefinition definition = anOpenEndedDefinition(plan, owner, start);
        definition.markGeneratedThrough(LocalDate.of(2026, 6, 20));
        recurrenceDefinitionRepository.save(definition);

        job().run();

        assertThat(transactionRepository.findAllByPlanAndSeriesId(plan, definition.getSeriesId()))
                .extracting(Transaction::getStartDate)
                .doesNotContain(LocalDate.of(2026, 6, 20))
                .hasSize(12);
        assertThat(recurrenceDefinitionRepository
                        .findById(definition.getId())
                        .orElseThrow()
                        .getGeneratedThrough())
                .isEqualTo(HORIZON);
        assertThat(planRepository.findById(plan.getId()).orElseThrow().getSeriesGeneratedUntil())
                .isEqualTo(HORIZON);
    }

    @Test
    void aSecondRunWritesNothingMore() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        RecurrenceDefinition definition = anOpenEndedDefinition(plan, owner, TODAY);

        job().run();
        long afterFirst = transactionRepository
                .findAllByPlanAndSeriesId(plan, definition.getSeriesId())
                .size();
        job().run();

        assertThat(transactionRepository.findAllByPlanAndSeriesId(plan, definition.getSeriesId()))
                .hasSize((int) afterFirst);
        assertThat(planService.findPlanIdsGeneratedBefore(HORIZON)).doesNotContain(plan.getId());
    }

    @Test
    void anExceptedDateIsNotGeneratedAgain() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        RecurrenceDefinition definition = anOpenEndedDefinition(plan, owner, TODAY);
        definition.except(TODAY.plusMonths(3));
        definition.markGeneratedThrough(TODAY.minusMonths(1));
        recurrenceDefinitionRepository.save(definition);

        job().run();

        assertThat(transactionRepository.findAllByPlanAndSeriesId(plan, definition.getSeriesId()))
                .extracting(Transaction::getStartDate)
                .contains(TODAY.plusMonths(2), TODAY.plusMonths(4))
                .doesNotContain(TODAY.plusMonths(3));
    }

    private RecurrenceDefinition anOpenEndedDefinition(Plan plan, User owner, LocalDate start) {
        return recurrenceDefinitionRepository.save(RecurrenceDefinition.create(new SeriesDraft(
                plan,
                owner,
                null,
                TransactionType.DEBIT,
                new BigDecimal("50.00"),
                "Gym",
                RecurrenceMode.RECURRING,
                RecurrenceInterval.MONTHLY,
                null,
                null,
                start,
                null,
                SplitMode.EQUAL,
                List.of(new Share(owner, null)))));
    }
}
