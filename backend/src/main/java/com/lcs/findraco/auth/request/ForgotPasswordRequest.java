package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** {@code language} is the language of the page that asked; the e-mail uses it when the account has none saved. Any tag up to a BCP 47 length is accepted; one we do not write falls back to English. */
public record ForgotPasswordRequest(
        @NotBlank(message = "User email cannot be blank.")
        @Email(message = "Invalid email format.")
        @Size(max = 255, message = "User email cannot exceed 255 characters.")
        String email,

        @Size(max = 35, message = "Language cannot exceed 35 characters.")
        String language) {}
