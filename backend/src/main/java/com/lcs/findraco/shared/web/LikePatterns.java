package com.lcs.findraco.shared.web;

import java.util.Locale;

/** Turns a search term typed by a person into a LIKE pattern in which {@code %} and {@code _} mean themselves. */
public final class LikePatterns {

    /** The escape character to pass as the third argument of {@code CriteriaBuilder.like}. */
    public static final char ESCAPE = '\\';

    private LikePatterns() {}

    /** The case-insensitive "contains" pattern of {@code term}: lower case, wildcards escaped, wrapped in {@code %}. */
    public static String contains(String term) {
        return "%" + escape(term.toLowerCase(Locale.ROOT)) + "%";
    }

    /** {@code term} with every LIKE wildcard and the escape character itself prefixed by the escape character. */
    public static String escape(String term) {
        StringBuilder escaped = new StringBuilder(term.length());
        for (int i = 0; i < term.length(); i++) {
            char c = term.charAt(i);
            if (c == ESCAPE || c == '%' || c == '_') {
                escaped.append(ESCAPE);
            }
            escaped.append(c);
        }
        return escaped.toString();
    }
}
