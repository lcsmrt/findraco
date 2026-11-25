package com.lcs.findraco.transaction.request;

import jakarta.validation.constraints.Digits;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/**
 * One member or contact taking part in a transaction.
 *
 * @param memberId a member of the plan; exactly one of {@code memberId} and {@code contactId} is sent.
 * @param contactId a contact of the plan; only an expense takes one.
 * @param shareAmount only used when the transaction's splitMode is EXACT.
 */
public record TransactionParticipantRequest(
        @Nullable Long memberId,
        @Nullable Long contactId,

        @Digits(integer = 13, fraction = 2, message = "Share amount must have at most 2 decimal places.")
        BigDecimal shareAmount) {

    /** A member's participation. */
    public TransactionParticipantRequest(Long memberId, BigDecimal shareAmount) {
        this(memberId, null, shareAmount);
    }
}
