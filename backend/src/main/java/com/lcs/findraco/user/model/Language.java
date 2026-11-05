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
}
