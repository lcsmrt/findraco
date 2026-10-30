package com.lcs.findraco.plan.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePlanRequest(
        @NotBlank(message = "Name cannot be blank.") @Size(max = 255, message = "Name cannot exceed 255 characters.")
        String name) {}
