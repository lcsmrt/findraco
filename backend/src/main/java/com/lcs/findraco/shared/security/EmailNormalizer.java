package com.lcs.findraco.shared.security;

import java.util.Locale;

/**
 * The one spelling of an e-mail address the system stores and compares: trimmed and lower-cased with a fixed
 * locale, so "Taken@X.com" and "taken@x.com " are the same account on sign-up, login, reset and invitations.
 */
public final class EmailNormalizer {

    private EmailNormalizer() {}

    public static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
