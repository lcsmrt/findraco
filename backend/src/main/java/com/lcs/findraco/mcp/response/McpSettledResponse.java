package com.lcs.findraco.mcp.response;

import com.lcs.findraco.plan.model.ContactShareStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One purchase a repayment settled, in whole or in part.
 *
 * @param amount what the repayment settled of the contact's share.
 * @param status where that share stands now: PAID or PARTIAL.
 */
public record McpSettledResponse(
        long transactionId, String description, LocalDate date, BigDecimal amount, ContactShareStatus status) {}
