package com.lcs.findraco.transaction.service;

import com.lcs.findraco.category.model.FinancialTransactionCategory;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.FinancialTransaction;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.lcs.findraco.transaction.request.FinancialTransactionSeriesRequestDto;
import com.lcs.findraco.user.model.User;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class RecurringTransactionGenerator {

    private static final int MAX_OCCURRENCES = 120;

    /** Rolling look-ahead horizon (in months) applied to open-ended (null endDate) RECURRING series. */
    private static final int OPEN_ENDED_HORIZON_MONTHS = 12;

    private final Clock clock;

    public RecurringTransactionGenerator(Clock clock) {
        this.clock = clock;
    }

    public List<FinancialTransaction> generate(
            FinancialTransactionSeriesRequestDto dto,
            Plan plan,
            User createdBy,
            FinancialTransactionCategory category,
            String seriesId,
            SplitMode splitMode,
            List<ResolvedParticipant> participantShares) {
        return switch (dto.getMode()) {
            case INSTALLMENT ->
                generateInstallments(dto, plan, createdBy, category, seriesId, splitMode, participantShares);
            case RECURRING -> generateRecurring(dto, plan, createdBy, category, seriesId, splitMode, participantShares);
        };
    }

    private List<FinancialTransaction> generateInstallments(
            FinancialTransactionSeriesRequestDto dto,
            Plan plan,
            User createdBy,
            FinancialTransactionCategory category,
            String seriesId,
            SplitMode splitMode,
            List<ResolvedParticipant> participantShares) {
        int total = dto.getParcelsNumber();
        int first = dto.getCurrentParcel() != null ? dto.getCurrentParcel() : 1;
        ensureWithinCap(total - first + 1);

        List<FinancialTransaction> occurrences = new ArrayList<>(total - first + 1);
        for (int parcel = first; parcel <= total; parcel++) {
            FinancialTransaction transaction = baseTransaction(
                    dto,
                    plan,
                    createdBy,
                    category,
                    seriesId,
                    dto.getStartDate().plusMonths(parcel - first),
                    splitMode,
                    participantShares);
            transaction.setDescription(dto.getDescription() + " (" + parcel + "/" + total + ")");
            transaction.setParcelsNumber(total);
            occurrences.add(transaction);
        }
        return occurrences;
    }

    private List<FinancialTransaction> generateRecurring(
            FinancialTransactionSeriesRequestDto dto,
            Plan plan,
            User createdBy,
            FinancialTransactionCategory category,
            String seriesId,
            SplitMode splitMode,
            List<ResolvedParticipant> participantShares) {
        LocalDate effectiveEnd = dto.getEndDate() != null
                ? dto.getEndDate()
                : LocalDate.now(clock).plusMonths(OPEN_ENDED_HORIZON_MONTHS);

        List<FinancialTransaction> occurrences = new ArrayList<>();
        // Each date is counted from the start, so a day clamped in a short month does not carry over.
        for (int month = 0; !dto.getStartDate().plusMonths(month).isAfter(effectiveEnd); month++) {
            LocalDate date = dto.getStartDate().plusMonths(month);
            ensureWithinCap(occurrences.size() + 1);

            FinancialTransaction transaction =
                    baseTransaction(dto, plan, createdBy, category, seriesId, date, splitMode, participantShares);
            transaction.setDescription(dto.getDescription());
            transaction.setParcelsNumber(null);
            occurrences.add(transaction);
        }
        return occurrences;
    }

    /**
     * Definition-driven forward-window generator used by rolling top-up (open-ended RECURRING series):
     * given an already-persisted {@link RecurrenceDefinition}, generates the unsaved occurrences for the
     * months strictly after {@code afterExclusive} (the current {@code generatedThrough} watermark) up
     * through {@code throughInclusive} (the rolling horizon), honoring {@link #MAX_OCCURRENCES} per pass.
     */
    public List<FinancialTransaction> generateForwardWindow(
            RecurrenceDefinition def,
            LocalDate afterExclusive,
            LocalDate throughInclusive,
            List<ResolvedParticipant> participantShares) {
        List<FinancialTransaction> occurrences = new ArrayList<>();
        for (int month = 0; !def.getStartDate().plusMonths(month).isAfter(throughInclusive); month++) {
            LocalDate date = def.getStartDate().plusMonths(month);
            if (!date.isAfter(afterExclusive)) {
                continue;
            }
            ensureWithinCap(occurrences.size() + 1);
            occurrences.add(baseTransactionFromDefinition(def, date, participantShares));
        }
        return occurrences;
    }

    private FinancialTransaction baseTransaction(
            FinancialTransactionSeriesRequestDto dto,
            Plan plan,
            User createdBy,
            FinancialTransactionCategory category,
            String seriesId,
            LocalDate date,
            SplitMode splitMode,
            List<ResolvedParticipant> participantShares) {
        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setPlan(plan);
        transaction.setCreatedBy(createdBy);
        transaction.setCategory(category);
        transaction.setType(dto.getType());
        transaction.setAmount(dto.getAmount());
        transaction.setStartDate(date);
        transaction.setEndDate(null);
        transaction.setSeriesId(seriesId);
        transaction.setSplitMode(splitMode);
        for (ResolvedParticipant share : participantShares) {
            TransactionParticipant participant = new TransactionParticipant();
            participant.setTransaction(transaction);
            participant.setMember(share.member());
            participant.setShareAmount(share.shareAmount());
            transaction.getParticipants().add(participant);
        }
        return transaction;
    }

    private FinancialTransaction baseTransactionFromDefinition(
            RecurrenceDefinition def, LocalDate date, List<ResolvedParticipant> participantShares) {
        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setPlan(def.getPlan());
        transaction.setCreatedBy(def.getCreatedBy());
        transaction.setCategory(def.getCategory());
        transaction.setType(def.getType());
        transaction.setAmount(def.getAmount());
        transaction.setDescription(def.getDescription());
        transaction.setStartDate(date);
        transaction.setEndDate(null);
        transaction.setSeriesId(def.getSeriesId());
        transaction.setSplitMode(def.getSplitMode());
        transaction.setParcelsNumber(null);
        transaction.setRecurrenceDefinition(def);
        for (ResolvedParticipant share : participantShares) {
            TransactionParticipant participant = new TransactionParticipant();
            participant.setTransaction(transaction);
            participant.setMember(share.member());
            participant.setShareAmount(share.shareAmount());
            transaction.getParticipants().add(participant);
        }
        return transaction;
    }

    private void ensureWithinCap(int count) {
        if (count > MAX_OCCURRENCES) {
            throw new IllegalArgumentException(
                    "Series would generate too many occurrences (max " + MAX_OCCURRENCES + ").");
        }
    }
}
