package com.lcs.findraco.user.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** {@code language} is a language tag the app translates into: {@code en} or {@code pt-BR}. */
public record UpdateLanguageRequest(
        @NotNull(message = "Language cannot be null.")
        @Size(max = 5, message = "Language cannot exceed 5 characters.")
        @Pattern(regexp = "en|pt-BR", message = "Language must be en or pt-BR.")
        String language) {}
