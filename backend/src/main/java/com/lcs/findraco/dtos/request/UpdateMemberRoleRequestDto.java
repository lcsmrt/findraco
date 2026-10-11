package com.lcs.findraco.dtos.request;

import com.lcs.findraco.models.PlanRole;
import jakarta.validation.constraints.NotNull;

public class UpdateMemberRoleRequestDto {

    @NotNull(message = "Role cannot be null.")
    private PlanRole role;

    public PlanRole getRole() {
        return role;
    }
}
