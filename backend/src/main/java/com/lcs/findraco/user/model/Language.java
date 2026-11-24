package com.lcs.findraco.user.model;

import java.util.Arrays;
import java.util.Optional;

/** The languages the app is translated into; {@code tag} is what the API and the database carry. */
public enum Language {
    EN("en"),
    PT_BR("pt-BR");

    private final String tag;

    Language(String tag) {
        this.tag = tag;
    }

    public String tag() {
        return tag;
    }

    /** The language of a tag, or empty for null and for any tag the app has no translation for. */
    public static Optional<Language> fromTag(String tag) {
        return Arrays.stream(values())
                .filter(language -> language.tag.equals(tag))
                .findFirst();
    }

    /**
     * The language the device asks for first: the primary tag of the header's first range, so "pt-BR,pt;q=0.9"
     * and "pt-PT" are Portuguese. Empty for no header, a range the app has no translation for, or one that
     * cannot be read; the caller falls back to English.
     */
    public static Optional<Language> fromAcceptLanguage(String header) {
        if (header == null) {
            return Optional.empty();
        }
        String firstRange = header.split(",", 2)[0].split(";", 2)[0].trim();
        String primaryTag = firstRange.split("-", 2)[0];
        return primaryTag.equalsIgnoreCase("pt") ? Optional.of(PT_BR) : Optional.empty();
    }
}
