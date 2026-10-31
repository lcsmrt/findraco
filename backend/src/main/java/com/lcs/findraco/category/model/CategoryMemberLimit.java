package com.lcs.findraco.category.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "category_member_limits")
public class CategoryMemberLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_user_id")
    private User member;

    private BigDecimal amount;

    protected CategoryMemberLimit() {}

    CategoryMemberLimit(Category category, User member, BigDecimal amount) {
        this.category = category;
        this.member = member;
        this.amount = amount;
    }

    void changeAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public Category getCategory() {
        return category;
    }

    public User getMember() {
        return member;
    }

    public BigDecimal getAmount() {
        return amount;
    }
}
