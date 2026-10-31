package com.lcs.findraco.transaction.service;

import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.transaction.config.SeriesProperties;
import java.time.Clock;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Tops every plan's open-ended series up to the horizon once a day ({@code app.series.top-up-cron}),
 * and once at startup to cover downtime. One application instance runs it; several would need a
 * distributed lock. A plan that fails is logged and the next one still runs.
 */
@Component
public class SeriesTopUpJob {

    private static final Logger log = LoggerFactory.getLogger(SeriesTopUpJob.class);

    private final PlanService planService;
    private final OpenEndedSeriesTopUpService topUpService;
    private final SeriesProperties properties;
    private final Clock clock;

    public SeriesTopUpJob(
            PlanService planService,
            OpenEndedSeriesTopUpService topUpService,
            SeriesProperties properties,
            Clock clock) {
        this.planService = planService;
        this.topUpService = topUpService;
        this.properties = properties;
        this.clock = clock;
    }

    @Scheduled(cron = "${app.series.top-up-cron}")
    public void scheduledRun() {
        run();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runAtStartup() {
        if (!Scheduled.CRON_DISABLED.equals(properties.topUpCron())) {
            run();
        }
    }

    /** Tops up every plan whose mark is behind today's horizon. */
    public void run() {
        LocalDate horizon = properties.horizonFrom(LocalDate.now(clock));
        for (long planId : planService.findPlanIdsGeneratedBefore(horizon)) {
            try {
                topUpService.extendTo(planId, horizon);
            } catch (RuntimeException e) {
                log.error("Series top-up failed for plan {}", planId, e);
            }
        }
    }
}
