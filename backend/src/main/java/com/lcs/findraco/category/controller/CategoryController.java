package com.lcs.findraco.category.controller;

import com.lcs.findraco.category.request.CategoryFilterDto;
import com.lcs.findraco.category.request.CategoryRequestDto;
import com.lcs.findraco.category.request.CategorySpendingFilterDto;
import com.lcs.findraco.category.response.CategoryResponseDto;
import com.lcs.findraco.category.response.CategorySpendingDto;
import com.lcs.findraco.category.response.CategoryUsageDto;
import com.lcs.findraco.category.service.CategoryService;
import com.lcs.findraco.category.service.CategorySpendingService;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.shared.web.PagedResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Categories")
@RestController
@RequestMapping(CategoryRoutes.CATEGORY)
public class CategoryController {

    private final CategoryService categoryService;
    private final CategorySpendingService categorySpendingService;

    public CategoryController(CategoryService categoryService, CategorySpendingService categorySpendingService) {
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
    public ResponseEntity<CategoryResponseDto> getCategory(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(categoryService.getById(id, ctx));
    }

    @Operation(summary = "Counts the transactions, items and recurrence definitions that use a transaction category")
    @GetMapping("/{id}/usage")
    public ResponseEntity<CategoryUsageDto> getCategoryUsage(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(categoryService.getUsage(id, ctx));
    }

    @Operation(summary = "Fetches all transaction categories for the plan")
    @GetMapping
    public ResponseEntity<PagedResponseDto<CategoryResponseDto>> getAllCategories(
            @ParameterObject @ModelAttribute @Valid CategoryFilterDto filter, PlanContext ctx) {
        return ResponseEntity.ok(new PagedResponseDto<>(categoryService.findAllByPlanPaged(filter, ctx)));
    }

    @Operation(summary = "Creates a new transaction category for the plan")
    @PostMapping
    public ResponseEntity<CategoryResponseDto> createCategory(
            @RequestBody @Valid CategoryRequestDto dto, PlanContext ctx) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(dto, ctx));
    }

    @Operation(summary = "Updates a transaction category for the plan")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> updateCategory(
            @PathVariable Long id, @RequestBody @Valid CategoryRequestDto dto, PlanContext ctx) {
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
