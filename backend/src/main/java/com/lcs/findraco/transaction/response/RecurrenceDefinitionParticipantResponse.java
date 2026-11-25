package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.RecurrenceDefinitionParticipant;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/** A share of a series, going to a member ({@code memberId}) or to a contact ({@code contactId}). */
public record RecurrenceDefinitionParticipantResponse(
        @Nullable Long memberId,
        @Nullable Long contactId,
        @Nullable String contactName,
        BigDecimal shareAmount) {

    public static RecurrenceDefinitionParticipantResponse from(RecurrenceDefinitionParticipant participant) {
        if (participant.getContact() != null) {
            return new RecurrenceDefinitionParticipantResponse(
                    null,
                    participant.getContact().getId(),
                    participant.getContact().getName(),
                    participant.getShareAmount());
        }
        return new RecurrenceDefinitionParticipantResponse(
                participant.getMember().getId(), null, null, participant.getShareAmount());
    }
}
