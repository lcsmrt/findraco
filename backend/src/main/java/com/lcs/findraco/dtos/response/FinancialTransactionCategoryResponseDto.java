package com.lcs.findraco.dtos.response;

import com.lcs.findraco.models.CategoryMemberLimit;
import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

public class FinancialTransactionCategoryResponseDto {
    private final Long id;
    private final FinancialTransactionType type;
    private final String description;
    private final BigDecimal spendingLimit;
    private final Long parentId;
    private final Long ownerId;
    private final String ownerName;
    private final Boolean ownerActive;
    private final List<MemberLimit> memberLimits;
    private final BigDecimal effectiveLimit;

    /**
     * The category as embedded in other responses (transactions, items): no membership data, so
     * {@code ownerActive}, {@code memberLimits} and {@code effectiveLimit} are null.
     */
    public FinancialTransactionCategoryResponseDto(FinancialTransactionCategory category) {
        this.id = category.getId();
        this.type = category.getType();
        this.description = category.getDescription();
        this.spendingLimit = category.getSpendingLimit();
        this.parentId =
                category.getParent() == null ? null : category.getParent().getId();
        User owner = effectiveOwner(category);
        this.ownerId = owner == null ? null : owner.getId();
        this.ownerName = owner == null ? null : owner.getName();
        this.ownerActive = null;
        this.memberLimits = null;
        this.effectiveLimit = null;
    }

    /**
     * The full category (category endpoints). An entry whose member is not in {@code activeMemberIds}
     * is a former member's: kept and listed with {@code active=false}, but left out of the effective
     * limit (CAT-14). The effective limit is the sum of the active entries, or the plain limit when
     * there are none (CAT-11). A child shows its parent's owner (CAT-15); {@code ownerActive=false}
     * marks an owner who left the plan (CAT-14).
     */
    public FinancialTransactionCategoryResponseDto(FinancialTransactionCategory category, Set<Long> activeMemberIds) {
        this.id = category.getId();
        this.type = category.getType();
        this.description = category.getDescription();
        this.spendingLimit = category.getSpendingLimit();
        this.parentId =
                category.getParent() == null ? null : category.getParent().getId();
        User owner = effectiveOwner(category);
        this.ownerId = owner == null ? null : owner.getId();
        this.ownerName = owner == null ? null : owner.getName();
        this.ownerActive = owner == null ? null : activeMemberIds.contains(owner.getId());
        this.memberLimits = category.getMemberLimits().stream()
                .map(entry -> new MemberLimit(
                        entry, activeMemberIds.contains(entry.getMember().getId())))
                .sorted(Comparator.comparing(MemberLimit::getMemberId))
                .toList();
        List<MemberLimit> active =
                memberLimits.stream().filter(MemberLimit::isActive).toList();
        this.effectiveLimit = active.isEmpty()
                ? category.getSpendingLimit()
                : active.stream().map(MemberLimit::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static User effectiveOwner(FinancialTransactionCategory category) {
        return category.getParent() == null
                ? category.getOwner()
                : category.getParent().getOwner();
    }

    /** One member's monthly limit inside the category; {@code active=false} for a former member. */
    public static class MemberLimit {
        private final Long memberId;
        private final String memberName;
        private final BigDecimal amount;
        private final boolean active;

        public MemberLimit(CategoryMemberLimit entry, boolean active) {
            this.memberId = entry.getMember().getId();
            this.memberName = entry.getMember().getName();
            this.amount = entry.getAmount();
            this.active = active;
        }

        public Long getMemberId() {
            return memberId;
        }

        public String getMemberName() {
            return memberName;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public boolean isActive() {
            return active;
        }
    }

    public Long getId() {
        return id;
    }

    public FinancialTransactionType getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getSpendingLimit() {
        return spendingLimit;
    }

    public Long getParentId() {
        return parentId;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public Boolean getOwnerActive() {
        return ownerActive;
    }

    public List<MemberLimit> getMemberLimits() {
        return memberLimits;
    }

    public BigDecimal getEffectiveLimit() {
        return effectiveLimit;
    }
}
