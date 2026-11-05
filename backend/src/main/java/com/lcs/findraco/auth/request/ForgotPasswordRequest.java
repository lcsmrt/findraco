package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** {@code language} is the language of the page that asked; the e-mail uses it when the account has none saved. */
public record ForgotPasswordRequest(
        @NotBlank(message = "User email cannot be blank.")
        @Email(message = "Invalid email format.")
        @Size(max = 255, message = "User email cannot exceed 255 characters.")
        String email,

        @Size(max = 10, message = "Language cannot exceed 10 characters.")
        String language) {}
