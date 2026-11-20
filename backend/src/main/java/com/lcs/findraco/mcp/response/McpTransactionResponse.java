package com.lcs.findraco.mcp.response;

import com.lcs.findraco.mcp.service.McpNames;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionStatus;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.response.TransactionResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jspecify.annotations.Nullable;

/**
 * A transaction as Claude reads it: what it was, how much, when, whether it already counts as actual, whose it is
 * (first names) and its place in a series.
 */
public record McpTransactionResponse(
        long id,
        String description,
        BigDecimal amount,
        LocalDate date,
        TransactionType type,
        @Nullable TransactionKind kind,
        @Nullable String category,
        TransactionStatus status,
        List<String> attributedTo,
        @Nullable String series) {

    private static final Pattern INSTALLMENT = Pattern.compile("\\((\\d+)/(\\d+)\\)$");

    public static McpTransactionResponse from(TransactionResponse transaction) {
        return new McpTransactionResponse(
                transaction.id(),
                transaction.description(),
                transaction.amount(),
                transaction.startDate(),
                transaction.type(),
                transaction.kind(),
                transaction.category() == null ? null : transaction.category().description(),
                transaction.status(),
                transaction.participants().stream()
                        .map(participant -> McpNames.firstName(participant.name()))
                        .sorted()
                        .toList(),
                series(transaction));
    }

    /** "k/N" for an installment, "monthly" for a recurring series, null for a single row. */
    private static @Nullable String series(TransactionResponse transaction) {
        if (transaction.seriesId() == null) {
            return null;
        }
        if (transaction.parcelsNumber() == null) {
            return "monthly";
        }
        Matcher suffix = INSTALLMENT.matcher(transaction.description());
        return suffix.find() ? suffix.group(1) + "/" + transaction.parcelsNumber() : "installment";
    }
}
