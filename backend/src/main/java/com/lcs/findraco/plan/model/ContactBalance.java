package com.lcs.findraco.plan.model;

import java.math.BigDecimal;

/** What a contact owes the plan or, when payments exceed what they owe, the credit they hold; one of the two is zero. */
public record ContactBalance(BigDecimal owed, BigDecimal credit) {

    public static final ContactBalance ZERO = new ContactBalance(new BigDecimal("0.00"), new BigDecimal("0.00"));

    /** The balance of {@code net} owed: positive is owed, negative is credit. */
    public static ContactBalance ofNet(BigDecimal net) {
        BigDecimal scaled = net.setScale(2);
        return scaled.signum() >= 0
                ? new ContactBalance(scaled, ZERO.credit())
                : new ContactBalance(ZERO.owed(), scaled.negate());
    }

    public boolean isSettled() {
        return owed.signum() == 0 && credit.signum() == 0;
    }
}
