package com.lcs.findraco.category.repository;

import com.lcs.findraco.category.model.FinancialTransactionCategory;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.FinancialTransactionType;
import java.util.Locale;
import org.springframework.data.jpa.domain.Specification;

public class FinancialTransactionCategorySpecification {

    public static Specification<FinancialTransactionCategory> belongsToPlan(Plan plan) {
        return (root, query, cb) -> cb.equal(root.get("plan"), plan);
    }

    public static Specification<FinancialTransactionCategory> descriptionContains(String description) {
        if (description == null || description.isBlank()) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase(Locale.ROOT) + "%");
    }

    public static Specification<FinancialTransactionCategory> typeEquals(FinancialTransactionType type) {
        if (type == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> cb.equal(root.get("type"), type);
    }
}
