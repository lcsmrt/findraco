package com.lcs.findraco.plan.response;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One payment from the contact.
 *
 * @param unallocated the part of the payment that settled no share: the contact's credit.
 */
public record ContactStatementRepaymentResponse(
        Long transactionId, LocalDate date, BigDecimal amount, BigDecimal unallocated) {}
