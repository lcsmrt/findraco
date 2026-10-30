package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Reset token cannot be blank.")
        @Size(max = 255, message = "Reset token cannot exceed 255 characters.")
        String token,

        @NotBlank(message = "User password cannot be blank.")
        @Size(max = 128, message = "User password cannot exceed 128 characters.")
        String password) {}
