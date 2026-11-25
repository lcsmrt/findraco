package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.ContactShareStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One share of the contact on a purchase. {@code participantId} is the id an allocation names it by.
 *
 * @param allocated what live repayments settled of the share.
 */
public record ContactStatementShareResponse(
        Long participantId,
        Long transactionId,
        LocalDate date,
        String description,
        BigDecimal share,
        BigDecimal allocated,
        ContactShareStatus status) {}
