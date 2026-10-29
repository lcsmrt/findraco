package com.lcs.findraco.transaction.controller;

import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.shared.web.PageResponse;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.request.CreateSeriesRequest;
import com.lcs.findraco.transaction.request.CreateTransactionRequest;
import com.lcs.findraco.transaction.request.TransactionFilter;
import com.lcs.findraco.transaction.request.UpdateSeriesRequest;
import com.lcs.findraco.transaction.request.UpdateTransactionRequest;
import com.lcs.findraco.transaction.response.RecurrenceDefinitionResponse;
import com.lcs.findraco.transaction.response.TransactionImportResponse;
import com.lcs.findraco.transaction.response.TransactionResponse;
import com.lcs.findraco.transaction.response.TransactionSeriesResponse;
import com.lcs.findraco.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
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

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @Operation(summary = "Fetches a transaction by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(TransactionResponse.from(transactionService.findById(id, ctx)));
    }

    @Operation(summary = "Fetches all transactions for the plan")
    @GetMapping
    public ResponseEntity<PageResponse<TransactionResponse>> getAllTransactions(
            @ParameterObject @ModelAttribute @Valid TransactionFilter filter, PlanContext ctx) {
        return ResponseEntity.ok(PageResponse.from(
                transactionService.findAllByPlanPaged(filter, ctx).map(TransactionResponse::from)));
    }

    @Operation(summary = "Creates a new transaction")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody @Valid CreateTransactionRequest dto, PlanContext ctx) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(TransactionResponse.from(transactionService.create(dto, ctx)));
    }

    @Operation(summary = "Creates a series of recurring transactions")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/series")
    public ResponseEntity<TransactionSeriesResponse> createSeries(
            @RequestBody @Valid CreateSeriesRequest dto, PlanContext ctx) {
        List<Transaction> occurrences = transactionService.createSeries(dto, ctx);
        return ResponseEntity.status(HttpStatus.CREATED).body(TransactionSeriesResponse.from(occurrences));
    }

    @Operation(summary = "Updates a transaction")
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id, @RequestBody @Valid UpdateTransactionRequest dto, PlanContext ctx) {
        return ResponseEntity.ok(TransactionResponse.from(transactionService.update(id, dto, ctx)));
    }

    @Operation(summary = "Imports transactions from a Nubank CSV file")
    @ApiResponse(responseCode = "201", description = "Created")
    @ApiResponse(responseCode = "200", description = "OK")
    @PostMapping("/import")
    public ResponseEntity<TransactionImportResponse> importCsv(
            @RequestParam("file") MultipartFile file, PlanContext ctx) {
        int imported = transactionService.importFromNubankCsv(file, ctx);
        HttpStatus status = imported > 0 ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(new TransactionImportResponse(imported));
    }

    @Operation(summary = "Deletes a transaction")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, PlanContext ctx) {
        transactionService.delete(id, ctx);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Deletes a series of recurring transactions (This one / This and following / All)")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/series/{seriesId}")
    public ResponseEntity<Void> deleteSeries(
            @PathVariable String seriesId,
            @RequestParam(defaultValue = "ALL") SeriesEditScope scope,
            @RequestParam(required = false) Long pivotOccurrenceId,
            PlanContext ctx) {
        transactionService.deleteSeries(seriesId, scope, pivotOccurrenceId, ctx);
        return ResponseEntity.noContent().build();
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
