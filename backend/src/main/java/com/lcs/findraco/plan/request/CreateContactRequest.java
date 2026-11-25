package com.lcs.findraco.plan.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** The body of a new contact. */
public record CreateContactRequest(
        @NotBlank(message = "Name cannot be blank.") @Size(max = 60, message = "Name cannot exceed 60 characters.")
        String name) {}
