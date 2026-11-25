package com.lcs.findraco.plan.response;

import java.util.List;

/**
 * What happened with the contact in one calendar month of the transaction dates.
 *
 * @param month {@code yyyy-MM}.
 * @param shares the month's shares, oldest first.
 * @param repayments the month's payments, oldest first.
 */
public record ContactStatementMonthResponse(
        String month, List<ContactStatementShareResponse> shares, List<ContactStatementRepaymentResponse> repayments) {}
