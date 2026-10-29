package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.TransactionParticipant;
import java.math.BigDecimal;

public record TransactionParticipantResponse(Long id, String name, BigDecimal shareAmount) {

    public static TransactionParticipantResponse from(TransactionParticipant participant) {
        return new TransactionParticipantResponse(
                participant.getMember().getId(), participant.getMember().getName(), participant.getShareAmount());
    }
}
