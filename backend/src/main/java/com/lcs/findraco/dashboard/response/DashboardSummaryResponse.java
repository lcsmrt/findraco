package com.lcs.findraco.dashboard.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * The range's totals. Rows of a neutral kind (a transfer, a card bill payment, a move to savings) count in none of them;
 * {@code neutralOut} and {@code neutralIn} show what moved, apart from the totals.
 */
public record DashboardSummaryResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal netBalance,
        BigDecimal actualIncome,
        BigDecimal actualExpenses,
        BigDecimal actualBalance,
        BigDecimal neutralOut,
        BigDecimal neutralIn,
        List<PersonBreakdownResponse> personBreakdown) {}
