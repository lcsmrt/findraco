package com.lcs.findraco.plan.request;

import jakarta.validation.constraints.NotBlank;

public record CreatePlanRequest(
        @NotBlank(message = "Name cannot be blank.") String name) {}
