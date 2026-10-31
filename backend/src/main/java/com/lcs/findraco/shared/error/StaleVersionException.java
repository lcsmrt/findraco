package com.lcs.findraco.shared.error;

import org.springframework.http.HttpStatus;

/**
 * An edit based on a version other than the stored one: someone changed the resource since the caller
 * read it. The same 409 {@code stale-version} answers a race the database catches at commit.
 */
public class StaleVersionException extends DomainException {

    public StaleVersionException() {
        super(
                ProblemType.STALE_VERSION,
                HttpStatus.CONFLICT,
                "version",
                "The resource was changed by another request. Reload it and try again.");
    }

    /** Refuses the edit unless the caller read the version that is stored. */
    public static void requireCurrent(long stored, long sent) {
        if (stored != sent) {
            throw new StaleVersionException();
        }
    }
}
