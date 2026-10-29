package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceInterval;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record RecurrenceDefinitionResponse(
        Long id,
        String seriesId,
        TransactionType type,
        BigDecimal amount,
        String description,
        Long categoryId,
        RecurrenceMode mode,
        RecurrenceInterval interval,
        Integer parcelsNumber,
        Integer firstParcel,
        LocalDate startDate,
        LocalDate endDate,
        SplitMode splitMode,
        List<RecurrenceDefinitionParticipantResponse> participants) {

    public static RecurrenceDefinitionResponse from(RecurrenceDefinition def) {
        return new RecurrenceDefinitionResponse(
                def.getId(),
                def.getSeriesId(),
                def.getType(),
                def.getAmount(),
                def.getDescription(),
                def.getCategory() != null ? def.getCategory().getId() : null,
                def.getMode(),
                def.getRecurrenceInterval(),
                def.getParcelsNumber(),
                def.getFirstParcel(),
                def.getStartDate(),
                def.getEndDate(),
                def.getSplitMode(),
                def.getParticipants().stream()
                        .map(RecurrenceDefinitionParticipantResponse::from)
                        .toList());
    }
}
