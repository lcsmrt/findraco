package com.lcs.findraco.mcp.service;

import com.lcs.findraco.mcp.exception.McpToolException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import org.jspecify.annotations.Nullable;

/** The {@code month} argument of the summary tools: {@code YYYY-MM}, the current month of the caller's zone when omitted. */
public final class McpMonth {

    private McpMonth() {}

    public static YearMonth of(@Nullable String month, LocalDate today) {
        if (month == null || month.isBlank()) {
            return YearMonth.from(today);
        }
        try {
            return YearMonth.parse(month.strip());
        } catch (DateTimeParseException exception) {
            throw new McpToolException("month must look like 2026-03 (year and month).");
        }
    }
}
