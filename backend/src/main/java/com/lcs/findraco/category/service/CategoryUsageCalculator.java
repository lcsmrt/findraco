package com.lcs.findraco.category.service;

import com.lcs.findraco.category.model.CategoryUsage;
import com.lcs.findraco.category.model.UsageStatus;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import org.jspecify.annotations.Nullable;

/**
 * The one place a spend is judged against a limit, for any period: the monthly limit grows with the
 * calendar months the period touches, and the status is the same on every screen and channel.
 */
public final class CategoryUsageCalculator {

    /** The share of the limit from which a row is a warning; a contract value, not configuration. */
    public static final BigDecimal WARNING_RATIO = new BigDecimal("0.8");

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    private CategoryUsageCalculator() {}

    /** Calendar months an inclusive range touches: 15 Oct to 10 Nov touches two. At least one. */
    public static int monthsTouched(LocalDate start, LocalDate end) {
        return Math.max(1, (int) ChronoUnit.MONTHS.between(start.withDayOfMonth(1), end.withDayOfMonth(1)) + 1);
    }

    /** The monthly limit scaled to {@code months}, null without a limit. */
    public static @Nullable BigDecimal scaledLimit(@Nullable BigDecimal monthlyLimit, int months) {
        return monthlyLimit == null ? null : monthlyLimit.multiply(BigDecimal.valueOf(months));
    }

    /** {@code spent} against the monthly limit scaled to {@code months}; no limit gives no evaluation. */
    public static CategoryUsage evaluate(BigDecimal spent, @Nullable BigDecimal monthlyLimit, int months) {
        BigDecimal limit = scaledLimit(monthlyLimit, months);
        if (limit == null) {
            return CategoryUsage.NONE;
        }
        return new CategoryUsage(limit, limit.subtract(spent), percentUsed(spent, limit), status(spent, limit));
    }

    private static BigDecimal percentUsed(BigDecimal spent, BigDecimal limit) {
        return limit.signum() == 0 ? BigDecimal.ZERO : spent.multiply(HUNDRED).divide(limit, 2, RoundingMode.HALF_UP);
    }

    private static UsageStatus status(BigDecimal spent, BigDecimal limit) {
        if (spent.compareTo(limit) > 0) {
            return UsageStatus.OVER;
        }
        // Nothing spent against a zero limit is not close to anything.
        if (limit.signum() == 0) {
            return UsageStatus.OK;
        }
        return spent.compareTo(limit.multiply(WARNING_RATIO)) >= 0 ? UsageStatus.WARNING : UsageStatus.OK;
    }
}
