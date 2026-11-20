package com.lcs.findraco.transaction.request;

import com.lcs.findraco.transaction.model.TransactionKind;
import jakarta.validation.constraints.NotNull;

/**
 * Marks a transaction as a kind, as the review of movements does.
 *
 * @param version the version the caller read; a row that changed since answers 409.
 */
public record SetTransactionKindRequest(
        @NotNull(message = "Kind cannot be null.") TransactionKind kind,
        @NotNull(message = "Version cannot be null.") Long version) {}
