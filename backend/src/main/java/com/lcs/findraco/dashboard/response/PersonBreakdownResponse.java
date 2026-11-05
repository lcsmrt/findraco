package com.lcs.findraco.dashboard.response;

import java.math.BigDecimal;

/**
 * One member's shares of the range. {@code income}, {@code expense} and {@code net} count every transaction,
 * forecast included; the {@code actual*} figures count only the actual ones.
 */
public record PersonBreakdownResponse(
        Long userId,
        String name,
        BigDecimal income,
        BigDecimal expense,
        BigDecimal net,
        BigDecimal actualIncome,
        BigDecimal actualExpense,
        BigDecimal actualNet) {

    public static PersonBreakdownResponse of(
            Long userId,
            String name,
            BigDecimal income,
            BigDecimal expense,
            BigDecimal actualIncome,
            BigDecimal actualExpense) {
        return new PersonBreakdownResponse(
                userId,
                name,
                income,
                expense,
                income.subtract(expense),
                actualIncome,
                actualExpense,
                actualIncome.subtract(actualExpense));
    }
}
