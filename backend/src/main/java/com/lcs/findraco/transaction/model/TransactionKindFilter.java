package com.lcs.findraco.transaction.model;

/** The kind a list is narrowed to: one kind, or {@code NEUTRAL} for every row that has a kind. */
public enum TransactionKindFilter {
    NEUTRAL,
    TRANSFER,
    CARD_BILL_PAYMENT,
    SAVINGS,
    REFUND
}
