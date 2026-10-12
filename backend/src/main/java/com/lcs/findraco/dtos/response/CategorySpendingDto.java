package com.lcs.findraco.dtos.response;

import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.User;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * One category row of the spending tree (Categories tab and Overview breakdown): the period's spend,
 * the monthly limit and its usage, the per-member rows and, for a root, its children.
 * Limit math matches {@link CategoryBreakdownDto}: no limit → remaining/percentUsed/overLimit null;
 * a zero limit → 0 percent.
 */
public class CategorySpendingDto {
    private final Long categoryId;
    private final Long parentId;
    private final String name;
    private final FinancialTransactionType type;
    private final Long ownerId;
    private final String ownerName;
    private final Boolean ownerActive;
    private final BigDecimal spent;
    private final BigDecimal limit;
    private final BigDecimal remaining;
    private final BigDecimal percentUsed;
    private final Boolean overLimit;
    private final List<Member> members;
    private final List<CategorySpendingDto> children;

    /**
     * @param ownerActive whether the owner (the parent's, for a child) is a current member of the plan;
     *                    null when the category has no owner. A former owner is shown as such (CAT-14).
     */
    public CategorySpendingDto(FinancialTransactionCategory category, Boolean ownerActive, BigDecimal spent,
                               BigDecimal limit, List<Member> members, List<CategorySpendingDto> children) {
        this.categoryId = category.getId();
        this.parentId = category.getParent() == null ? null : category.getParent().getId();
        this.name = category.getDescription();
        this.type = category.getType();
        User owner = category.getParent() == null ? category.getOwner() : category.getParent().getOwner();
        this.ownerId = owner == null ? null : owner.getId();
        this.ownerName = owner == null ? null : owner.getName();
        this.ownerActive = owner == null ? null : ownerActive;
        this.spent = spent;
        this.limit = limit;
        this.remaining = remaining(spent, limit);
        this.percentUsed = percentUsed(spent, limit);
        this.overLimit = overLimit(spent, limit);
        this.members = List.copyOf(members);
        this.children = List.copyOf(children);
    }

    /**
     * One member's spend inside a category, against that member's own limit. A former member's entry
     * ({@code active=false}) shows its stored amount but is not evaluated: remaining, percentUsed and
     * overLimit are null (CAT-14).
     */
    public static class Member {
        private final Long memberId;
        private final String name;
        private final BigDecimal spent;
        private final BigDecimal limit;
        private final BigDecimal remaining;
        private final BigDecimal percentUsed;
        private final Boolean overLimit;
        private final boolean active;

        public Member(Long memberId, String name, BigDecimal spent, BigDecimal limit, boolean active) {
            this.memberId = memberId;
            this.name = name;
            this.spent = spent;
            this.limit = limit;
            BigDecimal evaluated = active ? limit : null;
            this.remaining = remaining(spent, evaluated);
            this.percentUsed = percentUsed(spent, evaluated);
            this.overLimit = overLimit(spent, evaluated);
            this.active = active;
        }

        public Long getMemberId() { return memberId; }
        public String getName() { return name; }
        public BigDecimal getSpent() { return spent; }
        public BigDecimal getLimit() { return limit; }
        public BigDecimal getRemaining() { return remaining; }
        public BigDecimal getPercentUsed() { return percentUsed; }
        public Boolean getOverLimit() { return overLimit; }
        public boolean isActive() { return active; }
    }

    private static BigDecimal remaining(BigDecimal spent, BigDecimal limit) {
        return limit == null ? null : limit.subtract(spent);
    }

    private static BigDecimal percentUsed(BigDecimal spent, BigDecimal limit) {
        if (limit == null) {
            return null;
        }
        return limit.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : spent.multiply(BigDecimal.valueOf(100)).divide(limit, 2, RoundingMode.HALF_UP);
    }

    private static Boolean overLimit(BigDecimal spent, BigDecimal limit) {
        return limit == null ? null : spent.compareTo(limit) > 0;
    }

    public Long getCategoryId() { return categoryId; }
    public Long getParentId() { return parentId; }
    public String getName() { return name; }
    public FinancialTransactionType getType() { return type; }
    public Long getOwnerId() { return ownerId; }
    public String getOwnerName() { return ownerName; }
    public Boolean getOwnerActive() { return ownerActive; }
    public BigDecimal getSpent() { return spent; }
    public BigDecimal getLimit() { return limit; }
    public BigDecimal getRemaining() { return remaining; }
    public BigDecimal getPercentUsed() { return percentUsed; }
    public Boolean getOverLimit() { return overLimit; }
    public List<Member> getMembers() { return members; }
    public List<CategorySpendingDto> getChildren() { return children; }
}
