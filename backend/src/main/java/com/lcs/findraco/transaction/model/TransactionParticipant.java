package com.lcs.findraco.transaction.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "transaction_participants")
public class TransactionParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_user_id")
    private User member;

    @Column(name = "share_amount")
    private BigDecimal shareAmount;

    protected TransactionParticipant() {}

    TransactionParticipant(Transaction transaction, User member, BigDecimal shareAmount) {
        this.transaction = transaction;
        this.member = member;
        this.shareAmount = shareAmount;
    }

    void changeShare(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }

    public Long getId() {
        return id;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public User getMember() {
        return member;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }
}
