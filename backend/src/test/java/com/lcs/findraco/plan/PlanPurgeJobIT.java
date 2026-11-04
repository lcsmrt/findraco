package com.lcs.findraco.plan;

import static org.assertj.core.api.Assertions.assertThat;

import ch.qos.logback.classic.Level;
import com.lcs.findraco.plan.config.PlanPurgeProperties;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRetention;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.plan.service.PlanPurgeJob;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.CapturedLogs;
import com.lcs.findraco.user.model.User;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/** The daily job deletes every plan archived for the retention period or longer, one plan per transaction. */
class PlanPurgeJobIT extends AbstractIntegrationTest {

    private static final Instant NOW = Instant.parse("2026-07-31T10:00:00Z");

    private final Clock fixedClock = Clock.fixed(NOW, ZoneOffset.UTC);

    @Autowired
    private PlanService planService;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private PlanPurgeJob job() {
        return jobWithCron("-");
    }

    private PlanPurgeJob jobWithCron(String cron) {
        return new PlanPurgeJob(planService, new PlanPurgeProperties(cron), fixedClock);
    }

    private Plan archivedDaysAgo(User owner, int days) {
        Plan plan = fixtures.aPlan(owner);
        plan.setDeletedAt(NOW.minus(Duration.ofDays(days)));
        return planRepository.save(plan);
    }

    private boolean exists(Plan plan) {
        return planRepository.existsById(plan.getId());
    }

    @Test
    void aPlanArchivedExactlyThirtyDaysAgoIsDeletedAndYoungerOrActivePlansStay() {
        User owner = fixtures.aUser();
        Plan thirtyDays = archivedDaysAgo(owner, 30);
        Plan olderStill = archivedDaysAgo(owner, 90);
        Plan twentyNineDays = archivedDaysAgo(owner, 29);
        Plan active = fixtures.aPlan(owner);

        job().run();

        assertThat(PlanRetention.PERIOD).isEqualTo(Duration.ofDays(30));
        assertThat(exists(thirtyDays)).isFalse();
        assertThat(exists(olderStill)).isFalse();
        assertThat(exists(twentyNineDays)).isTrue();
        assertThat(exists(active)).isTrue();
    }

    @Test
    void aPlanRestoredAfterTheIdListWasReadIsNotDeleted() {
        User owner = fixtures.aUser();
        Plan plan = archivedDaysAgo(owner, 45);
        Instant cutoff = NOW.minus(PlanRetention.PERIOD);
        assertThat(planService.findPlanIdsArchivedBefore(cutoff)).containsExactly(plan.getId());

        plan.setDeletedAt(null);
        planRepository.save(plan);

        assertThat(planService.purge(plan.getId(), cutoff)).isFalse();
        assertThat(exists(plan)).isTrue();
    }

    @Test
    void purgeRefusesAPlanArchivedLessThanThePeriodAgoEvenWhenHandedItsId() {
        User owner = fixtures.aUser();
        Plan plan = archivedDaysAgo(owner, 29);

        assertThat(planService.purge(plan.getId(), NOW.minus(PlanRetention.PERIOD)))
                .isFalse();
        assertThat(exists(plan)).isTrue();
    }

    @Test
    void purgeRefusesAnActivePlanEvenWhenHandedItsId() {
        User owner = fixtures.aUser();
        Plan active = fixtures.aPlan(owner);

        assertThat(planService.purge(active.getId(), NOW.minus(PlanRetention.PERIOD)))
                .isFalse();
        assertThat(exists(active)).isTrue();
    }

    @Test
    void theStartupRunDoesNothingWhenTheCronIsTheDisabledMarker() {
        User owner = fixtures.aUser();
        Plan overdue = archivedDaysAgo(owner, 31);

        jobWithCron("-").runAtStartup();

        assertThat(exists(overdue)).isTrue();
    }

    @Test
    void theStartupRunPurgesWhenTheCronIsReal() {
        User owner = fixtures.aUser();
        Plan overdue = archivedDaysAgo(owner, 31);

        jobWithCron("0 0 3 * * *").runAtStartup();

        assertThat(exists(overdue)).isFalse();
    }

    @Test
    void theCompletionLogCarriesTheCountAndPlanIdsAndNoPlanName() {
        User owner = fixtures.aUser();
        Plan purged = archivedDaysAgo(owner, 31);
        Plan kept = archivedDaysAgo(owner, 2);

        try (CapturedLogs logs = CapturedLogs.of(PlanPurgeJob.class)) {
            job().run();

            assertThat(logs.lines())
                    .singleElement()
                    .asString()
                    .contains("Purged 1 archived plans: [" + purged.getId() + "]")
                    .doesNotContain(purged.getName())
                    .doesNotContain(kept.getName());
        }
    }

    @Test
    void aPlanThatFailsIsLoggedByIdTheOthersAreStillDeletedAndItIsRetriedNextRun() {
        User owner = fixtures.aUser();
        Plan failing = archivedDaysAgo(owner, 40);
        Plan other = archivedDaysAgo(owner, 50);
        jdbcTemplate.execute("CREATE FUNCTION refuse_plan_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN"
                + " RAISE EXCEPTION 'refused'; END $$");
        jdbcTemplate.execute("CREATE TRIGGER refuse_plan_delete BEFORE DELETE ON plans FOR EACH ROW"
                + " WHEN (OLD.id = " + failing.getId() + ") EXECUTE FUNCTION refuse_plan_delete()");
        try (CapturedLogs logs = CapturedLogs.of(PlanPurgeJob.class)) {
            try {
                job().run();
            } finally {
                jdbcTemplate.execute("DROP TRIGGER refuse_plan_delete ON plans");
                jdbcTemplate.execute("DROP FUNCTION refuse_plan_delete()");
            }

            assertThat(exists(failing)).isTrue();
            assertThat(exists(other)).isFalse();
            assertThat(logs.events())
                    .filteredOn(event -> event.getLevel() == Level.ERROR)
                    .singleElement()
                    .satisfies(event -> assertThat(event.getFormattedMessage()).contains("plan " + failing.getId()));
            assertThat(logs.lines())
                    .anySatisfy(line -> assertThat(line).contains("Purged 1 archived plans: [" + other.getId() + "]"));

            job().run();

            assertThat(exists(failing)).isFalse();
        }
    }
}
