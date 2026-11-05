package com.lcs.findraco.transaction.request;

import com.lcs.findraco.transaction.model.SeriesEditScope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.jspecify.annotations.Nullable;

/**
 * A series edit: the new series, applied to the occurrences its scope selects.
 *
 * @param pivotOccurrenceId required (validated at the service layer) for THIS_ONE and THIS_AND_FOLLOWING scopes.
 * @param series the series as the create request describes it.
 * @param pivotConfirmed whether the pivot occurrence is confirmed afterwards, in every scope; omitted, it keeps its
 *     status. Ignored by an occurrence that needs no confirmation.
 * @param version the series definition's version the caller read; an edit of a version that changed since
 *     answers 409.
 */
public record UpdateSeriesRequest(
        @NotNull(message = "Edit scope cannot be null.") SeriesEditScope scope,
        Long pivotOccurrenceId,
        @NotNull(message = "Series cannot be null.") @Valid CreateSeriesRequest series,
        @Nullable Boolean pivotConfirmed,
        @NotNull(message = "Version cannot be null.") Long version) {}
