package com.lcs.findraco.category.model;

import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/**
 * A spend evaluated against a limit for a period. {@code limit} is the monthly limit scaled to the months
 * the period touches. Without a limit, or for an entry that is not evaluated, the rest is null.
 */
public record CategoryUsage(
        @Nullable BigDecimal limit,
        @Nullable BigDecimal remaining,
        @Nullable BigDecimal percentUsed,
        @Nullable UsageStatus status) {

    public static final CategoryUsage NONE = new CategoryUsage(null, null, null, null);

    /** A limit that is shown and not judged: the entry of a former member. */
    public static CategoryUsage unevaluated(@Nullable BigDecimal limit) {
        return limit == null ? NONE : new CategoryUsage(limit, null, null, null);
    }
}
