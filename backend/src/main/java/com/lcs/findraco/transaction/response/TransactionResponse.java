package com.lcs.findraco.transaction.response;

import com.lcs.findraco.category.response.CategoryResponse;
import com.lcs.findraco.transaction.model.Confirmation;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionStatus;
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
        @Nullable TransactionKind kind,
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
        TransactionStatus status,
        boolean requiresConfirmation,
        TransactionPermissionsResponse permissions,
        @Nullable RepaymentResponse repayment) {

    /** The response for a reader whose calendar day is {@code today}, which decides whether it is actual yet. */
    public static TransactionResponse from(
            Transaction transaction, TransactionPermissionsResponse permissions, LocalDate today) {
        return from(transaction, permissions, today, null);
    }

    /** As above, for a repayment with the allocations it stores. */
    public static TransactionResponse from(
            Transaction transaction,
            TransactionPermissionsResponse permissions,
            LocalDate today,
            @Nullable RepaymentResponse repayment) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getVersion(),
                transaction.getCategory() != null ? CategoryResponse.from(transaction.getCategory()) : null,
                transaction.getType(),
                transaction.getKind(),
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
                transaction.status(today),
                transaction.getConfirmation() != Confirmation.BY_DATE,
                permissions,
                repayment);
    }
}
