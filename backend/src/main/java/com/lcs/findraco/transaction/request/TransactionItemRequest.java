package com.lcs.findraco.transaction.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record TransactionItemRequest(
        @NotBlank(message = "Item description cannot be blank.")
        @Size(max = 255, message = "Item description cannot exceed 255 characters.")
        String description,

        @NotNull(message = "Item amount cannot be null.")
        @Positive(message = "Item amount must be positive.")
        @Digits(integer = 13, fraction = 2, message = "Item amount must have at most 2 decimal places.")
        BigDecimal amount,

        Long categoryId,

        @Positive(message = "Item quantity must be positive.")
        Integer quantity) {}
