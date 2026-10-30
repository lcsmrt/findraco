package com.lcs.findraco.auth.request;

import com.lcs.findraco.shared.security.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Reset token cannot be blank.")
        @Size(max = 255, message = "Reset token cannot exceed 255 characters.")
        String token,

        @NotBlank(message = "User password cannot be blank.") @ValidPassword
        String password) {}
