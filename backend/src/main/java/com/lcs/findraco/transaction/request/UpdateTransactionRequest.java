package com.lcs.findraco.transaction.request;

import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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

        @NotNull(message = "Amount cannot be null.")
        @Positive(message = "Amount must be positive.")
        @Digits(integer = 13, fraction = 2, message = "Amount must have at most 2 decimal places.")
        BigDecimal amount,

        @NotBlank(message = "Description cannot be blank.")
        @Size(max = 255, message = "Description cannot exceed 255 characters.")
        String description,

        @Min(value = 1, message = "Parcels number must be at least 1.")
        @Max(value = 120, message = "Parcels number cannot exceed 120.")
        Integer parcelsNumber,

        @NotNull(message = "Start date cannot be null.") LocalDate startDate,
        LocalDate endDate,
        SplitMode splitMode,

        @Valid @Size(max = 50, message = "A transaction takes at most 50 participants.")
        List<TransactionParticipantRequest> participants,

        @Valid @Size(max = 100, message = "A transaction takes at most 100 items.")
        List<TransactionItemRequest> items,

        @NotNull(message = "Version cannot be null.") Long version) {}
