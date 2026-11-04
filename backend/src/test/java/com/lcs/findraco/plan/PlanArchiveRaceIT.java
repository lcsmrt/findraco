package com.lcs.findraco.plan;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.model.User;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * "Restore" and "Delete now" on the same archived plan at once: the first to commit wins. A transaction holds the
 * plan's row lock while the competing request is sent, then acts and commits; the request that waited answers
 * from what the first one committed.
 */
class PlanArchiveRaceIT extends AbstractIntegrationTest {

    private static final long WAIT_SECONDS = 20;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PlatformTransactionManager transactionManager;

    private Plan archivedPlan(User owner) {
        Plan plan = fixtures.aPlan(owner);
        plan.setDeletedAt(fixtures.now().minus(Duration.ofDays(3)));
        return planRepository.save(plan);
    }

    /** Holds the plan's row lock, sends the competing request, waits until it is blocked, then runs {@code winner}. */
    private MvcResult raceAgainst(Plan plan, Callable<MvcResult> loserRequest, Consumer<Plan> winner) throws Exception {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        try {
            Future<MvcResult> loser;
            TransactionTemplate transaction = new TransactionTemplate(transactionManager);
            loser = transaction.execute(status -> {
                Plan locked = planRepository.findByIdForUpdate(plan.getId()).orElseThrow();
                Future<MvcResult> pending = executor.submit(loserRequest);
                awaitBlockedOnALock(pending);
                winner.accept(locked);
                return pending;
            });
            return loser.get(WAIT_SECONDS, TimeUnit.SECONDS);
        } finally {
            executor.shutdownNow();
        }
    }

    private void awaitBlockedOnALock(Future<MvcResult> pending) {
        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(WAIT_SECONDS);
        while (System.nanoTime() < deadline) {
            if (pending.isDone()) {
                throw new AssertionError("The competing request finished without waiting for the plan row lock");
            }
            Integer waiting = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM pg_stat_activity WHERE wait_event_type = 'Lock'"
                            + " AND datname = current_database()",
                    Integer.class);
            if (waiting != null && waiting > 0) {
                return;
            }
            try {
                Thread.sleep(25);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new AssertionError("Interrupted while waiting for the competing request to block", e);
            }
        }
        throw new AssertionError("The competing request never blocked on the plan row lock");
    }

    @Test
    void aRestoreThatWaitedOnADeleteNowAnswersNotFoundAndThePlanStaysDeleted() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = archivedPlan(owner);

        MvcResult restoreAnswer = raceAgainst(
                plan,
                () -> mockMvc.perform(post(ApiRoutes.PLAN + "/{id}/restore", plan.getId())
                                .with(testAuthHelper.asUser(owner)))
                        .andReturn(),
                locked -> assertThat(planRepository.deleteArchivedBefore(plan.getId(), Instant.now()))
                        .isEqualTo(1));

        problem(HttpStatus.NOT_FOUND, "plan-not-found").match(restoreAnswer);
        assertThat(planRepository.existsById(plan.getId())).isFalse();
    }

    @Test
    void aDeleteNowThatWaitedOnARestoreAnswersNotArchivedAndThePlanStaysActive() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = archivedPlan(owner);

        MvcResult deleteAnswer = raceAgainst(
                plan,
                () -> mockMvc.perform(delete(ApiRoutes.PLAN + "/{id}/permanent", plan.getId())
                                .with(testAuthHelper.asUser(owner)))
                        .andReturn(),
                locked -> locked.setDeletedAt(null));

        problem(HttpStatus.CONFLICT, "plan-not-archived").match(deleteAnswer);
        assertThat(planRepository.findById(plan.getId()).orElseThrow().getDeletedAt())
                .isNull();
    }
}
