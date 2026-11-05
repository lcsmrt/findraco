package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.Transaction;
import java.time.LocalDate;
import java.util.List;
import java.util.function.Function;

public record TransactionSeriesResponse(String seriesId, int count, List<TransactionResponse> occurrences) {

    public static TransactionSeriesResponse from(
            List<Transaction> transactions,
            Function<Transaction, TransactionPermissionsResponse> permissions,
            LocalDate today) {
        return new TransactionSeriesResponse(
                transactions.isEmpty() ? null : transactions.get(0).getSeriesId(),
                transactions.size(),
                transactions.stream()
                        .map(transaction ->
                                TransactionResponse.from(transaction, permissions.apply(transaction), today))
                        .toList());
    }
}
