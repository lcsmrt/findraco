package com.lcs.findraco.transaction.model;

import com.lcs.findraco.category.model.Category;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/** One line of a transaction's breakdown; without a quantity it counts once. */
public record ItemDraft(
        String description,
        BigDecimal amount,
        @Nullable Integer quantity,
        @Nullable Category category) {}
