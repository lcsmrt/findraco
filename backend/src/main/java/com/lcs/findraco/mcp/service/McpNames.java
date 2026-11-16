package com.lcs.findraco.mcp.service;

import java.text.Normalizer;
import java.util.Locale;

/** How a spoken name matches a stored one: ignoring case and accents, exact otherwise. */
public final class McpNames {

    private McpNames() {}

    public static boolean matches(String spoken, String stored) {
        return normalize(spoken).equals(normalize(stored));
    }

    /** Decomposed, marks stripped and case-folded ({@code ß} and {@code SS} meet in upper case). */
    private static String normalize(String name) {
        return Normalizer.normalize(name.strip(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toUpperCase(Locale.ROOT)
                .toLowerCase(Locale.ROOT);
    }
}
