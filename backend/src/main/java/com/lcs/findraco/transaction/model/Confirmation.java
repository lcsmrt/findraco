package com.lcs.findraco.transaction.model;

/** How a transaction becomes actual: on its date, once a member confirms it, or already confirmed. */
public enum Confirmation {
    BY_DATE,
    REQUIRED,
    CONFIRMED
}
