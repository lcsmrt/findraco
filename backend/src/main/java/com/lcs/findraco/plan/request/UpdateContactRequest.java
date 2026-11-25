package com.lcs.findraco.plan.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * The body of a contact rename.
 *
 * @param version the version the caller read; a rename of a version that changed since answers 409.
 */
public record UpdateContactRequest(
        @NotBlank(message = "Name cannot be blank.") @Size(max = 60, message = "Name cannot exceed 60 characters.")
        String name,

        @NotNull(message = "Version cannot be null.") Long version) {}
