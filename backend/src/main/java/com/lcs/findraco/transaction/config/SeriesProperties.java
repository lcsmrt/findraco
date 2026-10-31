package com.lcs.findraco.transaction.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * How far ahead open-ended series are generated and when the daily job tops them up.
 * {@code topUpCron} is a Spring cron expression, or {@code -} to turn the schedule and the startup run off.
 */
@Validated
@ConfigurationProperties("app.series")
public record SeriesProperties(
        @Positive int horizonMonths, @NotBlank String topUpCron) {

    /** The last date an open-ended series is generated to when today is {@code today}. */
    public LocalDate horizonFrom(LocalDate today) {
        return today.plusMonths(horizonMonths);
    }
}
