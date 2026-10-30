package com.lcs.findraco.category.response;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.CategoryUsage;
import com.lcs.findraco.category.model.UsageStatus;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.List;
import org.jspecify.annotations.Nullable;

/**
 * One category row of the spending tree (Categories tab and Overview breakdown): the period's spend,
 * the limit scaled to the period and its usage, the per-member rows and, for a root, its children.
 * No limit → limit/remaining/percentUsed/status null; a zero limit → 0 percent.
 */
public record CategorySpendingResponse(
        Long categoryId,
        @Nullable Long parentId,
        String name,
        TransactionType type,
        @Nullable Long ownerId,
        @Nullable String ownerName,
        @Nullable Boolean ownerActive,
        BigDecimal spent,
        @Nullable BigDecimal limit,
        @Nullable BigDecimal remaining,
        @Nullable BigDecimal percentUsed,
        @Nullable UsageStatus status,
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
            CategoryUsage usage,
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
                usage.limit(),
                usage.remaining(),
                usage.percentUsed(),
                usage.status(),
                List.copyOf(members),
                List.copyOf(children));
    }
}
