package com.lcs.findraco.transaction.request;

import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * The body of a transaction edit; it replaces every editable field, participants and items included.
 *
 * @param version the version the caller read; an edit of a version that changed since answers 409.
 */
public record UpdateTransactionRequest(
        Long categoryId,

        @NotNull(message = "Transaction type cannot be null.")
        TransactionType type,

        @NotNull(message = "Amount cannot be null.") @Positive(message = "Amount must be positive.")
        BigDecimal amount,

        @NotBlank(message = "Description cannot be blank.") String description,
        Integer parcelsNumber,
        @NotNull(message = "Start date cannot be null.") LocalDate startDate,
        LocalDate endDate,
        SplitMode splitMode,
        @Valid List<TransactionParticipantRequest> participants,
        @Valid List<TransactionItemRequest> items,
        @NotNull(message = "Version cannot be null.") Long version) {}
