package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "User email cannot be blank.")
        @Size(max = 255, message = "User email cannot exceed 255 characters.")
        String email,

        @NotBlank(message = "User password cannot be blank.")
        @Size(max = 1024, message = "User password cannot exceed 1024 characters.")
        String password) {}
