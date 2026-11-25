package com.lcs.findraco.transaction.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * How much of one contact share a repayment settles. A repayment pays more than it allocates when the contact is in
 * credit; that excess has no row. The allocations of a share stay within the share by a service rule, held under a
 * lock on the contact (see {@code RepaymentAllocationService}); the database removes a row with its repayment or
 * its share.
 */
@Entity
@Table(name = "repayment_allocations")
public class RepaymentAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "repayment_id")
    private Transaction repayment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id")
    private TransactionParticipant participant;

    private BigDecimal amount;

    protected RepaymentAllocation() {}

    public RepaymentAllocation(Transaction repayment, TransactionParticipant participant, BigDecimal amount) {
        this.repayment = repayment;
        this.participant = participant;
        this.amount = amount;
    }

    /** Settles less of the share than before; the new amount is positive and below the current one. */
    public void cutBackTo(BigDecimal smaller) {
        amount = smaller;
    }

    public Long getId() {
        return id;
    }

    public Transaction getRepayment() {
        return repayment;
    }

    public TransactionParticipant getParticipant() {
        return participant;
    }

    public BigDecimal getAmount() {
        return amount;
    }
}
