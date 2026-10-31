package com.lcs.findraco.support;

import java.util.Set;

/**
 * Every integration test truncates every table, so the suite refuses to start against any
 * database but the one its own container creates.
 */
final class DisposableDatabaseGuard {

    private static final Set<String> DISPOSABLE_DATABASES = Set.of(TestcontainersConfig.DATABASE_NAME);

    private DisposableDatabaseGuard() {}

    static void requireDisposable(String database) {
        if (!DISPOSABLE_DATABASES.contains(database)) {
            throw new IllegalStateException("Refusing to run integration tests against database '" + database
                    + "'. Every test truncates every table, and only " + DISPOSABLE_DATABASES + " may be wiped.");
        }
    }
}
