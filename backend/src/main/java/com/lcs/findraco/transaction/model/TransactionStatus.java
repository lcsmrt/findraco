package com.lcs.findraco.transaction.model;

/** Where a transaction stands for a reader on a given day. Derived, never stored. */
public enum TransactionStatus {
    ACTUAL,
    FORECAST,
    PENDING
}
