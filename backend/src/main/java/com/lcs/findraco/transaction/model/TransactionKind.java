package com.lcs.findraco.transaction.model;

/**
 * What a row is besides income or expense. A neutral kind moves money between places and counts in no total; a
 * refund is a credit that gives spending back to the category it pays for. A repayment is what a contact paid back of
 * the shares plan members covered for them: money in that is no income, so it counts in no total either.
 */
public enum TransactionKind {
    TRANSFER,
    CARD_BILL_PAYMENT,
    SAVINGS,
    REFUND,
    REPAYMENT;

    public boolean isNeutral() {
        return this != REFUND;
    }
}
