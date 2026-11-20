package com.lcs.findraco.transaction.model;

import com.lcs.findraco.category.model.Category;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.jspecify.annotations.Nullable;

/**
 * What a member edits on a transaction, besides its split and items.
 *
 * @param kind what the row is besides income or expense; null for a normal one.
 */
public record TransactionDetails(
        @Nullable Category category,
        TransactionType type,
        BigDecimal amount,
        String description,
        LocalDate startDate,
        @Nullable LocalDate endDate,
        @Nullable Integer parcelsNumber,
        @Nullable TransactionKind kind) {

    /** Details of a normal income or expense, with no kind. */
    public TransactionDetails(
            @Nullable Category category,
            TransactionType type,
            BigDecimal amount,
            String description,
            LocalDate startDate,
            @Nullable LocalDate endDate,
            @Nullable Integer parcelsNumber) {
        this(category, type, amount, description, startDate, endDate, parcelsNumber, null);
    }
}
