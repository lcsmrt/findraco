package com.lcs.findraco.mcp.tool;

import com.lcs.findraco.mcp.exception.McpToolException;
import com.lcs.findraco.mcp.response.McpRepaymentResponse;
import com.lcs.findraco.mcp.response.McpSavedTransactionResponse;
import com.lcs.findraco.mcp.response.McpSettledResponse;
import com.lcs.findraco.mcp.response.McpTransactionPageResponse;
import com.lcs.findraco.mcp.response.McpTransactionResponse;
import com.lcs.findraco.mcp.service.McpCategoryResolver;
import com.lcs.findraco.mcp.service.McpMemberResolver;
import com.lcs.findraco.mcp.service.McpPlanResolver;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.mcp.service.McpUpdateCopy;
import com.lcs.findraco.mcp.service.McpValidation;
import com.lcs.findraco.plan.response.ContactStatementResponse;
import com.lcs.findraco.plan.response.ContactStatementShareResponse;
import com.lcs.findraco.plan.service.ContactStatementService;
import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionStatus;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.request.ConfirmTransactionRequest;
import com.lcs.findraco.transaction.request.CreateTransactionRequest;
import com.lcs.findraco.transaction.request.TransactionFilter;
import com.lcs.findraco.transaction.request.TransactionParticipantRequest;
import com.lcs.findraco.transaction.request.UpdateTransactionRequest;
import com.lcs.findraco.transaction.response.RepaymentResponse;
import com.lcs.findraco.transaction.response.TransactionResponse;
import com.lcs.findraco.transaction.service.TransactionService;
import com.lcs.findraco.user.service.UserService;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final McpMemberResolver members;
    private final McpValidation validation;
    private final TransactionService transactionService;
    private final ContactStatementService statementService;
    private final UserService userService;

    public McpTransactionTools(
            McpToolRunner runner,
            McpCategoryResolver categories,
            McpMemberResolver members,
            McpValidation validation,
            TransactionService transactionService,
            ContactStatementService statementService,
            UserService userService) {
        this.runner = runner;
        this.categories = categories;
        this.members = members;
        this.validation = validation;
        this.transactionService = transactionService;
        this.statementService = statementService;
        this.userService = userService;
    }

    @McpTool(
            name = "list_transactions",
            title = "List transactions",
            description = "Lists the transactions of a plan, newest first, at most 50 per call, each with id, "
                    + "description, amount, date, type, category and status (ACTUAL happened, FORECAST is expected "
                    + "and not confirmed yet, PENDING is due but waits for its confirmation) and kind (none for a "
                    + "normal income or expense; TRANSFER, CARD_BILL_PAYMENT, SAVINGS and REPAYMENT count in no "
                    + "total, REFUND lowers the spending of its category; a REPAYMENT is a contact paying back and "
                    + "names the contact). Filter by period, "
                    + "category, type, status, description text, or only what has no category; each row also says "
                    + "whom it is attributed to, members and contacts alike (a contact's share is money to receive, "
                    + "not the plan's spending), and its place in a series (\"3/6\" or \"monthly\"). The answer says "
                    + "how many matched and how to get the next page.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, openWorldHint = false))
    public CallToolResult listTransactions(
            @McpToolParam(required = false, description = "First date to include (YYYY-MM-DD)") LocalDate from,
            @McpToolParam(required = false, description = "Last date to include (YYYY-MM-DD)") LocalDate to,
            @McpToolParam(required = false, description = "Category name; includes its subcategories") String category,
            @McpToolParam(required = false, description = "DEBIT for expenses, CREDIT for income") TransactionType type,
            @McpToolParam(required = false, description = "Text the description contains") String text,
            @McpToolParam(
                            required = false,
                            description = "ACTUAL, FORECAST or PENDING; PENDING is what waits for its confirmation")
                    TransactionStatus status,
            @McpToolParam(required = false, description = "true for only the transactions with no category")
                    Boolean uncategorized,
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
                            type,
                            categoryId,
                            null,
                            text,
                            from,
                            to,
                            null,
                            null,
                            status,
                            uncategorized,
                            null,
                            pageNumber,
                            PAGE_SIZE,
                            null,
                            null),
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
            description = "Records one expense (DEBIT) or income (CREDIT) in a plan, attributed to the user unless "
                    + "attributedTo names other members or contacts: one name puts the whole amount on that person, "
                    + "two or more split it equally. A contact is someone without an account (see list_contacts); "
                    + "a contact's share is money to receive and counts in none of the plan's totals, so use it "
                    + "when the user paid for someone else. The date is today unless given; the category is by name (see "
                    + "list_categories) and the transaction is uncategorized without one. Installments, "
                    + "recurrences and splits by fixed amounts are not created from here. A kind marks what is not "
                    + "plain income or expense: TRANSFER (between members), CARD_BILL_PAYMENT (paying the card bill) "
                    + "and SAVINGS (money set aside) count in no total and take no category or items, and one member; "
                    + "REFUND is a CREDIT that gives back spending and needs the expense category it pays back. "
                    + "REPAYMENT is a CREDIT for money a contact paid back: pass contact (their name) and, in "
                    + "attributedTo, the member who received it (the user when omitted); it counts in no total, takes "
                    + "no category, and settles the contact's oldest unpaid purchases first, any excess becoming the "
                    + "contact's credit. "
                    + "Returns the stored transaction and, for a REPAYMENT, the purchases it settled and the credit.",
            annotations = @McpTool.McpAnnotations(destructiveHint = false, openWorldHint = false))
    public CallToolResult createTransaction(
            @McpToolParam(description = "DEBIT for an expense, CREDIT for income") TransactionType type,
            @McpToolParam(description = "Positive amount with at most 2 decimal places") BigDecimal amount,
            @McpToolParam(description = "What it was, up to 255 characters") String description,
            @McpToolParam(required = false, description = "Date (YYYY-MM-DD); today when omitted") LocalDate date,
            @McpToolParam(required = false, description = "Category name; uncategorized when omitted") String category,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted") String plan,
            @McpToolParam(
                            required = false,
                            description = "Names of the plan members or contacts it is for (first or full name), "
                                    + "at most 20; the amount is split equally between them. The user when omitted")
                    List<String> attributedTo,
            @McpToolParam(
                            required = false,
                            description = "TRANSFER, CARD_BILL_PAYMENT, SAVINGS, REFUND or REPAYMENT; a normal "
                                    + "income or expense when omitted")
                    TransactionKind kind,
            @McpToolParam(
                            required = false,
                            description = "Name of the contact who paid back; with kind REPAYMENT only, and "
                                    + "required with it")
                    String contact) {
        return runner.inPlan("create_transaction", plan, resolved -> {
            boolean repayment = kind == TransactionKind.REPAYMENT;
            boolean withContact = contact != null && !contact.isBlank();
            if (withContact && !repayment) {
                throw new McpToolException("contact is for kind REPAYMENT only. For a contact's share of a "
                        + "purchase, name them in attributedTo.");
            }
            if (repayment && !withContact) {
                throw new McpToolException(
                        "A REPAYMENT needs contact, the name of the contact who paid back. " + "See list_contacts.");
            }
            Long contactId = repayment ? members.contact(contact, resolved.name(), resolved.ctx()) : null;
            List<TransactionParticipantRequest> participants = attributedTo == null || attributedTo.isEmpty()
                    ? null
                    : members.resolve(attributedTo, resolved.name(), resolved.ctx());
            Long categoryId = category == null || category.isBlank()
                    ? null
                    : categories.resolve(category, resolved.name(), resolved.ctx());
            LocalDate when =
                    date != null ? date : userService.today(resolved.ctx().userId());
            CreateTransactionRequest request = validation.valid(new CreateTransactionRequest(
                    categoryId,
                    type,
                    amount,
                    description,
                    null,
                    when,
                    null,
                    SplitMode.EQUAL,
                    participants,
                    null,
                    kind,
                    contactId,
                    null));
            TransactionResponse stored = transactionService.create(request, resolved.ctx());
            return repayment ? savedRepayment(resolved, stored) : saved(resolved, stored);
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

    @McpTool(
            name = "update_transaction",
            title = "Update transaction",
            description = "Corrects the amount, the date, the description, the category or the kind of one "
                    + "transaction (TRANSFER, CARD_BILL_PAYMENT, SAVINGS or REFUND; removeKind makes it a plain "
                    + "income or expense again); "
                    + "everything else stays as stored. For an occurrence of a series only that occurrence changes "
                    + "(a later edit of the whole series in the app may reset it to the series values). A transaction "
                    + "split by fixed amounts cannot change its amount here. Pass at least one of amount, date, "
                    + "description, category, removeCategory (which leaves it uncategorized), kind and removeKind. "
                    + "Find the id with "
                    + "list_transactions.",
            annotations =
                    @McpTool.McpAnnotations(destructiveHint = false, idempotentHint = true, openWorldHint = false))
    public CallToolResult updateTransaction(
            @McpToolParam(description = "Id of the transaction to change") Long id,
            @McpToolParam(required = false, description = "The new amount, positive with at most 2 decimal places")
                    BigDecimal amount,
            @McpToolParam(required = false, description = "The new date (YYYY-MM-DD)") LocalDate date,
            @McpToolParam(required = false, description = "The new description, up to 255 characters")
                    String description,
            @McpToolParam(required = false, description = "The new category name (see list_categories)")
                    String category,
            @McpToolParam(required = false, description = "true to leave the transaction with no category")
                    Boolean removeCategory,
            @McpToolParam(required = false, description = "TRANSFER, CARD_BILL_PAYMENT, SAVINGS or REFUND")
                    TransactionKind kind,
            @McpToolParam(required = false, description = "true to make it a plain income or expense again")
                    Boolean removeKind,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan("update_transaction", plan, resolved -> {
            boolean withCategory = category != null && !category.isBlank();
            boolean clearCategory = Boolean.TRUE.equals(removeCategory);
            if (withCategory && clearCategory) {
                throw new McpToolException("Pass either category or removeCategory, not both.");
            }
            boolean withKind = kind != null;
            boolean clearKind = Boolean.TRUE.equals(removeKind);
            if (withKind && clearKind) {
                throw new McpToolException("Pass either kind or removeKind, not both.");
            }
            if (amount == null
                    && date == null
                    && description == null
                    && !withCategory
                    && !clearCategory
                    && !withKind
                    && !clearKind) {
                throw new McpToolException("Pass at least one of amount, date and description (or category, "
                        + "removeCategory, kind or removeKind) to change.");
            }
            Long categoryId = withCategory ? categories.resolve(category, resolved.name(), resolved.ctx()) : null;
            TransactionResponse stored = transactionService.getById(id, resolved.ctx());
            if (amount != null && amount.compareTo(stored.amount()) != 0 && stored.splitMode() == SplitMode.EXACT) {
                throw new McpToolException("Transaction " + id + " is split by fixed amounts, so its amount "
                        + "cannot change from here. Edit it in the app.");
            }
            UpdateTransactionRequest request = validation.valid(McpUpdateCopy.of(
                    stored,
                    amount,
                    date,
                    description,
                    withCategory || clearCategory,
                    categoryId,
                    withKind || clearKind,
                    kind));
            // SPEC_DEVIATION: design.md sends an occurrence of a series through editSeries with scope THIS_ONE.
            // Reason: that edit keeps the occurrence's own date and takes its category and split from the series
            // definition, so it could neither move the date (spec Edit 1) nor keep every other field as stored.
            // The plain update changes this one row only, in one transaction, with its own version.
            try {
                return saved(resolved, transactionService.update(id, request, resolved.ctx()));
            } catch (DomainException exception) {
                if (exception.type() != ProblemType.STALE_VERSION) {
                    throw exception;
                }
                throw new McpToolException("Transaction " + id + " changed meanwhile, so nothing was saved. "
                        + "Read it again and retry.");
            }
        });
    }

    /**
     * A repayment with what it settled, read back from the contact's statement so the answer says where each purchase
     * stands now and where the contact stands after it.
     */
    private McpSavedTransactionResponse savedRepayment(McpPlanResolver.ResolvedPlan plan, TransactionResponse stored) {
        RepaymentResponse repayment = stored.repayment();
        ContactStatementResponse statement = statementService.statement(repayment.contactId(), plan.ctx());
        Map<Long, ContactStatementShareResponse> sharesById = new HashMap<>();
        statement
                .months()
                .forEach(month -> month.shares().forEach(share -> sharesById.put(share.participantId(), share)));

        List<McpSettledResponse> settled = repayment.allocations().stream()
                .map(allocation -> {
                    ContactStatementShareResponse share = sharesById.get(allocation.participantId());
                    return new McpSettledResponse(
                            allocation.transactionId(),
                            share.description(),
                            share.date(),
                            allocation.amount(),
                            share.status());
                })
                .toList();
        BigDecimal allocated =
                settled.stream().map(McpSettledResponse::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new McpSavedTransactionResponse(
                plan.name(),
                McpTransactionResponse.from(stored),
                new McpRepaymentResponse(
                        repayment.contactName(),
                        settled,
                        stored.amount().subtract(allocated),
                        statement.owed(),
                        statement.credit()));
    }

    private static McpSavedTransactionResponse saved(McpPlanResolver.ResolvedPlan plan, TransactionResponse stored) {
        return new McpSavedTransactionResponse(plan.name(), McpTransactionResponse.from(stored));
    }
}
