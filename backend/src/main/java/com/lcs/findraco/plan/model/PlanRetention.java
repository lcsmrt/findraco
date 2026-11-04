package com.lcs.findraco.plan.model;

import java.time.Duration;

/** How long an archived plan can be restored before it is deleted permanently; the frontend states it too. */
public final class PlanRetention {

    public static final Duration PERIOD = Duration.ofDays(30);

    private PlanRetention() {}
}
