package com.lcs.findraco.transaction.importer;

import java.text.Normalizer;
import java.util.Locale;

/** Header cells compared without case, accents or surrounding spaces. */
final class HeaderNames {

    private HeaderNames() {}

    static String normalize(String name) {
        return Normalizer.normalize(name.strip(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);
    }
}
