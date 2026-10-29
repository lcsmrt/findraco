package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;

public record AcceptInvitationResponse(Long planId, PlanRole role) {

    public static AcceptInvitationResponse from(PlanMembership membership) {
        return new AcceptInvitationResponse(membership.getPlan().getId(), membership.getRole());
    }
}
