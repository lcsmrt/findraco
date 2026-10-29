package com.lcs.findraco.transaction.controller;

import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.shared.web.PagedResponseDto;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.request.SeriesEditRequestDto;
import com.lcs.findraco.transaction.request.TransactionFilterDto;
import com.lcs.findraco.transaction.request.TransactionRequestDto;
import com.lcs.findraco.transaction.request.TransactionSeriesRequestDto;
import com.lcs.findraco.transaction.response.RecurrenceDefinitionResponseDto;
import com.lcs.findraco.transaction.response.TransactionImportResponseDto;
import com.lcs.findraco.transaction.response.TransactionResponseDto;
import com.lcs.findraco.transaction.response.TransactionSeriesResponseDto;
import com.lcs.findraco.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
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
    public ResponseEntity<TransactionResponseDto> getTransaction(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(new TransactionResponseDto(transactionService.findById(id, ctx)));
    }

    @Operation(summary = "Fetches all transactions for the plan")
    @GetMapping
    public ResponseEntity<PagedResponseDto<TransactionResponseDto>> getAllTransactions(
            @ParameterObject @ModelAttribute @Valid TransactionFilterDto filter, PlanContext ctx) {
        return ResponseEntity.ok(new PagedResponseDto<>(
                transactionService.findAllByPlanPaged(filter, ctx).map(TransactionResponseDto::new)));
    }

    @Operation(summary = "Creates a new transaction")
    @PostMapping
    public ResponseEntity<TransactionResponseDto> createTransaction(
            @RequestBody @Valid TransactionRequestDto dto, PlanContext ctx) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TransactionResponseDto(transactionService.create(dto, ctx)));
    }

    @Operation(summary = "Creates a series of recurring transactions")
    @PostMapping("/series")
    public ResponseEntity<TransactionSeriesResponseDto> createSeries(
            @RequestBody @Valid TransactionSeriesRequestDto dto, PlanContext ctx) {
        List<Transaction> occurrences = transactionService.createSeries(dto, ctx);
        return ResponseEntity.status(HttpStatus.CREATED).body(new TransactionSeriesResponseDto(occurrences));
    }

    @Operation(summary = "Updates a transaction")
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponseDto> updateTransaction(
            @PathVariable Long id, @RequestBody @Valid TransactionRequestDto dto, PlanContext ctx) {
        return ResponseEntity.ok(new TransactionResponseDto(transactionService.update(id, dto, ctx)));
    }

    @Operation(summary = "Imports transactions from a Nubank CSV file")
    @PostMapping("/import")
    public ResponseEntity<TransactionImportResponseDto> importCsv(
            @RequestParam("file") MultipartFile file, PlanContext ctx) {
        int imported = transactionService.importFromNubankCsv(file, ctx);
        HttpStatus status = imported > 0 ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(new TransactionImportResponseDto(imported));
    }

    @Operation(summary = "Deletes a transaction")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, PlanContext ctx) {
        transactionService.delete(id, ctx);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Deletes a series of recurring transactions (This one / This and following / All)")
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
    public ResponseEntity<RecurrenceDefinitionResponseDto> getSeries(@PathVariable String seriesId, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.getSeriesDefinition(seriesId, ctx));
    }

    @Operation(summary = "Edits a series of recurring transactions (This one / This and following / All)")
    @PutMapping("/series/{seriesId}")
    public ResponseEntity<TransactionSeriesResponseDto> editSeries(
            @PathVariable String seriesId, @RequestBody @Valid SeriesEditRequestDto dto, PlanContext ctx) {
        return ResponseEntity.ok(transactionService.editSeries(seriesId, dto, ctx));
    }
}
