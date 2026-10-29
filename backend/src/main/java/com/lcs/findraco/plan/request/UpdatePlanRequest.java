package com.lcs.findraco.plan.request;

import jakarta.validation.constraints.NotBlank;

public record UpdatePlanRequest(
        @NotBlank(message = "Name cannot be blank.") String name) {}
