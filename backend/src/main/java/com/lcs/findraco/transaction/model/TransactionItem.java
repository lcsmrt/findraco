package com.lcs.findraco.transaction.model;

import com.lcs.findraco.category.model.Category;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "transaction_items")
public class TransactionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private String description;

    private BigDecimal amount;

    private Integer quantity = 1;

    protected TransactionItem() {}

    TransactionItem(Transaction transaction, ItemDraft draft) {
        this.transaction = transaction;
        this.category = draft.category();
        this.description = draft.description();
        this.amount = draft.amount();
        this.quantity = draft.quantity() != null ? draft.quantity() : 1;
    }

    public Long getId() {
        return id;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public Category getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Integer getQuantity() {
        return quantity;
    }
}
