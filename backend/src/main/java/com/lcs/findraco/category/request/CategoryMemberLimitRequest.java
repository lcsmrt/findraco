package com.lcs.findraco.category.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

/** One member's monthly limit inside a category (CAT-11). */
public record CategoryMemberLimitRequest(
        @NotNull(message = "Member limit member id cannot be null.")
        Long memberId,

        @NotNull(message = "Member limit amount cannot be null.")
        @PositiveOrZero(message = "Member limit amount cannot be negative.")
        BigDecimal amount) {}
