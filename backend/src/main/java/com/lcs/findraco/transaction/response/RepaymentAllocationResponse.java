package com.lcs.findraco.transaction.response;

import java.math.BigDecimal;

/** The part of one contact share, on one purchase, that a repayment settles. */
public record RepaymentAllocationResponse(Long participantId, Long transactionId, BigDecimal amount) {}
