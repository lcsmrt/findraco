package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank(message = "Reset token cannot be blank.") String token,

        @NotBlank(message = "User password cannot be blank.")
        String password) {}
