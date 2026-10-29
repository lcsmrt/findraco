package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = "User email cannot be blank.") @Email(message = "Invalid email format.")
        String email) {}
