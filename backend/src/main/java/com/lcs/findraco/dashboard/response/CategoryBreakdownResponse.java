package com.lcs.findraco.dashboard.response;

import com.lcs.findraco.category.response.CategorySpendingResponse;
import java.math.BigDecimal;
import java.util.List;
import org.jspecify.annotations.Nullable;

/**
 * One row of the Overview category breakdown: a root category with rolled-up spend, its children
 * nested. Built from the shared {@link CategorySpendingResponse} so the Overview and the Categories tab
 * show the same numbers.
 */
public record CategoryBreakdownResponse(
        Long categoryId,
        @Nullable Long parentId,
        String categoryName,
        BigDecimal spent,
        @Nullable BigDecimal limit,
        @Nullable BigDecimal remaining,
        @Nullable BigDecimal percentUsed,
        @Nullable Boolean overLimit,
        List<CategoryBreakdownResponse> children) {

    public static CategoryBreakdownResponse from(CategorySpendingResponse spending) {
        return new CategoryBreakdownResponse(
                spending.categoryId(),
                spending.parentId(),
                spending.name(),
                spending.spent(),
                spending.limit(),
                spending.remaining(),
                spending.percentUsed(),
                spending.overLimit(),
                spending.children().stream()
                        .map(CategoryBreakdownResponse::from)
                        .toList());
    }
}
