package com.lcs.findraco.user.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateUserRequest(
        @NotBlank(message = "User name cannot be blank.") String name,

        @NotBlank(message = "User email cannot be blank.") @Email(message = "Invalid email format.")
        String email,

        @NotBlank(message = "User password cannot be blank.")
        String password) {}
