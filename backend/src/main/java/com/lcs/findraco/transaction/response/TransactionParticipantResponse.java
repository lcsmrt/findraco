package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.TransactionParticipant;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/**
 * A share of a transaction. It goes to a member ({@code id}, the member's user id) or to a contact ({@code contactId}
 * and {@code contactName}); {@code name} is the name to show in either case.
 */
public record TransactionParticipantResponse(
        @Nullable Long id,
        String name,
        BigDecimal shareAmount,
        @Nullable Long contactId,
        @Nullable String contactName) {

    public static TransactionParticipantResponse from(TransactionParticipant participant) {
        if (participant.getContact() != null) {
            return new TransactionParticipantResponse(
                    null,
                    participant.getContact().getName(),
                    participant.getShareAmount(),
                    participant.getContact().getId(),
                    participant.getContact().getName());
        }
        return new TransactionParticipantResponse(
                participant.getMember().getId(),
                participant.getMember().getName(),
                participant.getShareAmount(),
                null,
                null);
    }
}
