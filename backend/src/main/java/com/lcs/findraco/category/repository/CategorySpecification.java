package com.lcs.findraco.category.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.shared.web.LikePatterns;
import com.lcs.findraco.transaction.model.TransactionType;
import org.springframework.data.jpa.domain.Specification;

public class CategorySpecification {

    public static Specification<Category> belongsToPlan(Plan plan) {
        return (root, query, cb) -> cb.equal(root.get("plan"), plan);
    }

    public static Specification<Category> descriptionContains(String description) {
        if (description == null || description.isBlank()) {
            return (root, query, cb) -> null;
        }
        String pattern = LikePatterns.contains(description);
        return (root, query, cb) -> cb.like(cb.lower(root.get("description")), pattern, LikePatterns.ESCAPE);
    }

    public static Specification<Category> typeEquals(TransactionType type) {
        if (type == null) {
            return (root, query, cb) -> null;
        }
        return (root, query, cb) -> cb.equal(root.get("type"), type);
    }
}
