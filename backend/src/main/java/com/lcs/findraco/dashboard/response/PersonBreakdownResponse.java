package com.lcs.findraco.dashboard.response;

import java.math.BigDecimal;

public record PersonBreakdownResponse(Long userId, String name, BigDecimal income, BigDecimal expense, BigDecimal net) {

    public static PersonBreakdownResponse of(Long userId, String name, BigDecimal income, BigDecimal expense) {
        return new PersonBreakdownResponse(userId, name, income, expense, income.subtract(expense));
    }
}
