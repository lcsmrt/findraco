package com.lcs.findraco.shared.ratelimit;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.hibernate.validator.constraints.time.DurationMin;

/** At most {@code capacity} calls per key in each {@code period}. */
public record RateLimitRule(
        @Min(1) int capacity,
        @NotNull @DurationMin(seconds = 1) Duration period) {}
