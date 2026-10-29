package com.lcs.findraco.plan.request;

import com.lcs.findraco.plan.model.PlanRole;
import jakarta.validation.constraints.NotNull;

public class UpdateMemberRoleRequestDto {

    @NotNull(message = "Role cannot be null.")
    private PlanRole role;

    public PlanRole getRole() {
        return role;
    }
}
