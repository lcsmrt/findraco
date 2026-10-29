package com.lcs.findraco.transaction.response;

import com.lcs.findraco.category.response.CategoryResponse;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record TransactionResponse(
        Long id,
        CategoryResponse category,
        TransactionType type,
        BigDecimal amount,
        String description,
        String seriesId,
        Integer parcelsNumber,
        LocalDate startDate,
        LocalDate endDate,
        TransactionCreatorResponse createdBy,
        SplitMode splitMode,
        List<TransactionParticipantResponse> participants,
        List<TransactionItemResponse> items) {

    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getCategory() != null ? CategoryResponse.from(transaction.getCategory()) : null,
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getSeriesId(),
                transaction.getParcelsNumber(),
                transaction.getStartDate(),
                transaction.getEndDate(),
                transaction.getCreatedBy() != null ? TransactionCreatorResponse.from(transaction.getCreatedBy()) : null,
                transaction.getSplitMode(),
                transaction.getParticipants().stream()
                        .map(TransactionParticipantResponse::from)
                        .toList(),
                transaction.getItems().stream()
                        .map(TransactionItemResponse::from)
                        .toList());
    }
}
