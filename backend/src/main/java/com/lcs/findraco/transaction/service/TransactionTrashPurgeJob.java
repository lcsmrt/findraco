package com.lcs.findraco.transaction.service;

import com.lcs.findraco.transaction.config.TransactionTrashProperties;
import com.lcs.findraco.transaction.model.TransactionRetention;
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
 * Deletes every transaction deletion made for the retention period or longer once a day
 * ({@code app.transactions.trash-purge-cron}), and once at startup to cover downtime, with its trashed rows and
 * series. One application instance runs it; several would need a distributed lock. Each deletion goes in its own
 * transaction: one that fails is logged by id, the rest still run, and it is retried on the next run. Logs carry
 * deletion ids only.
 */
@Component
public class TransactionTrashPurgeJob {

    private static final Logger log = LoggerFactory.getLogger(TransactionTrashPurgeJob.class);

    private final TransactionTrashService trashService;
    private final TransactionTrashProperties properties;
    private final Clock clock;

    public TransactionTrashPurgeJob(
            TransactionTrashService trashService, TransactionTrashProperties properties, Clock clock) {
        this.trashService = trashService;
        this.properties = properties;
        this.clock = clock;
    }

    @Scheduled(cron = "${app.transactions.trash-purge-cron}")
    public void scheduledRun() {
        run();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runAtStartup() {
        if (!Scheduled.CRON_DISABLED.equals(properties.trashPurgeCron())) {
            run();
        }
    }

    /** Deletes the deletions made at or before the retention cutoff. */
    public void run() {
        Instant cutoff = TransactionRetention.cutoff(clock.instant());
        List<Long> purged = new ArrayList<>();
        for (long deletionId : trashService.findDeletionIdsDueAt(cutoff)) {
            try {
                if (trashService.purge(deletionId, cutoff)) {
                    purged.add(deletionId);
                }
            } catch (RuntimeException e) {
                log.error("Trash purge failed for deletion {}", deletionId, e);
            }
        }
        log.info("Purged {} trash deletions: {}", purged.size(), purged);
    }
}
