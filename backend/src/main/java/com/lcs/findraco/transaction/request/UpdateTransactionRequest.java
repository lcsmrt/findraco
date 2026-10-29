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
        @Valid List<TransactionItemRequest> items) {}
