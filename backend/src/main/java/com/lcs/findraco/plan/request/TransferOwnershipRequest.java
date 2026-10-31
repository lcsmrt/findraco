package com.lcs.findraco.plan.request;

import com.lcs.findraco.plan.model.TransferredOwnerRole;
import jakarta.validation.constraints.NotNull;

public record TransferOwnershipRequest(
        @NotNull(message = "New owner user id cannot be null.")
        Long newOwnerUserId,

        TransferredOwnerRole previousOwnerRole) {}
