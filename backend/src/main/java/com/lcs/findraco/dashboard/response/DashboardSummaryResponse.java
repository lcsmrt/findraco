package com.lcs.findraco.dashboard.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal netBalance,
        List<PersonBreakdownResponse> personBreakdown) {}
