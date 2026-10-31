package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.RecurrenceDefinitionParticipant;
import java.math.BigDecimal;

public record RecurrenceDefinitionParticipantResponse(Long memberId, BigDecimal shareAmount) {

    public static RecurrenceDefinitionParticipantResponse from(RecurrenceDefinitionParticipant participant) {
        return new RecurrenceDefinitionParticipantResponse(
                participant.getMember().getId(), participant.getShareAmount());
    }
}
