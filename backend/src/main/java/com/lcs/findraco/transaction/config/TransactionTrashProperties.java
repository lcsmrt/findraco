package com.lcs.findraco.transaction.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * When the daily job deletes the transactions trashed for the retention period. {@code trashPurgeCron} is a
 * Spring cron expression, or {@code -} to turn the schedule and the startup run off.
 */
@Validated
@ConfigurationProperties("app.transactions")
public record TransactionTrashProperties(@NotBlank String trashPurgeCron) {}
