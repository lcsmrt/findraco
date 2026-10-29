package com.lcs.findraco.transaction.model;

import com.lcs.findraco.category.model.Category;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.jspecify.annotations.Nullable;

/** What a member edits on a transaction, besides its split and items. */
public record TransactionDetails(
        @Nullable Category category,
        TransactionType type,
        BigDecimal amount,
        String description,
        LocalDate startDate,
        @Nullable LocalDate endDate,
        @Nullable Integer parcelsNumber) {}
