package com.lcs.findraco.dtos.request;

import com.lcs.findraco.models.PlanRole;
import jakarta.validation.constraints.NotNull;

public class TransferOwnershipRequestDto {

    @NotNull(message = "New owner user id cannot be null.")
    private Long newOwnerUserId;

    private PlanRole previousOwnerRole;

    public Long getNewOwnerUserId() {
        return newOwnerUserId;
    }

    public PlanRole getPreviousOwnerRole() {
        return previousOwnerRole;
    }
}
