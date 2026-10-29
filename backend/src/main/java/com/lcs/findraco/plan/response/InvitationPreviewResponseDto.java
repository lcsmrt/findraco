package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.PlanInvitation;
import com.lcs.findraco.plan.model.PlanRole;

public class InvitationPreviewResponseDto {
    private final String planName;
    private final PlanRole role;
    private final String invitedByName;

    public InvitationPreviewResponseDto(PlanInvitation invitation) {
        this.planName = invitation.getPlan().getName();
        this.role = invitation.getRole();
        this.invitedByName = invitation.getInvitedBy().getName();
    }

    public String getPlanName() {
        return planName;
    }

    public PlanRole getRole() {
        return role;
    }

    public String getInvitedByName() {
        return invitedByName;
    }
}
