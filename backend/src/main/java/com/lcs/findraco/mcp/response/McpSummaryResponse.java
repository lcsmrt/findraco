package com.lcs.findraco.mcp.response;

import com.lcs.findraco.dashboard.response.DashboardSummaryResponse;
import java.math.BigDecimal;

/**
 * A month's figures exactly as the dashboard computes them, plus the forecast part: what is still expected, the
 * month's total minus what is already actual.
 */
public record McpSummaryResponse(
        String plan,
        String month,
        DashboardSummaryResponse summary,
        BigDecimal forecastIncome,
        BigDecimal forecastExpenses) {}
