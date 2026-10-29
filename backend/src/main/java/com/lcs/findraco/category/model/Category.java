package com.lcs.findraco.category.model;

import com.lcs.findraco.category.exception.CategoryExceptions;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.jspecify.annotations.Nullable;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false, foreignKey = @ForeignKey(name = "fk_categories_plans"))
    private Plan plan;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private String description;
    private BigDecimal spendingLimit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_categories_parent"))
    private Category parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", foreignKey = @ForeignKey(name = "fk_categories_owner_user"))
    private User owner;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoryMemberLimit> memberLimits = new ArrayList<>();

    protected Category() {}

    /** A new category of the plan, a root or a subcategory of {@code parent}. */
    public static Category create(Plan plan, TransactionType type, String description, @Nullable Category parent) {
        Category category = new Category();
        category.plan = plan;
        category.type = type;
        category.description = description;
        category.moveUnder(parent);
        return category;
    }

    public void rename(String description) {
        this.description = description;
    }

    /** A category that transactions, items or series use keeps its type, or they would stop matching it. */
    public void changeType(TransactionType newType, boolean inUse) {
        if (newType == type) {
            return;
        }
        if (inUse) {
            throw new CategoryExceptions.CategoryTypeChangeInUseException(id);
        }
        type = newType;
    }

    /** Two levels at most: the parent is a root of the same type, never the category itself. */
    public void moveUnder(@Nullable Category newParent) {
        if (newParent != null) {
            if (id != null && id.equals(newParent.getId())) {
                throw new CategoryExceptions.CategoryParentIsItselfException();
            }
            if (newParent.getParent() != null) {
                throw new CategoryExceptions.CategoryParentIsChildException(newParent.getId());
            }
            if (newParent.getType() != type) {
                throw new CategoryExceptions.CategoryParentTypeMismatchException();
            }
        }
        parent = newParent;
    }

    /** Only a root has an owner of its own; a subcategory has its parent's. */
    public void assignOwner(@Nullable User newOwner) {
        if (newOwner != null && parent != null) {
            throw new CategoryExceptions.CategoryOwnerOnChildException();
        }
        owner = newOwner;
    }

    /**
     * Sets the plain limit and, unless {@code newMemberLimits} is null, replaces the per-member ones.
     * Per-member limits exist only on an expense category without an owner, and while they exist the
     * plain limit is cleared: the category's limit is then their sum. An income category has no limit.
     */
    public void changeLimits(@Nullable BigDecimal spendingLimit, @Nullable List<MemberLimit> newMemberLimits) {
        boolean perMember = newMemberLimits != null ? !newMemberLimits.isEmpty() : !memberLimits.isEmpty();
        if (newMemberLimits != null) {
            Set<Long> seen = new HashSet<>();
            for (MemberLimit limit : newMemberLimits) {
                if (!seen.add(limit.member().getId())) {
                    throw new CategoryExceptions.CategoryMemberLimitDuplicateMemberException(
                            limit.member().getId());
                }
            }
        }
        if (perMember && type == TransactionType.CREDIT) {
            throw new CategoryExceptions.CategoryMemberLimitsOnCreditException();
        }
        if (perMember && effectiveOwner() != null) {
            throw new CategoryExceptions.CategoryMemberLimitsOnOwnedException();
        }

        if (newMemberLimits != null) {
            replaceMemberLimits(newMemberLimits);
        }
        this.spendingLimit = perMember || type == TransactionType.CREDIT ? null : spendingLimit;
    }

    /** Updates kept entries in place, so the (category, member) unique key holds within one flush. */
    private void replaceMemberLimits(List<MemberLimit> newMemberLimits) {
        Map<Long, CategoryMemberLimit> stored = new HashMap<>();
        memberLimits.forEach(entry -> stored.put(entry.getMember().getId(), entry));
        Set<Long> kept = new HashSet<>();
        for (MemberLimit limit : newMemberLimits) {
            kept.add(limit.member().getId());
            CategoryMemberLimit existing = stored.get(limit.member().getId());
            if (existing != null) {
                existing.changeAmount(limit.amount());
            } else {
                memberLimits.add(new CategoryMemberLimit(this, limit.member(), limit.amount()));
            }
        }
        memberLimits.removeIf(entry -> !kept.contains(entry.getMember().getId()));
    }

    private @Nullable User effectiveOwner() {
        return parent == null ? owner : parent.getOwner();
    }

    public Long getId() {
        return id;
    }

    public Plan getPlan() {
        return plan;
    }

    public TransactionType getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getSpendingLimit() {
        return spendingLimit;
    }

    public Category getParent() {
        return parent;
    }

    public User getOwner() {
        return owner;
    }

    public List<CategoryMemberLimit> getMemberLimits() {
        return Collections.unmodifiableList(memberLimits);
    }
}
