package com.lcs.findraco.dtos.response;

import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;

import java.math.BigDecimal;

public class FinancialTransactionCategoryResponseDto {
    private final Long id;
    private final FinancialTransactionType type;
    private final String description;
    private final BigDecimal spendingLimit;
    private final Long parentId;

    public FinancialTransactionCategoryResponseDto(FinancialTransactionCategory category) {
        this.id = category.getId();
        this.type = category.getType();
        this.description = category.getDescription();
        this.spendingLimit = category.getSpendingLimit();
        this.parentId = category.getParent() == null ? null : category.getParent().getId();
    }

    public Long getId() {
        return id;
    }

    public FinancialTransactionType getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getSpendingLimit() {
        return spendingLimit;
    }

    public Long getParentId() {
        return parentId;
    }
}
