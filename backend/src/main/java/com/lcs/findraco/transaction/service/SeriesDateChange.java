package com.lcs.findraco.transaction.service;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.Confirmation;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.Transaction;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * A series' day, and from its first occurrence its month, changed by moving the pivot occurrence ("this and
 * following"). Checked against the occurrences before anything changes, then applied to the definition and to
 * every occurrence the change reaches.
 *
 * @param pivotMonth the month of the pivot's slot, before the change.
 * @param monthShift months between the pivot's slot and its new date; not zero only from the first occurrence.
 * @param pivotIsFirst whether no occurrence has an earlier slot than the pivot.
 */
record SeriesDateChange(
        Transaction pivot, int newDayOfMonth, YearMonth pivotMonth, int monthShift, boolean pivotIsFirst) {

    static SeriesDateChange of(Transaction pivot, LocalDate pivotDate, List<Transaction> occurrences) {
        YearMonth pivotMonth = YearMonth.from(pivot.getScheduledDate());
        int monthShift = (int) pivotMonth.until(YearMonth.from(pivotDate), ChronoUnit.MONTHS);
        boolean pivotIsFirst = occurrences.stream()
                .noneMatch(occurrence -> slotMonth(occurrence).isBefore(pivotMonth));
        if (monthShift != 0 && !pivotIsFirst) {
            throw new TransactionExceptions.SeriesDateChangeInvalidException();
        }
        // A confirmed occurrence keeps its month while the rest move, which would leave its old month empty to be
        // refilled. Refusing the month change also keeps every other occurrence one per month: they all move by the
        // same number of months, from the first one on.
        if (monthShift != 0 && occurrences.stream().anyMatch(SeriesDateChange::isConfirmed)) {
            throw new TransactionExceptions.SeriesMonthChangeConfirmedException();
        }
        return new SeriesDateChange(pivot, pivotDate.getDayOfMonth(), pivotMonth, monthShift, pivotIsFirst);
    }

    /** Applies the change to {@code definition} and to the pivot and every following occurrence that moves. */
    void apply(RecurrenceDefinition definition, List<Transaction> occurrences) {
        definition.moveSchedule(newDayOfMonth, monthShift, pivotIsFirst);
        for (Transaction occurrence : occurrences) {
            if (moves(occurrence)) {
                occurrence.moveWithSeries(
                        definition.dateIn(slotMonth(occurrence).plusMonths(monthShift)));
            }
        }
    }

    /** The pivot, and the unconfirmed ones after it; a confirmed occurrence is a record of what happened. */
    private boolean moves(Transaction occurrence) {
        if (occurrence.getId().equals(pivot.getId())) {
            return true;
        }
        return !slotMonth(occurrence).isBefore(pivotMonth) && !isConfirmed(occurrence);
    }

    private static boolean isConfirmed(Transaction occurrence) {
        return occurrence.getConfirmation() == Confirmation.CONFIRMED;
    }

    private static YearMonth slotMonth(Transaction occurrence) {
        return YearMonth.from(occurrence.getScheduledDate());
    }
}
