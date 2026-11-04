package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRetention;
import java.time.Instant;

public record ArchivedPlanResponse(Long id, String name, Instant archivedAt, Instant deletesAt) {

    public static ArchivedPlanResponse from(Plan plan) {
        Instant archivedAt = plan.getDeletedAt();
        return new ArchivedPlanResponse(
                plan.getId(), plan.getName(), archivedAt, archivedAt.plus(PlanRetention.PERIOD));
    }
}
