package com.lcs.findraco.mcp.response;

import java.util.List;
import org.jspecify.annotations.Nullable;

/**
 * One page of {@code list_transactions}, newest first. {@code matched} counts every transaction that fits the
 * filters; when more than this page exist, {@code nextPage} and {@code note} say how to fetch the next one.
 */
public record McpTransactionPageResponse(
        String plan,
        long matched,
        int page,
        @Nullable Integer nextPage,
        @Nullable String note,
        List<McpTransactionResponse> transactions) {}
