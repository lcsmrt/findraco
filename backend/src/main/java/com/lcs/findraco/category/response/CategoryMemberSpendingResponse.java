package com.lcs.findraco.category.response;

import com.lcs.findraco.category.model.CategoryUsage;
import com.lcs.findraco.category.model.UsageStatus;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/**
 * One member's spend inside a category, against that member's own limit. A former member's entry
 * ({@code active=false}) shows its stored amount but is not evaluated: remaining, percentUsed and
 * status are null (CAT-14).
 */
public record CategoryMemberSpendingResponse(
        Long memberId,
        String name,
        BigDecimal spent,
        @Nullable BigDecimal limit,
        @Nullable BigDecimal remaining,
        @Nullable BigDecimal percentUsed,
        @Nullable UsageStatus status,
        boolean active) {

    public static CategoryMemberSpendingResponse of(
            Long memberId, String name, BigDecimal spent, CategoryUsage usage, boolean active) {
        return new CategoryMemberSpendingResponse(
                memberId, name, spent, usage.limit(), usage.remaining(), usage.percentUsed(), usage.status(), active);
    }
}
