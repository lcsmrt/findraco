package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;

public class AcceptInvitationResponseDto {
    private final Long planId;
    private final PlanRole role;

    public AcceptInvitationResponseDto(PlanMembership membership) {
        this.planId = membership.getPlan().getId();
        this.role = membership.getRole();
    }

    public Long getPlanId() {
        return planId;
    }

    public PlanRole getRole() {
        return role;
    }
}
