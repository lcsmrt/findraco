package com.lcs.findraco.transaction.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

/**
 * How much of one contact share a repayment settles.
 *
 * @param participantId the id of the share, as the participant of the purchase carries it.
 */
public record RepaymentAllocationRequest(
        @NotNull(message = "Participant cannot be null.") Long participantId,

        @NotNull(message = "Amount cannot be null.")
        @Positive(message = "Amount must be positive.")
        @Digits(integer = 13, fraction = 2, message = "Amount must have at most 2 decimal places.")
        BigDecimal amount) {}
