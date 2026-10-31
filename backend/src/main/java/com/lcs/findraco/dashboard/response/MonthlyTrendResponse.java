package com.lcs.findraco.dashboard.response;

import java.math.BigDecimal;

public record MonthlyTrendResponse(int year, int month, BigDecimal income, BigDecimal expenses) {}
