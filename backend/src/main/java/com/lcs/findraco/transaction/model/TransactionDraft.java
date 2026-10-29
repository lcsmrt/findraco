package com.lcs.findraco.transaction.model;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.user.model.User;
import java.util.List;
import org.jspecify.annotations.Nullable;

/**
 * Everything a new transaction is made of, whichever path creates it (a form, a CSV row, a series).
 *
 * @param externalId the bank's id of an imported row.
 * @param series the series the transaction is an occurrence of.
 */
public record TransactionDraft(
        Plan plan,
        User createdBy,
        TransactionDetails details,
        SplitMode splitMode,
        List<Share> participants,
        List<ItemDraft> items,
        @Nullable String externalId,
        @Nullable RecurrenceDefinition series) {}
