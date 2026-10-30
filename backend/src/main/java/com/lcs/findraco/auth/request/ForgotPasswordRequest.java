package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForgotPasswordRequest(
        @NotBlank(message = "User email cannot be blank.")
        @Email(message = "Invalid email format.")
        @Size(max = 255, message = "User email cannot exceed 255 characters.")
        String email) {}
