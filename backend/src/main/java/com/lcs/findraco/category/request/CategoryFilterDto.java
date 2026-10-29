package com.lcs.findraco.category.request;

import com.lcs.findraco.shared.web.PaginatedFilterDto;
import com.lcs.findraco.transaction.model.TransactionType;

public class CategoryFilterDto extends PaginatedFilterDto {

    private String description;
    private TransactionType type;

    public CategoryFilterDto() {
        super("description", "asc");
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }
}
