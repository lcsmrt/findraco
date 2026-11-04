package com.lcs.findraco.plan.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * When the daily job deletes the plans archived for the retention period. {@code purgeCron} is a Spring cron
 * expression, or {@code -} to turn the schedule and the startup run off.
 */
@Validated
@ConfigurationProperties("app.plans")
public record PlanPurgeProperties(@NotBlank String purgeCron) {}
