package com.lcs.findraco.dtos.request;

import com.lcs.findraco.models.FinancialTransactionType;

public class FinancialTransactionCategoryFilterDto extends PaginatedFilterDto {

    private String description;
    private FinancialTransactionType type;

    public FinancialTransactionCategoryFilterDto() {
        super("description", "asc");
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public FinancialTransactionType getType() { return type; }
    public void setType(FinancialTransactionType type) { this.type = type; }
}
