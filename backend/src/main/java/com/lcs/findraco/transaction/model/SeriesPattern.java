package com.lcs.findraco.transaction.model;

import com.lcs.findraco.category.model.Category;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.jspecify.annotations.Nullable;

/**
 * What a series edit changes on the definition; the type, mode and start stay.
 *
 * @param endDate a null end makes a recurring series open-ended (full replace, as the transaction edit).
 */
public record SeriesPattern(
        @Nullable Category category,
        BigDecimal amount,
        String description,
        @Nullable Integer parcelsNumber,
        @Nullable LocalDate endDate,
        SplitMode splitMode,
        List<Share> participants) {}
