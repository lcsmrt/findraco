package com.lcs.findraco.category.model;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.FinancialTransactionType;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "financial_transaction_categories")
public class FinancialTransactionCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "plan_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ftc_plan"))
    private Plan plan;

    @Enumerated(EnumType.STRING)
    private FinancialTransactionType type;

    private String description;
    private BigDecimal spendingLimit;

    @ManyToOne
    @JoinColumn(name = "parent_id", foreignKey = @ForeignKey(name = "fk_ftc_parent"))
    private FinancialTransactionCategory parent;

    @ManyToOne
    @JoinColumn(name = "owner_user_id", foreignKey = @ForeignKey(name = "fk_ftc_owner"))
    private User owner;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CategoryMemberLimit> memberLimits = new ArrayList<>();

    public FinancialTransactionCategory() {}

    public Long getId() {
        return id;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public FinancialTransactionType getType() {
        return type;
    }

    public void setType(FinancialTransactionType type) {
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

    public FinancialTransactionCategory getParent() {
        return parent;
    }

    public void setParent(FinancialTransactionCategory parent) {
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
