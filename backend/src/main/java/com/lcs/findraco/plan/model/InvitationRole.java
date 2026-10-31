package com.lcs.findraco.plan.model;

import com.lcs.findraco.shared.error.NarrowedEnum;

/** The role an invitation grants: any role but owner, which only a transfer hands over. */
public enum InvitationRole implements NarrowedEnum {
    EDITOR(PlanRole.EDITOR),
    CONTRIBUTOR(PlanRole.CONTRIBUTOR),
    VIEWER(PlanRole.VIEWER);

    private final PlanRole role;

    InvitationRole(PlanRole role) {
        this.role = role;
    }

    public PlanRole role() {
        return role;
    }
}
