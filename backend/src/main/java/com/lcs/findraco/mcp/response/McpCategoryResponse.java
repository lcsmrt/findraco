package com.lcs.findraco.mcp.response;

import com.lcs.findraco.transaction.model.TransactionType;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/** A category of the plan as {@code list_categories} shows it; the parent and the limit are absent when it has none. */
public record McpCategoryResponse(
        long id,
        String name,
        TransactionType type,
        @Nullable String parent,
        @Nullable BigDecimal monthlyLimit) {}
