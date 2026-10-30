package com.lcs.findraco.transaction.service;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.request.CreateSeriesRequest;
import java.math.BigDecimal;
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

    /** The occurrences of a new series, unsaved; {@code definition} carries the plan, creator, category and split. */
    public List<Transaction> generate(CreateSeriesRequest dto, RecurrenceDefinition definition, List<Share> shares) {
        return switch (dto.mode()) {
            case INSTALLMENT -> generateInstallments(dto, definition, shares);
            case RECURRING -> generateRecurring(dto, definition, shares);
        };
    }

    private List<Transaction> generateInstallments(
            CreateSeriesRequest dto, RecurrenceDefinition definition, List<Share> shares) {
        int total = dto.parcelsNumber();
        int first = dto.currentParcel() != null ? dto.currentParcel() : 1;
        ensureWithinCap(total - first + 1);

        List<Transaction> occurrences = new ArrayList<>(total - first + 1);
        for (int parcel = first; parcel <= total; parcel++) {
            occurrences.add(occurrence(
                    definition,
                    dto.amount(),
                    dto.description() + " (" + parcel + "/" + total + ")",
                    dto.startDate().plusMonths(parcel - first),
                    total,
                    shares));
        }
        return occurrences;
    }

    private List<Transaction> generateRecurring(
            CreateSeriesRequest dto, RecurrenceDefinition definition, List<Share> shares) {
        LocalDate effectiveEnd =
                dto.endDate() != null ? dto.endDate() : LocalDate.now(clock).plusMonths(OPEN_ENDED_HORIZON_MONTHS);

        List<Transaction> occurrences = new ArrayList<>();
        // Each date is counted from the start, so a day clamped in a short month does not carry over.
        for (int month = 0; !dto.startDate().plusMonths(month).isAfter(effectiveEnd); month++) {
            ensureWithinCap(occurrences.size() + 1);
            occurrences.add(occurrence(
                    definition, dto.amount(), dto.description(), dto.startDate().plusMonths(month), null, shares));
        }
        return occurrences;
    }

    /**
     * Definition-driven forward-window generator used by rolling top-up (open-ended RECURRING series):
     * given an already-persisted {@link RecurrenceDefinition}, generates the unsaved occurrences for the
     * months strictly after {@code afterExclusive} (the current {@code generatedThrough} watermark) up
     * through {@code throughInclusive} (the rolling horizon), skipping the series' excepted dates and honoring {@link #MAX_OCCURRENCES} per pass.
     */
    public List<Transaction> generateForwardWindow(
            RecurrenceDefinition def, LocalDate afterExclusive, LocalDate throughInclusive, List<Share> shares) {
        List<Transaction> occurrences = new ArrayList<>();
        for (int month = 0; !def.getStartDate().plusMonths(month).isAfter(throughInclusive); month++) {
            LocalDate date = def.getStartDate().plusMonths(month);
            if (!date.isAfter(afterExclusive) || def.getExceptions().contains(date)) {
                continue;
            }
            ensureWithinCap(occurrences.size() + 1);
            occurrences.add(occurrence(def, def.getAmount(), def.getDescription(), date, null, shares));
        }
        return occurrences;
    }

    private static Transaction occurrence(
            RecurrenceDefinition definition,
            BigDecimal amount,
            String description,
            LocalDate date,
            Integer parcelsNumber,
            List<Share> shares) {
        TransactionDetails details = new TransactionDetails(
                definition.getCategory(), definition.getType(), amount, description, date, null, parcelsNumber);
        return Transaction.create(new TransactionDraft(
                definition.getPlan(),
                definition.getCreatedBy(),
                details,
                definition.getSplitMode(),
                shares,
                List.of(),
                null,
                definition));
    }

    private void ensureWithinCap(int count) {
        if (count > MAX_OCCURRENCES) {
            throw new TransactionExceptions.SeriesTooManyOccurrencesException(MAX_OCCURRENCES);
        }
    }
}
