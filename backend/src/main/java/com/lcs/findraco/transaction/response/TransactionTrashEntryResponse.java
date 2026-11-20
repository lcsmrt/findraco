package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.TransactionDeletionKind;
import com.lcs.findraco.transaction.model.TransactionType;
import java.math.BigDecimal;
import java.time.Instant;
import org.jspecify.annotations.Nullable;

/** One delete action in the trash: what it removed, who did it and when it is purged. */
public record TransactionTrashEntryResponse(
        long id,
        TransactionDeletionKind kind,
        @Nullable SeriesEditScope scope,
        String description,
        long count,
        BigDecimal amount,
        TransactionType type,
        Instant deletedAt,
        @Nullable TransactionCreatorResponse deletedBy,
        Instant expiresAt) {}
