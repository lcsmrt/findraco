package com.lcs.findraco.transaction.response;

import com.lcs.findraco.category.response.CategoryResponse;
import com.lcs.findraco.transaction.model.TransactionItem;
import java.math.BigDecimal;

public record TransactionItemResponse(
        Long id, String description, BigDecimal amount, Integer quantity, CategoryResponse category) {

    public static TransactionItemResponse from(TransactionItem item) {
        return new TransactionItemResponse(
                item.getId(),
                item.getDescription(),
                item.getAmount(),
                item.getQuantity(),
                item.getCategory() != null ? CategoryResponse.from(item.getCategory()) : null);
    }
}
