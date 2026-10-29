package com.lcs.findraco.controllers;

import com.lcs.findraco.dtos.request.CategorySpendingFilterDto;
import com.lcs.findraco.dtos.request.FinancialTransactionCategoryFilterDto;
import com.lcs.findraco.dtos.request.FinancialTransactionCategoryRequestDto;
import com.lcs.findraco.dtos.response.CategorySpendingDto;
import com.lcs.findraco.dtos.response.CategoryUsageDto;
import com.lcs.findraco.dtos.response.FinancialTransactionCategoryResponseDto;
import com.lcs.findraco.dtos.response.PagedResponseDto;
import com.lcs.findraco.security.PlanContext;
import com.lcs.findraco.services.CategorySpendingService;
import com.lcs.findraco.services.FinancialTransactionCategoryService;
import com.lcs.findraco.utils.ApiRoutes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Financial Transaction Categories")
@RestController
@RequestMapping(ApiRoutes.FINANCIAL_TRANSACTION_CATEGORY)
public class FinancialTransactionCategoryController {

    private final FinancialTransactionCategoryService categoryService;
    private final CategorySpendingService categorySpendingService;

    public FinancialTransactionCategoryController(
            FinancialTransactionCategoryService categoryService, CategorySpendingService categorySpendingService) {
        this.categoryService = categoryService;
        this.categorySpendingService = categorySpendingService;
    }

    @Operation(
            summary =
                    "Returns every category of the plan as DEBIT and CREDIT trees with the period's spend and limit usage")
    @GetMapping("/spending")
    public ResponseEntity<List<CategorySpendingDto>> getSpending(
            @ParameterObject @ModelAttribute @Valid CategorySpendingFilterDto filter, PlanContext ctx) {
        return ResponseEntity.ok(categorySpendingService.getSpending(filter, ctx));
    }

    @Operation(summary = "Fetches a transaction category by ID")
    @GetMapping("/{id}")
    public ResponseEntity<FinancialTransactionCategoryResponseDto> getCategory(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(categoryService.getById(id, ctx));
    }

    @Operation(summary = "Counts the transactions, items and recurrence definitions that use a transaction category")
    @GetMapping("/{id}/usage")
    public ResponseEntity<CategoryUsageDto> getCategoryUsage(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(categoryService.getUsage(id, ctx));
    }

    @Operation(summary = "Fetches all transaction categories for the plan")
    @GetMapping
    public ResponseEntity<PagedResponseDto<FinancialTransactionCategoryResponseDto>> getAllCategories(
            @ParameterObject @ModelAttribute @Valid FinancialTransactionCategoryFilterDto filter, PlanContext ctx) {
        return ResponseEntity.ok(new PagedResponseDto<>(categoryService.findAllByPlanPaged(filter, ctx)));
    }

    @Operation(summary = "Creates a new transaction category for the plan")
    @PostMapping
    public ResponseEntity<FinancialTransactionCategoryResponseDto> createCategory(
            @RequestBody @Valid FinancialTransactionCategoryRequestDto dto, PlanContext ctx) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(dto, ctx));
    }

    @Operation(summary = "Updates a transaction category for the plan")
    @PutMapping("/{id}")
    public ResponseEntity<FinancialTransactionCategoryResponseDto> updateCategory(
            @PathVariable Long id, @RequestBody @Valid FinancialTransactionCategoryRequestDto dto, PlanContext ctx) {
        return ResponseEntity.ok(categoryService.update(id, dto, ctx));
    }

    @Operation(
            summary =
                    "Deletes a transaction category, optionally moving its transactions, items and recurrences to another category")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id, @RequestParam(required = false) Long reassignTo, PlanContext ctx) {
        categoryService.delete(id, reassignTo, ctx);
        return ResponseEntity.noContent().build();
    }
}
