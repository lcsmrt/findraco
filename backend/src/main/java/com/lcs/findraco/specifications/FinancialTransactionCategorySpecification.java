package com.lcs.findraco.specifications;

import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.Plan;
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
