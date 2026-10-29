package com.lcs.findraco.category.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

/** One member's monthly limit inside a category (CAT-11). */
public class MemberLimitDto {

    @NotNull(message = "Member limit member id cannot be null.")
    private Long memberId;

    @NotNull(message = "Member limit amount cannot be null.")
    @PositiveOrZero(message = "Member limit amount cannot be negative.")
    private BigDecimal amount;

    public Long getMemberId() {
        return memberId;
    }

    public BigDecimal getAmount() {
        return amount;
    }
}
