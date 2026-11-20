package com.lcs.findraco.transaction.controller;

import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.shared.web.PageResponse;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.request.ConfirmTransactionRequest;
import com.lcs.findraco.transaction.request.CreateSeriesRequest;
import com.lcs.findraco.transaction.request.CreateTransactionRequest;
import com.lcs.findraco.transaction.request.NeutralCandidateFilter;
import com.lcs.findraco.transaction.request.SetTransactionKindRequest;
import com.lcs.findraco.transaction.request.TransactionFilter;
import com.lcs.findraco.transaction.request.UpdateSeriesRequest;
import com.lcs.findraco.transaction.request.UpdateTransactionRequest;
import com.lcs.findraco.transaction.response.ImportResultResponse;
import com.lcs.findraco.transaction.response.NeutralCandidateResponse;
import com.lcs.findraco.transaction.response.RecurrenceDefinitionResponse;
import com.lcs.findraco.transaction.response.TransactionDeletedResponse;
import com.lcs.findraco.transaction.response.TransactionResponse;
import com.lcs.findraco.transaction.response.TransactionSeriesResponse;
import com.lcs.findraco.transaction.service.TransactionImportService;
import com.lcs.findraco.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Transactions")
@RestController
@RequestMapping(TransactionRoutes.TRANSACTION)
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionImportService importService;

    public TransactionController(TransactionService transactionService, TransactionImportService importService) {
        this.transactionService = transactionService;
        this.importService = importService;
    }

    @Operation(summary = "Fetches a transaction by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.getById(id, ctx));
    }

    @Operation(summary = "Fetches all transactions for the plan")
    @GetMapping
    public ResponseEntity<PageResponse<TransactionResponse>> getAllTransactions(
            @ParameterObject @ModelAttribute @Valid TransactionFilter filter, PlanContext ctx) {
        return ResponseEntity.ok(PageResponse.from(transactionService.findAllByPlanPaged(filter, ctx)));
    }

    @Operation(summary = "Lists the rows with no kind whose bank text looks like a neutral movement, newest first")
    @GetMapping("/neutral-candidates")
    public ResponseEntity<PageResponse<NeutralCandidateResponse>> getNeutralCandidates(
            @ParameterObject @ModelAttribute @Valid NeutralCandidateFilter filter, PlanContext ctx) {
        return ResponseEntity.ok(PageResponse.from(transactionService.findNeutralCandidates(filter, ctx)));
    }

    @Operation(summary = "Creates a new transaction")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody @Valid CreateTransactionRequest dto, PlanContext ctx) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(dto, ctx));
    }

    @Operation(summary = "Creates a series of recurring transactions")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/series")
    public ResponseEntity<TransactionSeriesResponse> createSeries(
            @RequestBody @Valid CreateSeriesRequest dto, PlanContext ctx) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.createSeries(dto, ctx));
    }

    @Operation(summary = "Updates a transaction")
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id, @RequestBody @Valid UpdateTransactionRequest dto, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.update(id, dto, ctx));
    }

    @Operation(summary = "Marks a transaction as a neutral movement or a refund")
    @PostMapping("/{id}/kind")
    public ResponseEntity<TransactionResponse> setTransactionKind(
            @PathVariable Long id, @RequestBody @Valid SetTransactionKindRequest dto, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.setKind(id, dto, ctx));
    }

    @Operation(summary = "Confirms an occurrence with the amount and date it was really charged")
    @PostMapping("/{id}/confirm")
    public ResponseEntity<TransactionResponse> confirmTransaction(
            @PathVariable Long id, @RequestBody @Valid ConfirmTransactionRequest dto, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.confirm(id, dto, ctx));
    }

    @Operation(summary = "Imports transactions from a bank CSV file, all or nothing")
    @ApiResponse(responseCode = "201", description = "Created")
    @ApiResponse(responseCode = "200", description = "OK")
    @PostMapping("/import")
    public ResponseEntity<ImportResultResponse> importCsv(@RequestParam("file") MultipartFile file, PlanContext ctx) {
        ImportResultResponse result = importService.importFile(file, ctx);
        HttpStatus status = result.imported() > 0 ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(result);
    }

    @Operation(summary = "Moves a transaction to the trash, where it can be restored for 30 days")
    @DeleteMapping("/{id}")
    public ResponseEntity<TransactionDeletedResponse> deleteTransaction(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.delete(id, ctx));
    }

    @Operation(
            summary =
                    "Moves a series of recurring transactions to the trash (This one / This and following / All); the scope is required")
    @DeleteMapping("/series/{seriesId}")
    public ResponseEntity<TransactionDeletedResponse> deleteSeries(
            @PathVariable String seriesId,
            @RequestParam SeriesEditScope scope,
            @RequestParam(required = false) Long pivotOccurrenceId,
            PlanContext ctx) {
        return ResponseEntity.ok(transactionService.deleteSeries(seriesId, scope, pivotOccurrenceId, ctx));
    }

    @Operation(summary = "Fetches a series' recurrence definition (for edit-form prefill)")
    @GetMapping("/series/{seriesId}")
    public ResponseEntity<RecurrenceDefinitionResponse> getSeries(@PathVariable String seriesId, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.getSeriesDefinition(seriesId, ctx));
    }

    @Operation(summary = "Edits a series of recurring transactions (This one / This and following / All)")
    @PutMapping("/series/{seriesId}")
    public ResponseEntity<TransactionSeriesResponse> editSeries(
            @PathVariable String seriesId, @RequestBody @Valid UpdateSeriesRequest dto, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.editSeries(seriesId, dto, ctx));
    }
}
