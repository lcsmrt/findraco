package com.lcs.findraco.plan.model;

/** Where a contact's share stands, derived from the repayments that settled it and never stored. */
public enum ContactShareStatus {
    /** Its purchase is not actual yet (AD-025), so it is no debt and no repayment can settle it. */
    PLANNED,
    /** Actual and nothing settled. */
    OPEN,
    /** Actual and settled in part. */
    PARTIAL,
    /** Actual and settled in full. */
    PAID
}
