package com.lcs.findraco.transaction.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
        name = "transaction_participants",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_txn_participants_txn_member",
                        columnNames = {"transaction_id", "member_user_id"}))
public class TransactionParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "transaction_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_txn_participants_transaction"))
    private Transaction transaction;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "member_user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_txn_participants_member"))
    private User member;

    @Column(name = "share_amount", nullable = false)
    private BigDecimal shareAmount;

    public TransactionParticipant() {}

    public Long getId() {
        return id;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public User getMember() {
        return member;
    }

    public void setMember(User member) {
        this.member = member;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }
}
