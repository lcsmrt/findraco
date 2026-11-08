package com.lcs.findraco.mcp.response;

import com.lcs.findraco.transaction.model.TransactionStatus;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.response.TransactionResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.jspecify.annotations.Nullable;

/** A transaction as Claude reads it: what it was, how much, when, and whether it already counts as actual. */
public record McpTransactionResponse(
        long id,
        String description,
        BigDecimal amount,
        LocalDate date,
        TransactionType type,
        @Nullable String category,
        TransactionStatus status) {

    public static McpTransactionResponse from(TransactionResponse transaction) {
        return new McpTransactionResponse(
                transaction.id(),
                transaction.description(),
                transaction.amount(),
                transaction.startDate(),
                transaction.type(),
                transaction.category() == null ? null : transaction.category().description(),
                transaction.status());
    }
}
