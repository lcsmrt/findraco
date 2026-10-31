package com.lcs.findraco.shared.security;

import java.text.Normalizer;

/**
 * Puts a password in Unicode NFKC before it is counted, hashed or checked, so the same characters typed on
 * different devices ("ç" as one code point or as "c" plus a combining mark) always produce the same hash.
 */
public final class PasswordNormalizer {

    private PasswordNormalizer() {}

    public static String normalize(String password) {
        return Normalizer.normalize(password, Normalizer.Form.NFKC);
    }
}
