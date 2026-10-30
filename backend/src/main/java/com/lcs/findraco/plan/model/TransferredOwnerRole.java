package com.lcs.findraco.plan.model;

import com.lcs.findraco.shared.error.NarrowedEnum;

/** The role the previous owner keeps after handing the plan over: any role but owner. */
public enum TransferredOwnerRole implements NarrowedEnum {
    EDITOR(PlanRole.EDITOR),
    CONTRIBUTOR(PlanRole.CONTRIBUTOR),
    VIEWER(PlanRole.VIEWER);

    private final PlanRole role;

    TransferredOwnerRole(PlanRole role) {
        this.role = role;
    }

    public PlanRole role() {
        return role;
    }
}
