package com.lcs.findraco.transaction.request;

import com.lcs.findraco.transaction.model.RecurrenceInterval;
import com.lcs.findraco.transaction.model.RecurrenceMode;
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
 * The body of a new installment or recurring series.
 *
 * @param startDate for installments, the month of the current parcel (parcel {@code currentParcel}); for recurring,
 *     the first occurrence.
 * @param currentParcel the first parcel to generate (1-based, default 1); generation produces parcels
 *     currentParcel..parcelsNumber.
 */
public record CreateSeriesRequest(
        @NotNull(message = "Transaction type cannot be null.")
        TransactionType type,

        @NotNull(message = "Amount cannot be null.")
        @Positive(message = "Amount must be positive.")
        @Digits(integer = 13, fraction = 2, message = "Amount must have at most 2 decimal places.")
        BigDecimal amount,

        @NotBlank(message = "Description cannot be blank.")
        @Size(max = 245, message = "Description cannot exceed 245 characters.")
        String description,

        Long categoryId,

        @NotNull(message = "Recurrence mode cannot be null.")
        RecurrenceMode mode,

        @NotNull(message = "Start date cannot be null.") LocalDate startDate,

        @Min(value = 2, message = "Parcels number must be at least 2.")
        @Max(value = 120, message = "Parcels number cannot exceed 120.")
        Integer parcelsNumber,

        @Min(value = 1, message = "Current parcel must be at least 1.")
        Integer currentParcel,

        RecurrenceInterval interval,
        LocalDate endDate,
        SplitMode splitMode,

        @Valid @Size(max = 50, message = "A transaction takes at most 50 participants.")
        List<TransactionParticipantRequest> participants) {}
