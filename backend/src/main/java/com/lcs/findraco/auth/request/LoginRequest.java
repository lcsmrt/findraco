package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "User email cannot be blank.") String email,

        @NotBlank(message = "User password cannot be blank.")
        String password) {}
