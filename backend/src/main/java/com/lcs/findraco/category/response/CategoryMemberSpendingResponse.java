package com.lcs.findraco.category.response;

import java.math.BigDecimal;

/**
 * One member's spend inside a category, against that member's own limit. A former member's entry
 * ({@code active=false}) shows its stored amount but is not evaluated: remaining, percentUsed and
 * overLimit are null (CAT-14).
 */
public record CategoryMemberSpendingResponse(
        Long memberId,
        String name,
        BigDecimal spent,
        BigDecimal limit,
        BigDecimal remaining,
        BigDecimal percentUsed,
        Boolean overLimit,
        boolean active) {

    public static CategoryMemberSpendingResponse of(
            Long memberId, String name, BigDecimal spent, BigDecimal limit, boolean active) {
        BigDecimal evaluated = active ? limit : null;
        return new CategoryMemberSpendingResponse(
                memberId,
                name,
                spent,
                limit,
                LimitUsage.remaining(spent, evaluated),
                LimitUsage.percentUsed(spent, evaluated),
                LimitUsage.overLimit(spent, evaluated),
                active);
    }
}
