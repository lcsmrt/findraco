package com.lcs.findraco.transaction.service;

import com.lcs.findraco.transaction.config.SeriesProperties;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.Confirmation;
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
import java.util.Set;
import java.util.stream.Collectors;
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

    private final Clock clock;
    private final SeriesProperties series;

    public SeriesRegenerator(Clock clock, SeriesProperties series) {
        this.clock = clock;
        this.series = series;
    }

    public record SeriesEditResult(
            List<Transaction> toUpdate, List<Transaction> toCreate, List<Transaction> toDelete) {}

    /** A single target slot computed from the (post-edit) recurrence definition template. */
    private record TargetOccurrence(LocalDate date, String description, Integer parcelsNumber) {}

    /**
     * Occurrences are matched to targets by their series slot ({@link Transaction#getScheduledDate()}), never by
     * their current date, which a confirmation may have moved. {@code pivotSlot} is the pivot's slot.
     */
    public SeriesEditResult reconcile(
            RecurrenceDefinition def,
            List<Transaction> existing,
            List<Share> shares,
            SeriesEditScope scope,
            LocalDate pivotSlot) {
        List<TargetOccurrence> fullTargets = buildFullTargetList(def);
        ensureWithinCap(fullTargets.size());

        boolean filterByPivot = scope != SeriesEditScope.ALL;

        // A confirmed occurrence is a record of what happened, so an edit leaves it alone: it is neither
        // updated nor deleted, and its slot is not refilled. Only the pivot takes the form's values.
        List<Transaction> frozen = existing.stream()
                .filter(tx -> tx.getConfirmation() == Confirmation.CONFIRMED)
                .filter(tx -> !(filterByPivot && tx.getScheduledDate().equals(pivotSlot)))
                .toList();
        Set<LocalDate> frozenSlots =
                frozen.stream().map(Transaction::getScheduledDate).collect(Collectors.toSet());

        List<TargetOccurrence> inScopeTargets = fullTargets.stream()
                .filter(t -> !filterByPivot || !t.date().isBefore(pivotSlot))
                .filter(t -> !def.getExceptions().contains(t.date()))
                .filter(t -> !frozenSlots.contains(t.date()))
                .toList();

        // Matched by slot, never by position: a slot the member deleted stays a gap instead of being
        // refilled by the next occurrence shifting into it.
        Map<LocalDate, Transaction> existingBySlot = new LinkedHashMap<>();
        List<Transaction> toUpdate = new ArrayList<>();
        List<Transaction> toCreate = new ArrayList<>();
        List<Transaction> toDelete = new ArrayList<>();

        existing.stream()
                .filter(tx -> !frozen.contains(tx))
                .filter(tx -> !filterByPivot || !tx.getScheduledDate().isBefore(pivotSlot))
                .sorted(Comparator.comparing(Transaction::getScheduledDate))
                .forEach(tx -> {
                    if (existingBySlot.putIfAbsent(tx.getScheduledDate(), tx) != null) {
                        toDelete.add(tx);
                    }
                });

        for (TargetOccurrence target : inScopeTargets) {
            Transaction tx = existingBySlot.remove(target.date());
            if (tx != null) {
                stampOccurrence(tx, target, def, shares);
                toUpdate.add(tx);
            } else {
                toCreate.add(buildNewOccurrence(target, def, shares));
            }
        }
        toDelete.addAll(existingBySlot.values());

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
        LocalDate effectiveEnd = def.getEndDate() != null ? def.getEndDate() : series.horizonFrom(LocalDate.now(clock));

        List<TargetOccurrence> targets = new ArrayList<>();
        // Each date is counted from the start, so a day clamped in a short month does not carry over.
        for (int month = 0; !def.getStartDate().plusMonths(month).isAfter(effectiveEnd); month++) {
            targets.add(new TargetOccurrence(def.getStartDate().plusMonths(month), def.getDescription(), null));
        }
        return targets;
    }

    /** A forecast occurrence goes back to its slot's date; a confirmed pivot keeps the date it was paid on. */
    private void stampOccurrence(Transaction tx, TargetOccurrence slot, RecurrenceDefinition def, List<Share> shares) {
        LocalDate date = tx.getConfirmation() == Confirmation.CONFIRMED ? tx.getStartDate() : slot.date();
        tx.edit(
                new TransactionDetails(
                        def.getCategory(),
                        tx.getType(),
                        def.getAmount(),
                        slot.description(),
                        date,
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
