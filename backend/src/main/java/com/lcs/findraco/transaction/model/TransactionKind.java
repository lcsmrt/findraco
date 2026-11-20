package com.lcs.findraco.transaction.model;

/**
 * What a row is besides income or expense. A neutral kind moves money between places and counts in no total; a
 * refund is a credit that gives spending back to the category it pays for.
 */
public enum TransactionKind {
    TRANSFER,
    CARD_BILL_PAYMENT,
    SAVINGS,
    REFUND;

    public boolean isNeutral() {
        return this != REFUND;
    }
}
