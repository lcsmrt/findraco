package com.lcs.findraco.mcp.service;

import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.request.RepaymentAllocationRequest;
import com.lcs.findraco.transaction.request.TransactionItemRequest;
import com.lcs.findraco.transaction.request.TransactionParticipantRequest;
import com.lcs.findraco.transaction.request.UpdateTransactionRequest;
import com.lcs.findraco.transaction.response.TransactionResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jspecify.annotations.Nullable;

/**
 * Builds the edit of a transaction that changes only the amount, the date, the description, the category or the kind. The API's edit replaces
 * every field, items and participants included, so each stored field is copied into the request, and a field left out
 * here would be wiped from the transaction.
 */
public final class McpUpdateCopy {

    private static final Pattern INSTALLMENT_SUFFIX = Pattern.compile("\\(\\d+/\\d+\\)$");

    private McpUpdateCopy() {}

    /**
     * An installment occurrence keeps its "(k/N)" when the description changes, as the app's own edit of one
     * occurrence does; a one-off row whose name merely ends in "(k/N)" is renamed as asked.
     */
    private static String withInstallmentSuffix(String description, TransactionResponse stored) {
        if (stored.seriesId() == null || stored.parcelsNumber() == null) {
            return description;
        }
        Matcher suffix = INSTALLMENT_SUFFIX.matcher(stored.description());
        return suffix.find() && !INSTALLMENT_SUFFIX.matcher(description).find()
                ? description + " " + suffix.group()
                : description;
    }

    public static UpdateTransactionRequest of(
            TransactionResponse stored,
            @Nullable BigDecimal amount,
            @Nullable LocalDate date,
            @Nullable String description) {
        return of(stored, amount, date, description, false, null);
    }

    /** As above; with {@code changeCategory} the transaction takes {@code categoryId}, none when it is null. */
    public static UpdateTransactionRequest of(
            TransactionResponse stored,
            @Nullable BigDecimal amount,
            @Nullable LocalDate date,
            @Nullable String description,
            boolean changeCategory,
            @Nullable Long categoryId) {
        return of(stored, amount, date, description, changeCategory, categoryId, false, null);
    }

    /** As above; with {@code changeKind} the transaction takes {@code kind}, a normal row when it is null. */
    public static UpdateTransactionRequest of(
            TransactionResponse stored,
            @Nullable BigDecimal amount,
            @Nullable LocalDate date,
            @Nullable String description,
            boolean changeCategory,
            @Nullable Long categoryId,
            boolean changeKind,
            @Nullable TransactionKind kind) {
        Long keptCategoryId =
                stored.category() == null ? null : stored.category().id();
        TransactionKind resultingKind = changeKind ? kind : stored.kind();
        // A payment from a contact keeps its contact and what it settled; a new amount settles the oldest again.
        boolean staysRepayment = resultingKind == TransactionKind.REPAYMENT && stored.repayment() != null;
        boolean amountChanges = amount != null && amount.compareTo(stored.amount()) != 0;
        return new UpdateTransactionRequest(
                changeCategory ? categoryId : keptCategoryId,
                stored.type(),
                amount != null ? amount : stored.amount(),
                description != null ? withInstallmentSuffix(description, stored) : stored.description(),
                stored.parcelsNumber(),
                date != null ? date : stored.startDate(),
                stored.endDate(),
                stored.splitMode(),
                stored.participants().stream()
                        .map(participant -> new TransactionParticipantRequest(
                                participant.id(), participant.contactId(), participant.shareAmount()))
                        .toList(),
                stored.items().stream()
                        .map(item -> new TransactionItemRequest(
                                item.description(),
                                item.amount(),
                                item.category() == null ? null : item.category().id(),
                                item.quantity()))
                        .toList(),
                resultingKind,
                staysRepayment ? stored.repayment().contactId() : null,
                staysRepayment && !amountChanges
                        ? stored.repayment().allocations().stream()
                                .map(allocation ->
                                        new RepaymentAllocationRequest(allocation.participantId(), allocation.amount()))
                                .toList()
                        : null,
                stored.version());
    }
}
