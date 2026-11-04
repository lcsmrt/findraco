package com.lcs.findraco.plan.service;

import com.lcs.findraco.plan.config.PlanPurgeProperties;
import com.lcs.findraco.plan.model.PlanRetention;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Deletes every plan archived for the retention period or longer once a day ({@code app.plans.purge-cron}), and
 * once at startup to cover downtime. One application instance runs it; several would need a distributed lock.
 * Each plan goes in its own transaction: one that fails is logged by id, the rest still run, and it is retried on
 * the next run. Logs carry plan ids only.
 */
@Component
public class PlanPurgeJob {

    private static final Logger log = LoggerFactory.getLogger(PlanPurgeJob.class);

    private final PlanService planService;
    private final PlanPurgeProperties properties;
    private final Clock clock;

    public PlanPurgeJob(PlanService planService, PlanPurgeProperties properties, Clock clock) {
        this.planService = planService;
        this.properties = properties;
        this.clock = clock;
    }

    @Scheduled(cron = "${app.plans.purge-cron}")
    public void scheduledRun() {
        run();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runAtStartup() {
        if (!Scheduled.CRON_DISABLED.equals(properties.purgeCron())) {
            run();
        }
    }

    /** Deletes the plans archived at or before the retention cutoff. */
    public void run() {
        Instant cutoff = PlanRetention.cutoff(clock.instant());
        List<Long> purged = new ArrayList<>();
        for (long planId : planService.findPlanIdsArchivedBefore(cutoff)) {
            try {
                if (planService.purge(planId, cutoff)) {
                    purged.add(planId);
                }
            } catch (RuntimeException e) {
                log.error("Plan purge failed for plan {}", planId, e);
            }
        }
        log.info("Purged {} archived plans: {}", purged.size(), purged);
    }
}
