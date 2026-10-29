package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.Transaction;
import java.util.List;

public record TransactionSeriesResponse(String seriesId, int count, List<TransactionResponse> occurrences) {

    public static TransactionSeriesResponse from(List<Transaction> transactions) {
        return new TransactionSeriesResponse(
                transactions.isEmpty() ? null : transactions.get(0).getSeriesId(),
                transactions.size(),
                transactions.stream().map(TransactionResponse::from).toList());
    }
}
