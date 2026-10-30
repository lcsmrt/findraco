package com.lcs.findraco.transaction.model;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.user.model.User;
import java.util.List;
import org.jspecify.annotations.Nullable;

/**
 * Everything a new transaction is made of, whichever path creates it (a form, a CSV row, a series).
 *
 * @param sourceRef the bank's id of an imported row.
 * @param sourceText the bank's text of an imported row, kept apart from the description a member may edit.
 * @param series the series the transaction is an occurrence of.
 */
public record TransactionDraft(
        Plan plan,
        User createdBy,
        TransactionDetails details,
        SplitMode splitMode,
        List<Share> participants,
        List<ItemDraft> items,
        @Nullable String sourceRef,
        @Nullable String sourceText,
        @Nullable RecurrenceDefinition series) {

    /** A draft with no bank origin: a form, a series occurrence. */
    public TransactionDraft(
            Plan plan,
            User createdBy,
            TransactionDetails details,
            SplitMode splitMode,
            List<Share> participants,
            List<ItemDraft> items,
            @Nullable String sourceRef,
            @Nullable RecurrenceDefinition series) {
        this(plan, createdBy, details, splitMode, participants, items, sourceRef, null, series);
    }
}
