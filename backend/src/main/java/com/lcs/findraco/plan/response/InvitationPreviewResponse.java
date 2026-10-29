package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.PlanInvitation;
import com.lcs.findraco.plan.model.PlanRole;

public record InvitationPreviewResponse(String planName, PlanRole role, String invitedByName) {

    public static InvitationPreviewResponse from(PlanInvitation invitation) {
        return new InvitationPreviewResponse(
                invitation.getPlan().getName(),
                invitation.getRole(),
                invitation.getInvitedBy().getName());
    }
}
