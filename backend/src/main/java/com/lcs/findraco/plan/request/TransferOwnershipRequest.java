package com.lcs.findraco.plan.request;

import com.lcs.findraco.plan.model.PlanRole;
import jakarta.validation.constraints.NotNull;

public record TransferOwnershipRequest(
        @NotNull(message = "New owner user id cannot be null.")
        Long newOwnerUserId,

        PlanRole previousOwnerRole) {}
