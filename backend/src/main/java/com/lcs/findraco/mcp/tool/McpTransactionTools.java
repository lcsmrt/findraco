package com.lcs.findraco.mcp.tool;

import com.lcs.findraco.mcp.exception.McpToolException;
import com.lcs.findraco.mcp.response.McpTransactionPageResponse;
import com.lcs.findraco.mcp.response.McpTransactionResponse;
import com.lcs.findraco.mcp.service.McpCategoryResolver;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.request.TransactionFilter;
import com.lcs.findraco.transaction.response.TransactionResponse;
import com.lcs.findraco.transaction.service.TransactionService;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import java.time.LocalDate;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class McpTransactionTools {

    /** At most this many transactions per call, so an answer stays small enough to read. */
    private static final int PAGE_SIZE = 50;

    private final McpToolRunner runner;
    private final McpCategoryResolver categories;
    private final TransactionService transactionService;

    public McpTransactionTools(
            McpToolRunner runner, McpCategoryResolver categories, TransactionService transactionService) {
        this.runner = runner;
        this.categories = categories;
        this.transactionService = transactionService;
    }

    @McpTool(
            name = "list_transactions",
            title = "List transactions",
            description = "Lists the transactions of a plan, newest first, at most 50 per call, each with id, "
                    + "description, amount, date, type, category and status (ACTUAL happened, FORECAST is expected "
                    + "and not confirmed yet, PENDING is due but waits for its confirmation). Filter by period, "
                    + "category, type and description text; the answer says how many matched and how to get the "
                    + "next page.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, openWorldHint = false))
    public CallToolResult listTransactions(
            @McpToolParam(required = false, description = "First date to include (YYYY-MM-DD)") LocalDate from,
            @McpToolParam(required = false, description = "Last date to include (YYYY-MM-DD)") LocalDate to,
            @McpToolParam(required = false, description = "Category name; includes its subcategories") String category,
            @McpToolParam(required = false, description = "DEBIT for expenses, CREDIT for income") TransactionType type,
            @McpToolParam(required = false, description = "Text the description contains") String text,
            @McpToolParam(required = false, description = "Page number, from 0; the previous answer gives nextPage")
                    Integer page,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan("list_transactions", plan, resolved -> {
            int pageNumber = page == null ? 0 : page;
            if (pageNumber < 0) {
                throw new McpToolException("page must be 0 or more.");
            }
            Long categoryId = category == null || category.isBlank()
                    ? null
                    : categories.resolve(category, resolved.name(), resolved.ctx());
            Page<TransactionResponse> found = transactionService.findAllByPlanPaged(
                    new TransactionFilter(
                            type, categoryId, null, text, from, to, null, null, pageNumber, PAGE_SIZE, null, null),
                    resolved.ctx());
            Integer nextPage = found.hasNext() ? pageNumber + 1 : null;
            return new McpTransactionPageResponse(
                    resolved.name(),
                    found.getTotalElements(),
                    pageNumber,
                    nextPage,
                    nextPage == null
                            ? null
                            : found.getTotalElements() + " transactions match; this page has "
                                    + found.getNumberOfElements() + ". Call again with page=" + nextPage
                                    + " for the next ones.",
                    found.getContent().stream()
                            .map(McpTransactionResponse::from)
                            .toList());
        });
    }
}
