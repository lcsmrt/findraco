package com.lcs.findraco.transaction.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * One member taking part in a transaction.
 *
 * @param shareAmount only used when the transaction's splitMode is EXACT.
 */
public record TransactionParticipantRequest(
        @NotNull(message = "Participant member id cannot be null.")
        Long memberId,

        BigDecimal shareAmount) {}
