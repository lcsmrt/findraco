package com.lcs.findraco.mcp.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.category.response.CategoryResponse;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionStatus;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.request.TransactionItemRequest;
import com.lcs.findraco.transaction.request.TransactionParticipantRequest;
import com.lcs.findraco.transaction.request.UpdateTransactionRequest;
import com.lcs.findraco.transaction.response.TransactionCreatorResponse;
import com.lcs.findraco.transaction.response.TransactionItemResponse;
import com.lcs.findraco.transaction.response.TransactionParticipantResponse;
import com.lcs.findraco.transaction.response.TransactionPermissionsResponse;
import com.lcs.findraco.transaction.response.TransactionResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.jspecify.annotations.Nullable;
import org.junit.jupiter.api.Test;

class McpUpdateCopyTest {

    private static CategoryResponse category(long id, String name) {
        return new CategoryResponse(id, 1L, TransactionType.DEBIT, name, null, null, null, null, null, null, null);
    }

    /** A transaction with every editable field set to something that is not a default. */
    private static TransactionResponse stored() {
        return stored("Electricity");
    }

    private static TransactionResponse stored(String description) {
        return stored(description, "series-1", 3);
    }

    private static TransactionResponse stored(
            String description, @Nullable String seriesId, @Nullable Integer parcelsNumber) {
        return new TransactionResponse(
                11L,
                9L,
                category(7L, "Home"),
                TransactionType.DEBIT,
                null,
                new BigDecimal("100.00"),
                description,
                seriesId,
                parcelsNumber,
                LocalDate.of(2026, 3, 10),
                LocalDate.of(2026, 9, 10),
                new TransactionCreatorResponse(1L, "Ana"),
                SplitMode.EXACT,
                List.of(
                        new TransactionParticipantResponse(1L, "Ana", new BigDecimal("60.00")),
                        new TransactionParticipantResponse(2L, "Bia", new BigDecimal("40.00"))),
                List.of(
                        new TransactionItemResponse(21L, "Base fee", new BigDecimal("30.00"), 2, category(8L, "Fees")),
                        new TransactionItemResponse(22L, "Extra", new BigDecimal("10.00"), null, null)),
                TransactionStatus.FORECAST,
                true,
                new TransactionPermissionsResponse(true, true));
    }

    private static UpdateTransactionRequest unchangedExcept(
            BigDecimal amount, String description, LocalDate startDate) {
        return new UpdateTransactionRequest(
                7L,
                TransactionType.DEBIT,
                amount,
                description,
                3,
                startDate,
                LocalDate.of(2026, 9, 10),
                SplitMode.EXACT,
                List.of(
                        new TransactionParticipantRequest(1L, new BigDecimal("60.00")),
                        new TransactionParticipantRequest(2L, new BigDecimal("40.00"))),
                List.of(
                        new TransactionItemRequest("Base fee", new BigDecimal("30.00"), 8L, 2),
                        new TransactionItemRequest("Extra", new BigDecimal("10.00"), null, null)),
                null,
                9L);
    }

    @Test
    void keepsEveryStoredField() {
        UpdateTransactionRequest untouched = McpUpdateCopy.of(stored(), null, null, null);
        UpdateTransactionRequest amountOnly = McpUpdateCopy.of(stored(), new BigDecimal("120.00"), null, null);
        UpdateTransactionRequest everything =
                McpUpdateCopy.of(stored(), new BigDecimal("120.00"), LocalDate.of(2026, 3, 12), "Power");

        assertThat(untouched)
                .isEqualTo(unchangedExcept(new BigDecimal("100.00"), "Electricity", LocalDate.of(2026, 3, 10)));
        assertThat(amountOnly)
                .isEqualTo(unchangedExcept(new BigDecimal("120.00"), "Electricity", LocalDate.of(2026, 3, 10)));
        assertThat(everything).isEqualTo(unchangedExcept(new BigDecimal("120.00"), "Power", LocalDate.of(2026, 3, 12)));
    }

    @Test
    void keepsInstallmentSuffix() {
        TransactionResponse installment = stored("Phone (2/3)");

        assertThat(McpUpdateCopy.of(installment, null, null, "Handset").description())
                .isEqualTo("Handset (2/3)");
        assertThat(McpUpdateCopy.of(installment, null, null, "Handset (2/3)").description())
                .isEqualTo("Handset (2/3)");
        assertThat(McpUpdateCopy.of(installment, null, null, null).description())
                .isEqualTo("Phone (2/3)");
        assertThat(McpUpdateCopy.of(stored(), null, null, "Power").description())
                .isEqualTo("Power");
        assertThat(McpUpdateCopy.of(stored("Pizza (1/2)", null, null), null, null, "Pizza")
                        .description())
                .isEqualTo("Pizza");
    }
}
