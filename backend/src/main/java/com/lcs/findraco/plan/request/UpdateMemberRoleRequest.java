package com.lcs.findraco.plan.request;

import com.lcs.findraco.plan.model.PlanRole;
import jakarta.validation.constraints.NotNull;

public record UpdateMemberRoleRequest(
        @NotNull(message = "Role cannot be null.") PlanRole role) {}
