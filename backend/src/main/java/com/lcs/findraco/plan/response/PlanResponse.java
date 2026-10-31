package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;

public record PlanResponse(
        Long id, String name, boolean isDefault, PlanRole myRole, PlanPermissionsResponse permissions) {

    public static PlanResponse from(PlanMembership membership, PlanPermissionsResponse permissions) {
        Plan plan = membership.getPlan();
        return new PlanResponse(plan.getId(), plan.getName(), plan.isDefault(), membership.getRole(), permissions);
    }
}
