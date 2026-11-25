package com.lcs.findraco.transaction.request;

import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionKind;
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
import org.jspecify.annotations.Nullable;

/**
 * The body of a new transaction.
 *
 * @param contactId the contact a REPAYMENT came from; sent with that kind only.
 * @param allocations the contact shares a REPAYMENT settles. Omitted, the payment settles the oldest first; an empty
 *     list settles none and leaves the whole amount as credit.
 */
public record CreateTransactionRequest(
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

        TransactionKind kind,

        @Nullable Long contactId,

        @Valid @Size(max = 100, message = "A repayment takes at most 100 allocations.")
        List<RepaymentAllocationRequest> allocations) {

    /** A request that is no repayment. */
    public CreateTransactionRequest(
            Long categoryId,
            TransactionType type,
            BigDecimal amount,
            String description,
            Integer parcelsNumber,
            LocalDate startDate,
            LocalDate endDate,
            SplitMode splitMode,
            List<TransactionParticipantRequest> participants,
            List<TransactionItemRequest> items,
            TransactionKind kind) {
        this(
                categoryId,
                type,
                amount,
                description,
                parcelsNumber,
                startDate,
                endDate,
                splitMode,
                participants,
                items,
                kind,
                null,
                null);
    }
}
