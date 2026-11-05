package com.lcs.findraco.transaction.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * What was really charged for an occurrence that waits for a confirmation.
 *
 * @param version the version the caller read; a confirmation of a version that changed since answers 409.
 */
public record ConfirmTransactionRequest(
        @NotNull(message = "Amount cannot be null.")
        @Positive(message = "Amount must be positive.")
        @Digits(integer = 13, fraction = 2, message = "Amount must have at most 2 decimal places.")
        BigDecimal amount,

        @NotNull(message = "Start date cannot be null.") LocalDate startDate,
        @NotNull(message = "Version cannot be null.") Long version) {}
