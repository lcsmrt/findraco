package com.lcs.findraco.mcp.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class McpNamesTest {

    @Test
    void matchesIgnoringCaseAndAccents() {
        assertThat(McpNames.matches("mercado", "Mercado")).isTrue();
        assertThat(McpNames.matches("acai", "Açaí")).isTrue();
        assertThat(McpNames.matches("VIAGEM À PRAIA", "viagem a praia")).isTrue();
        assertThat(McpNames.matches("  Casa ", "casa")).isTrue();
        assertThat(McpNames.matches("Strasse", "Straße")).isTrue();
    }

    @Test
    void matchesNothingButTheWholeName() {
        assertThat(McpNames.matches("Casa", "Casa 2")).isFalse();
        assertThat(McpNames.matches("Cas", "Casa")).isFalse();
        assertThat(McpNames.matches("Mercado Livre", "Mercado")).isFalse();
    }
}
