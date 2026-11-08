package com.lcs.findraco.mcp.config;

import java.util.Locale;
import org.springframework.stereotype.Component;

/**
 * Pins the JVM's default locale to English. The MCP SDK's schema validator words its errors in that locale and offers
 * no way to choose another, while every other tool error is English; Claude reads them all.
 */
@Component
public class EnglishToolMessages {

    public EnglishToolMessages() {
        Locale.setDefault(Locale.ENGLISH);
    }
}
