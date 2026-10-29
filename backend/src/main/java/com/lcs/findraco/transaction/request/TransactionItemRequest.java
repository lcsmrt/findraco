package com.lcs.findraco.transaction.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record TransactionItemRequest(
        @NotBlank(message = "Item description cannot be blank.")
        String description,

        @NotNull(message = "Item amount cannot be null.") @Positive(message = "Item amount must be positive.")
        BigDecimal amount,

        Long categoryId,

        @Positive(message = "Item quantity must be positive.")
        Integer quantity) {}
