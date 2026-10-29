package com.lcs.findraco.category.response;

import java.math.BigDecimal;
import java.math.RoundingMode;

/** Limit math shared by the spending rows: no limit → null; a zero limit → 0 percent. */
final class LimitUsage {

    private LimitUsage() {}

    static BigDecimal remaining(BigDecimal spent, BigDecimal limit) {
        return limit == null ? null : limit.subtract(spent);
    }

    static BigDecimal percentUsed(BigDecimal spent, BigDecimal limit) {
        if (limit == null) {
            return null;
        }
        return limit.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : spent.multiply(BigDecimal.valueOf(100)).divide(limit, 2, RoundingMode.HALF_UP);
    }

    static Boolean overLimit(BigDecimal spent, BigDecimal limit) {
        return limit == null ? null : spent.compareTo(limit) > 0;
    }
}
