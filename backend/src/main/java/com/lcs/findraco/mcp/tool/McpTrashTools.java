package com.lcs.findraco.mcp.tool;

import com.lcs.findraco.mcp.response.McpDeletionResponse;
import com.lcs.findraco.mcp.response.McpRestoredResponse;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.request.TransactionTrashFilter;
import com.lcs.findraco.transaction.response.TransactionDeletedResponse;
import com.lcs.findraco.transaction.response.TransactionResponse;
import com.lcs.findraco.transaction.response.TransactionTrashEntryResponse;
import com.lcs.findraco.transaction.service.TransactionService;
import com.lcs.findraco.transaction.service.TransactionTrashService;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

/** Deleting a transaction to the plan's trash and bringing it back, as the app's delete and undo do. */
@Component
public class McpTrashTools {

    /** The deletion just made is the newest, so it is on the first page of the trash. */
    private static final TransactionTrashFilter NEWEST = new TransactionTrashFilter(0, 20);

    private final McpToolRunner runner;
    private final TransactionService transactionService;
    private final TransactionTrashService trashService;

    public McpTrashTools(
            McpToolRunner runner, TransactionService transactionService, TransactionTrashService trashService) {
        this.runner = runner;
        this.transactionService = transactionService;
        this.trashService = trashService;
    }

    @McpTool(
            name = "delete_transaction",
            title = "Delete transaction",
            description = "Moves one transaction to the plan's trash, where it can be restored for 30 days with "
                    + "restore_deletion and the deletionId this returns. For an installment or a recurring series, "
                    + "scope says what goes: THIS_ONE (the default), THIS_AND_FOLLOWING or ALL; a single "
                    + "transaction ignores it. Find the id with list_transactions.",
            annotations = @McpTool.McpAnnotations(destructiveHint = true, openWorldHint = false))
    public CallToolResult deleteTransaction(
            @McpToolParam(description = "Id of the transaction to delete") Long id,
            @McpToolParam(
                            required = false,
                            description = "For a series only: THIS_ONE (default), THIS_AND_FOLLOWING or ALL")
                    SeriesEditScope scope,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan("delete_transaction", plan, resolved -> {
            TransactionResponse stored = transactionService.getById(id, resolved.ctx());
            TransactionDeletedResponse deleted = stored.seriesId() == null
                    ? transactionService.delete(id, resolved.ctx())
                    : transactionService.deleteSeries(
                            stored.seriesId(), scope == null ? SeriesEditScope.THIS_ONE : scope, id, resolved.ctx());
            TransactionTrashEntryResponse entry = trashService.list(NEWEST, resolved.ctx()).stream()
                    .filter(candidate -> candidate.id() == deleted.deletionId())
                    .findFirst()
                    .orElseThrow();
            return new McpDeletionResponse(deleted.deletionId(), entry.description(), entry.count());
        });
    }

    @McpTool(
            name = "restore_deletion",
            title = "Restore deletion",
            description = "Brings back everything one delete_transaction moved to the trash, by its deletionId, "
                    + "within 30 days. It restores that deletion once; a second call, or a series edited since, is "
                    + "refused.",
            annotations = @McpTool.McpAnnotations(destructiveHint = false, openWorldHint = false))
    public CallToolResult restoreDeletion(
            @McpToolParam(description = "The deletionId delete_transaction answered") Long deletionId,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan(
                "restore_deletion",
                plan,
                resolved -> new McpRestoredResponse(
                        trashService.restore(deletionId, resolved.ctx()).restored()));
    }
}
