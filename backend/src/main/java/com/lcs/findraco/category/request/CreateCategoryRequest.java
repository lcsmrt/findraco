package com.lcs.findraco.category.request;

import com.lcs.findraco.transaction.model.TransactionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/**
 * The body of a new category.
 *
 * @param ownerId the member the category belongs to; roots only (a child inherits its parent's). Null = shared.
 * @param memberLimits per-member limits, replaced as a set. Null keeps the stored entries unchanged; an empty list
 *     removes them all.
 */
public record CreateCategoryRequest(
        @NotNull(message = "Type cannot be null.") TransactionType type,
        @NotBlank(message = "Description cannot be blank.") String description,
        BigDecimal spendingLimit,
        Long parentId,
        Long ownerId,
        @Valid List<CategoryMemberLimitRequest> memberLimits) {}
