package com.lcs.findraco.category.response;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

public record CategoryResponse(
        Long id,
        TransactionType type,
        String description,
        BigDecimal spendingLimit,
        Long parentId,
        Long ownerId,
        String ownerName,
        Boolean ownerActive,
        List<CategoryMemberLimitResponse> memberLimits,
        BigDecimal effectiveLimit) {

    /**
     * The category as embedded in other responses (transactions, items): no membership data, so
     * {@code ownerActive}, {@code memberLimits} and {@code effectiveLimit} are null.
     */
    public static CategoryResponse from(Category category) {
        User owner = effectiveOwner(category);
        return new CategoryResponse(
                category.getId(),
                category.getType(),
                category.getDescription(),
                category.getSpendingLimit(),
                parentId(category),
                owner == null ? null : owner.getId(),
                owner == null ? null : owner.getName(),
                null,
                null,
                null);
    }

    /**
     * The full category (category endpoints). An entry whose member is not in {@code activeMemberIds}
     * is a former member's: kept and listed with {@code active=false}, but left out of the effective
     * limit (CAT-14). The effective limit is the sum of the active entries, or the plain limit when
     * there are none (CAT-11). A child shows its parent's owner (CAT-15); {@code ownerActive=false}
     * marks an owner who left the plan (CAT-14).
     */
    public static CategoryResponse from(Category category, Set<Long> activeMemberIds) {
        User owner = effectiveOwner(category);
        List<CategoryMemberLimitResponse> memberLimits = category.getMemberLimits().stream()
                .map(entry -> CategoryMemberLimitResponse.from(
                        entry, activeMemberIds.contains(entry.getMember().getId())))
                .sorted(Comparator.comparing(CategoryMemberLimitResponse::memberId))
                .toList();
        List<CategoryMemberLimitResponse> active = memberLimits.stream()
                .filter(CategoryMemberLimitResponse::active)
                .toList();
        BigDecimal effectiveLimit = active.isEmpty()
                ? category.getSpendingLimit()
                : active.stream().map(CategoryMemberLimitResponse::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CategoryResponse(
                category.getId(),
                category.getType(),
                category.getDescription(),
                category.getSpendingLimit(),
                parentId(category),
                owner == null ? null : owner.getId(),
                owner == null ? null : owner.getName(),
                owner == null ? null : activeMemberIds.contains(owner.getId()),
                memberLimits,
                effectiveLimit);
    }

    private static Long parentId(Category category) {
        return category.getParent() == null ? null : category.getParent().getId();
    }

    private static User effectiveOwner(Category category) {
        return category.getParent() == null
                ? category.getOwner()
                : category.getParent().getOwner();
    }
}
