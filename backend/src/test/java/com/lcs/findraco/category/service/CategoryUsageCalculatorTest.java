package com.lcs.findraco.category.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.category.model.CategoryUsage;
import com.lcs.findraco.category.model.UsageStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class CategoryUsageCalculatorTest {

    private static CategoryUsage evaluate(String spent, String monthlyLimit, int months) {
        return CategoryUsageCalculator.evaluate(new BigDecimal(spent), new BigDecimal(monthlyLimit), months);
    }

    @Test
    void aPeriodAcrossTwoMonthsTouchesTwo() {
        assertThat(CategoryUsageCalculator.monthsTouched(LocalDate.of(2026, 10, 15), LocalDate.of(2026, 11, 10)))
                .isEqualTo(2);
        assertThat(CategoryUsageCalculator.monthsTouched(LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 31)))
                .isEqualTo(1);
        assertThat(CategoryUsageCalculator.monthsTouched(LocalDate.of(2025, 11, 20), LocalDate.of(2026, 1, 2)))
                .isEqualTo(3);
        assertThat(CategoryUsageCalculator.monthsTouched(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31)))
                .isEqualTo(12);
    }

    @Test
    void aReversedPeriodStillCountsOneMonth() {
        assertThat(CategoryUsageCalculator.monthsTouched(LocalDate.of(2026, 11, 10), LocalDate.of(2026, 10, 15)))
                .isEqualTo(1);
    }

    @Test
    void theLimitGrowsWithTheMonthsTheOctoberToNovemberPeriodTouches() {
        CategoryUsage usage = evaluate(
                "50",
                "100",
                CategoryUsageCalculator.monthsTouched(LocalDate.of(2026, 10, 15), LocalDate.of(2026, 11, 10)));

        assertThat(usage.limit()).isEqualByComparingTo("200");
        assertThat(usage.remaining()).isEqualByComparingTo("150");
        assertThat(usage.percentUsed()).isEqualByComparingTo("25.00");
        assertThat(usage.status()).isEqualTo(UsageStatus.OK);
    }

    @Test
    void theWarningStartsAtEightyPercentOfTheScaledLimit() {
        assertThat(evaluate("159.99", "100", 2).status()).isEqualTo(UsageStatus.OK);
        assertThat(evaluate("160.00", "100", 2).status()).isEqualTo(UsageStatus.WARNING);
        assertThat(evaluate("200.00", "100", 2).status()).isEqualTo(UsageStatus.WARNING);
    }

    @Test
    void overStartsOnlyAboveTheLimit() {
        CategoryUsage over = evaluate("200.01", "100", 2);

        assertThat(over.status()).isEqualTo(UsageStatus.OVER);
        assertThat(over.remaining()).isEqualByComparingTo("-0.01");
        assertThat(over.percentUsed()).isEqualByComparingTo("100.01");
    }

    @Test
    void aZeroLimitIsZeroPercentAndOverOnlyOnceSomethingIsSpent() {
        CategoryUsage idle = evaluate("0", "0", 1);
        CategoryUsage spent = evaluate("5", "0", 1);

        assertThat(idle.percentUsed()).isEqualByComparingTo("0");
        assertThat(idle.status()).isEqualTo(UsageStatus.OK);
        assertThat(spent.status()).isEqualTo(UsageStatus.OVER);
    }

    @Test
    void noLimitMeansNoEvaluation() {
        assertThat(CategoryUsageCalculator.evaluate(BigDecimal.TEN, null, 3)).isEqualTo(CategoryUsage.NONE);
    }

    @Test
    void aFormerMembersLimitIsShownScaledButNotJudged() {
        CategoryUsage usage = CategoryUsage.unevaluated(CategoryUsageCalculator.scaledLimit(new BigDecimal("40"), 2));

        assertThat(usage.limit()).isEqualByComparingTo("80");
        assertThat(usage.status()).isNull();
        assertThat(usage.percentUsed()).isNull();
    }
}
