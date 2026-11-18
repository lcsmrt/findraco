package com.lcs.findraco.transaction.model;

import java.time.Duration;
import java.time.Instant;

/** How long a deleted transaction can be restored before it is deleted permanently; the frontend states it too. */
public final class TransactionRetention {

    public static final Duration PERIOD = Duration.ofDays(30);

    /** Deletions made at or before this instant are due for purging when the time is {@code now}. */
    public static Instant cutoff(Instant now) {
        return now.minus(PERIOD);
    }

    /** The instant a deletion made at {@code deletedAt} is purged. */
    public static Instant expiry(Instant deletedAt) {
        return deletedAt.plus(PERIOD);
    }

    private TransactionRetention() {}
}
