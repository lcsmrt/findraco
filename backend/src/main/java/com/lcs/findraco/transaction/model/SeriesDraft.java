package com.lcs.findraco.transaction.model;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.jspecify.annotations.Nullable;

/**
 * Everything a new series is made of.
 *
 * @param startDate for installments, the month of {@code currentParcel}; for a recurring series, the first
 *     occurrence.
 * @param currentParcel the first installment generated (1-based); null means the first.
 * @param endDate the last occurrence of a recurring series; null leaves it open-ended. Installments ignore it.
 */
public record SeriesDraft(
        Plan plan,
        User createdBy,
        @Nullable Category category,
        TransactionType type,
        BigDecimal amount,
        String description,
        RecurrenceMode mode,
        @Nullable RecurrenceInterval interval,
        @Nullable Integer parcelsNumber,
        @Nullable Integer currentParcel,
        LocalDate startDate,
        @Nullable LocalDate endDate,
        SplitMode splitMode,
        List<Share> participants) {}
