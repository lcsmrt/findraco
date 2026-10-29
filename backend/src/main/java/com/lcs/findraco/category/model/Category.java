package com.lcs.findraco.category.model;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "plan_id", nullable = false, foreignKey = @ForeignKey(name = "fk_categories_plans"))
    private Plan plan;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private String description;
    private BigDecimal spendingLimit;

    @ManyToOne
    @JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_categories_parent"))
    private Category parent;

    @ManyToOne
    @JoinColumn(name = "owner_user_id", foreignKey = @ForeignKey(name = "fk_categories_owner_user"))
    private User owner;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoryMemberLimit> memberLimits = new ArrayList<>();

    public Category() {}

    public Long getId() {
        return id;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getSpendingLimit() {
        return spendingLimit;
    }

    public void setSpendingLimit(BigDecimal spendingLimit) {
        this.spendingLimit = spendingLimit;
    }

    public Category getParent() {
        return parent;
    }

    public void setParent(Category parent) {
        this.parent = parent;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<CategoryMemberLimit> getMemberLimits() {
        return memberLimits;
    }
}
