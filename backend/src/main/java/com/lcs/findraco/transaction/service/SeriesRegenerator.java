package com.lcs.findraco.transaction.service;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * Pure, dependency-free (besides a {@link Clock}) reconciliation of a series' occurrences against
 * its (already updated) {@link RecurrenceDefinition} template. Given the definition's post-edit
 * field values, the series' existing occurrence rows, resolved participant shares, an edit scope
 * and a pivot date, computes which occurrences must be updated in place, created, or deleted —
 * with position-derived installment {@code k/N} relabeling.
 *
 * <p>Contains zero Spring/JPA dependencies (only a {@link Clock}, plain JDK) so it can be exercised
 * with plain JUnit, no DB, no context.
 */
@Component
public class SeriesRegenerator {

    private static final int MAX_OCCURRENCES = 120;

    /**
     * Rolling look-ahead horizon (in months) applied when a RECURRING definition's {@code endDate}
     * is {@code null} (open-ended series, P3 re-opened via {@code editSeries}). Mirrors {@code
     * RecurringTransactionGenerator.OPEN_ENDED_HORIZON_MONTHS} / {@code
     * OpenEndedSeriesTopUpService.HORIZON_MONTHS}.
     */
    private static final int OPEN_ENDED_HORIZON_MONTHS = 12;

    private final Clock clock;

    public SeriesRegenerator(Clock clock) {
        this.clock = clock;
    }

    public record SeriesEditResult(
            List<Transaction> toUpdate, List<Transaction> toCreate, List<Transaction> toDelete) {}

    /** A single target slot computed from the (post-edit) recurrence definition template. */
    private record TargetOccurrence(LocalDate date, String description, Integer parcelsNumber) {}

    public SeriesEditResult reconcile(
            RecurrenceDefinition def,
            List<Transaction> existing,
            List<Share> shares,
            SeriesEditScope scope,
            LocalDate pivotDate) {
        List<TargetOccurrence> fullTargets = buildFullTargetList(def);
        ensureWithinCap(fullTargets.size());

        boolean filterByPivot = scope != SeriesEditScope.ALL;

        List<TargetOccurrence> inScopeTargets = fullTargets.stream()
                .filter(t -> !filterByPivot || !t.date().isBefore(pivotDate))
                .filter(t -> !def.getExceptions().contains(t.date()))
                .toList();

        // Occurrences are matched to their slot by date, never by position: a date the member deleted
        // stays a gap instead of being refilled by the next occurrence shifting into it.
        Map<LocalDate, Transaction> existingByDate = new LinkedHashMap<>();
        List<Transaction> toUpdate = new ArrayList<>();
        List<Transaction> toCreate = new ArrayList<>();
        List<Transaction> toDelete = new ArrayList<>();

        existing.stream()
                .filter(tx -> !filterByPivot || !tx.getStartDate().isBefore(pivotDate))
                .sorted(Comparator.comparing(Transaction::getStartDate))
                .forEach(tx -> {
                    if (existingByDate.putIfAbsent(tx.getStartDate(), tx) != null) {
                        toDelete.add(tx);
                    }
                });

        for (TargetOccurrence target : inScopeTargets) {
            Transaction tx = existingByDate.remove(target.date());
            if (tx != null) {
                stampOccurrence(tx, target, def, shares);
                toUpdate.add(tx);
            } else {
                toCreate.add(buildNewOccurrence(target, def, shares));
            }
        }
        toDelete.addAll(existingByDate.values());

        return new SeriesEditResult(toUpdate, toCreate, toDelete);
    }

    private List<TargetOccurrence> buildFullTargetList(RecurrenceDefinition def) {
        return def.getMode() == RecurrenceMode.INSTALLMENT ? buildInstallmentTargets(def) : buildRecurringTargets(def);
    }

    private List<TargetOccurrence> buildInstallmentTargets(RecurrenceDefinition def) {
        int total = def.getParcelsNumber();
        int first = def.getFirstParcel();
        List<TargetOccurrence> targets = new ArrayList<>(Math.max(0, total - first + 1));
        for (int parcel = first; parcel <= total; parcel++) {
            LocalDate date = def.getStartDate().plusMonths(parcel - first);
            String description = def.getDescription() + " (" + parcel + "/" + total + ")";
            targets.add(new TargetOccurrence(date, description, total));
        }
        return targets;
    }

    private List<TargetOccurrence> buildRecurringTargets(RecurrenceDefinition def) {
        // A null endDate means the (re-)opened series is open-ended (P3, full-replace semantics):
        // regenerate out to the rolling horizon, exactly as create-time generation would.
        LocalDate effectiveEnd = def.getEndDate() != null
                ? def.getEndDate()
                : LocalDate.now(clock).plusMonths(OPEN_ENDED_HORIZON_MONTHS);

        List<TargetOccurrence> targets = new ArrayList<>();
        // Each date is counted from the start, so a day clamped in a short month does not carry over.
        for (int month = 0; !def.getStartDate().plusMonths(month).isAfter(effectiveEnd); month++) {
            targets.add(new TargetOccurrence(def.getStartDate().plusMonths(month), def.getDescription(), null));
        }
        return targets;
    }

    private void stampOccurrence(Transaction tx, TargetOccurrence slot, RecurrenceDefinition def, List<Share> shares) {
        tx.edit(
                new TransactionDetails(
                        def.getCategory(),
                        tx.getType(),
                        def.getAmount(),
                        slot.description(),
                        slot.date(),
                        tx.getEndDate(),
                        slot.parcelsNumber()),
                def.getSplitMode(),
                shares);
    }

    private Transaction buildNewOccurrence(TargetOccurrence slot, RecurrenceDefinition def, List<Share> shares) {
        TransactionDetails details = new TransactionDetails(
                def.getCategory(),
                def.getType(),
                def.getAmount(),
                slot.description(),
                slot.date(),
                null,
                slot.parcelsNumber());
        return Transaction.create(new TransactionDraft(
                def.getPlan(), def.getCreatedBy(), details, def.getSplitMode(), shares, List.of(), null, def));
    }

    private void ensureWithinCap(int count) {
        if (count > MAX_OCCURRENCES) {
            throw new TransactionExceptions.SeriesTooManyOccurrencesException(MAX_OCCURRENCES);
        }
    }
}
