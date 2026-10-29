package com.lcs.findraco.plan.request;

import jakarta.validation.constraints.NotBlank;

public class PlanRequestDto {

    @NotBlank(message = "Name cannot be blank.")
    private String name;

    public String getName() {
        return name;
    }
}
