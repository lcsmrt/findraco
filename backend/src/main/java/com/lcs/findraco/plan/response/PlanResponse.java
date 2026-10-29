package com.lcs.findraco.plan.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;

/** {@code isDefault} keeps its current wire name {@code default} until the contract-shape slice renames it. */
public record PlanResponse(
        Long id, String name, @JsonProperty("default") boolean isDefault, PlanRole myRole) {

    public static PlanResponse from(PlanMembership membership) {
        Plan plan = membership.getPlan();
        return new PlanResponse(plan.getId(), plan.getName(), plan.isDefault(), membership.getRole());
    }
}
