package com.lcs.findraco.transaction.response;

import com.lcs.findraco.category.response.CategoryResponse;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.jspecify.annotations.Nullable;

public record TransactionResponse(
        Long id,
        long version,
        @Nullable CategoryResponse category,
        TransactionType type,
        BigDecimal amount,
        String description,
        @Nullable String seriesId,
        @Nullable Integer parcelsNumber,
        LocalDate startDate,
        @Nullable LocalDate endDate,
        @Nullable TransactionCreatorResponse createdBy,
        SplitMode splitMode,
        List<TransactionParticipantResponse> participants,
        List<TransactionItemResponse> items,
        TransactionPermissionsResponse permissions) {

    public static TransactionResponse from(Transaction transaction, TransactionPermissionsResponse permissions) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getVersion(),
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
                        .toList(),
                permissions);
    }
}
