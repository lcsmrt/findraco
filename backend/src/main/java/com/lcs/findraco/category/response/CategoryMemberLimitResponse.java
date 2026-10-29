package com.lcs.findraco.category.response;

import com.lcs.findraco.category.model.CategoryMemberLimit;
import java.math.BigDecimal;

/** One member's monthly limit inside the category; {@code active=false} for a former member. */
public record CategoryMemberLimitResponse(Long memberId, String memberName, BigDecimal amount, boolean active) {

    public static CategoryMemberLimitResponse from(CategoryMemberLimit entry, boolean active) {
        return new CategoryMemberLimitResponse(
                entry.getMember().getId(), entry.getMember().getName(), entry.getAmount(), active);
    }
}
