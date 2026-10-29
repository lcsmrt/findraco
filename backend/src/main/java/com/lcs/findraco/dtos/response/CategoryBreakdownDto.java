package com.lcs.findraco.dtos.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * One row of the Overview category breakdown: a root category with rolled-up spend, its children
 * nested. Built from the shared {@link CategorySpendingDto} so the Overview and the Categories tab
 * show the same numbers.
 */
public class CategoryBreakdownDto {
    private final Long categoryId;
    private final Long parentId;
    private final String categoryName;
    private final BigDecimal spent;
    private final BigDecimal limit;
    private final BigDecimal remaining;
    private final BigDecimal percentUsed;
    private final Boolean overLimit;
    private final List<CategoryBreakdownDto> children;

    public CategoryBreakdownDto(CategorySpendingDto spending) {
        this.categoryId = spending.getCategoryId();
        this.parentId = spending.getParentId();
        this.categoryName = spending.getName();
        this.spent = spending.getSpent();
        this.limit = spending.getLimit();
        this.remaining = spending.getRemaining();
        this.percentUsed = spending.getPercentUsed();
        this.overLimit = spending.getOverLimit();
        this.children =
                spending.getChildren().stream().map(CategoryBreakdownDto::new).toList();
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public Long getParentId() {
        return parentId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public BigDecimal getSpent() {
        return spent;
    }

    public BigDecimal getLimit() {
        return limit;
    }

    public BigDecimal getRemaining() {
        return remaining;
    }

    public BigDecimal getPercentUsed() {
        return percentUsed;
    }

    public Boolean getOverLimit() {
        return overLimit;
    }

    public List<CategoryBreakdownDto> getChildren() {
        return children;
    }
}
