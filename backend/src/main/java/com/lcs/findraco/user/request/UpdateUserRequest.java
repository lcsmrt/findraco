package com.lcs.findraco.user.request;

import com.lcs.findraco.shared.security.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @NotBlank(message = "User name cannot be blank.")
        @Size(max = 255, message = "User name cannot exceed 255 characters.")
        String name,

        @NotBlank(message = "User email cannot be blank.")
        @Email(message = "Invalid email format.")
        @Size(max = 255, message = "User email cannot exceed 255 characters.")
        String email,

        @NotBlank(message = "User password cannot be blank.") @ValidPassword
        String password) {}
