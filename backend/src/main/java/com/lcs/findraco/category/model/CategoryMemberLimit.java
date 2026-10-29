package com.lcs.findraco.category.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
        name = "category_member_limits",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_cml_category_member",
                        columnNames = {"category_id", "member_user_id"}))
public class CategoryMemberLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false, foreignKey = @ForeignKey(name = "fk_cml_category"))
    private FinancialTransactionCategory category;

    @ManyToOne(optional = false)
    @JoinColumn(name = "member_user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_cml_member"))
    private User member;

    @Column(nullable = false)
    private BigDecimal amount;

    public CategoryMemberLimit() {}

    public Long getId() {
        return id;
    }

    public FinancialTransactionCategory getCategory() {
        return category;
    }

    public void setCategory(FinancialTransactionCategory category) {
        this.category = category;
    }

    public User getMember() {
        return member;
    }

    public void setMember(User member) {
        this.member = member;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
