package com.lcs.findraco.category.response;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.List;

/**
 * One category row of the spending tree (Categories tab and Overview breakdown): the period's spend,
 * the monthly limit and its usage, the per-member rows and, for a root, its children.
 * No limit → remaining/percentUsed/overLimit null; a zero limit → 0 percent.
 */
public record CategorySpendingResponse(
        Long categoryId,
        Long parentId,
        String name,
        TransactionType type,
        Long ownerId,
        String ownerName,
        Boolean ownerActive,
        BigDecimal spent,
        BigDecimal limit,
        BigDecimal remaining,
        BigDecimal percentUsed,
        Boolean overLimit,
        List<CategoryMemberSpendingResponse> members,
        List<CategorySpendingResponse> children) {

    /**
     * Builds the row, deriving the owner and the limit usage from the category and the spend.
     *
     * @param ownerActive whether the owner (the parent's, for a child) is a current member of the plan;
     *                    null when the category has no owner. A former owner is shown as such (CAT-14).
     */
    public static CategorySpendingResponse of(
            Category category,
            Boolean ownerActive,
            BigDecimal spent,
            BigDecimal limit,
            List<CategoryMemberSpendingResponse> members,
            List<CategorySpendingResponse> children) {
        User owner = category.getParent() == null
                ? category.getOwner()
                : category.getParent().getOwner();
        return new CategorySpendingResponse(
                category.getId(),
                category.getParent() == null ? null : category.getParent().getId(),
                category.getDescription(),
                category.getType(),
                owner == null ? null : owner.getId(),
                owner == null ? null : owner.getName(),
                owner == null ? null : ownerActive,
                spent,
                limit,
                LimitUsage.remaining(spent, limit),
                LimitUsage.percentUsed(spent, limit),
                LimitUsage.overLimit(spent, limit),
                List.copyOf(members),
                List.copyOf(children));
    }
}
