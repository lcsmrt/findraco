package com.lcs.findraco.plan.model;

import java.time.Duration;
import java.time.Instant;

/** How long an archived plan can be restored before it is deleted permanently; the frontend states it too. */
public final class PlanRetention {

    public static final Duration PERIOD = Duration.ofDays(30);

    /** Plans archived at or before this instant are due for deletion when the time is {@code now}. */
    public static Instant cutoff(Instant now) {
        return now.minus(PERIOD);
    }

    private PlanRetention() {}
}
