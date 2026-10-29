package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.Transaction;
import java.util.List;

public class TransactionSeriesResponseDto {
    private final String seriesId;
    private final int count;
    private final List<TransactionResponseDto> occurrences;

    public TransactionSeriesResponseDto(List<Transaction> transactions) {
        this.occurrences =
                transactions.stream().map(TransactionResponseDto::new).toList();
        this.count = transactions.isEmpty() ? 0 : transactions.size();
        this.seriesId = transactions.isEmpty() ? null : transactions.get(0).getSeriesId();
    }

    public String getSeriesId() {
        return seriesId;
    }

    public int getCount() {
        return count;
    }

    public List<TransactionResponseDto> getOccurrences() {
        return occurrences;
    }
}
