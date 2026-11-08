package com.lcs.findraco.mcp.tool;

import com.lcs.findraco.mcp.exception.McpToolException;
import com.lcs.findraco.mcp.response.McpSavedTransactionResponse;
import com.lcs.findraco.mcp.response.McpTransactionPageResponse;
import com.lcs.findraco.mcp.response.McpTransactionResponse;
import com.lcs.findraco.mcp.service.McpCategoryResolver;
import com.lcs.findraco.mcp.service.McpPlanResolver;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.mcp.service.McpValidation;
import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.request.ConfirmTransactionRequest;
import com.lcs.findraco.transaction.request.CreateTransactionRequest;
import com.lcs.findraco.transaction.request.TransactionFilter;
import com.lcs.findraco.transaction.response.TransactionResponse;
import com.lcs.findraco.transaction.service.TransactionService;
import com.lcs.findraco.user.service.UserService;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import java.math.BigDecimal;
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
    private final McpValidation validation;
    private final TransactionService transactionService;
    private final UserService userService;

    public McpTransactionTools(
            McpToolRunner runner,
            McpCategoryResolver categories,
            McpValidation validation,
            TransactionService transactionService,
            UserService userService) {
        this.runner = runner;
        this.categories = categories;
        this.validation = validation;
        this.transactionService = transactionService;
        this.userService = userService;
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

    @McpTool(
            name = "create_transaction",
            title = "Create transaction",
            description = "Records one expense (DEBIT) or income (CREDIT) in a plan, paid in full by the user. "
                    + "The date is today unless given; the category is by name (see list_categories) and the "
                    + "transaction is uncategorized without one. Installments, recurrences and splits between "
                    + "members are not created from here. Returns the stored transaction.",
            annotations = @McpTool.McpAnnotations(destructiveHint = false, openWorldHint = false))
    public CallToolResult createTransaction(
            @McpToolParam(description = "DEBIT for an expense, CREDIT for income") TransactionType type,
            @McpToolParam(description = "Positive amount with at most 2 decimal places") BigDecimal amount,
            @McpToolParam(description = "What it was, up to 255 characters") String description,
            @McpToolParam(required = false, description = "Date (YYYY-MM-DD); today when omitted") LocalDate date,
            @McpToolParam(required = false, description = "Category name; uncategorized when omitted") String category,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan("create_transaction", plan, resolved -> {
            Long categoryId = category == null || category.isBlank()
                    ? null
                    : categories.resolve(category, resolved.name(), resolved.ctx());
            LocalDate when =
                    date != null ? date : userService.today(resolved.ctx().userId());
            CreateTransactionRequest request = validation.valid(new CreateTransactionRequest(
                    categoryId, type, amount, description, null, when, null, null, null, null));
            return saved(resolved, transactionService.create(request, resolved.ctx()));
        });
    }

    @McpTool(
            name = "confirm_transaction",
            title = "Confirm transaction",
            description = "Confirms a forecast transaction that waits for its confirmation (an expected bill that "
                    + "is now paid) with the real amount and date; the date is today unless given. It confirms the "
                    + "existing transaction and adds none. Find the id with list_transactions.",
            annotations =
                    @McpTool.McpAnnotations(destructiveHint = false, idempotentHint = true, openWorldHint = false))
    public CallToolResult confirmTransaction(
            @McpToolParam(description = "Id of the transaction to confirm") Long id,
            @McpToolParam(description = "The real amount, positive with at most 2 decimal places") BigDecimal amount,
            @McpToolParam(required = false, description = "The real date (YYYY-MM-DD); today when omitted")
                    LocalDate date,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan("confirm_transaction", plan, resolved -> {
            TransactionResponse stored = transactionService.getById(id, resolved.ctx());
            LocalDate when =
                    date != null ? date : userService.today(resolved.ctx().userId());
            ConfirmTransactionRequest request =
                    validation.valid(new ConfirmTransactionRequest(amount, when, stored.version()));
            try {
                return saved(resolved, transactionService.confirm(id, request, resolved.ctx()));
            } catch (DomainException exception) {
                if (exception.type() != ProblemType.TRANSACTION_NOT_AWAITING_CONFIRMATION) {
                    throw exception;
                }
                throw new McpToolException("Transaction " + id + " is not awaiting confirmation, so it does not "
                        + "take one. Its date or amount can be edited with update_transaction instead.");
            }
        });
    }

    private static McpSavedTransactionResponse saved(McpPlanResolver.ResolvedPlan plan, TransactionResponse stored) {
        return new McpSavedTransactionResponse(plan.name(), McpTransactionResponse.from(stored));
    }
}
