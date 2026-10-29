package com.lcs.findraco.support;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class DisposableDatabaseGuardTest {

    @Test
    void refusesTheProductionDatabase() {
        assertThatThrownBy(() -> DisposableDatabaseGuard.requireDisposable("findraco"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("'findraco'");
    }

    @Test
    void acceptsTheContainerDatabase() {
        assertThatCode(() -> DisposableDatabaseGuard.requireDisposable(TestcontainersConfig.DATABASE_NAME))
                .doesNotThrowAnyException();
    }
}
