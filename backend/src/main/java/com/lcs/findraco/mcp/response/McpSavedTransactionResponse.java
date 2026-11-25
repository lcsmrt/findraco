package com.lcs.findraco.mcp.response;

import org.jspecify.annotations.Nullable;

/**
 * What a write tool returns: the transaction as stored, the name of the plan it is in and, for a payment from a
 * contact, what it settled.
 */
public record McpSavedTransactionResponse(
        String plan,
        McpTransactionResponse transaction,
        @Nullable McpRepaymentResponse repayment) {

    public McpSavedTransactionResponse(String plan, McpTransactionResponse transaction) {
        this(plan, transaction, null);
    }
}
