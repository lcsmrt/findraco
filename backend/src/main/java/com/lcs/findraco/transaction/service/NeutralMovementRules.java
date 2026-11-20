package com.lcs.findraco.transaction.service;

import com.lcs.findraco.transaction.model.TransactionKind;
import java.text.Normalizer;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import org.jspecify.annotations.Nullable;

/**
 * What the bank's text of a row says about its kind: a card bill payment, or a Pix to or from someone in the plan.
 * Pure text rules, shared by the import (which applies the card bill) and the review (which proposes both).
 */
public final class NeutralMovementRules {

    private static final String CARD_BILL = "pagamento de fatura";
    private static final String PIX = "pelo pix";
    private static final String SEGMENT_SEPARATOR = " - ";
    private static final Pattern ACCENT_MARKS = Pattern.compile("\\p{M}+");
    private static final Pattern NAME_SEPARATORS = Pattern.compile("[^a-z0-9]+");

    private NeutralMovementRules() {}

    /** The statement's text starts with "Pagamento de fatura", whatever its case or surrounding whitespace. */
    public static boolean isCardBillPayment(String sourceText) {
        return fold(sourceText.strip()).startsWith(CARD_BILL);
    }

    /**
     * The kind the text proposes, or null when it matches no rule. A Pix text names its counterpart in the
     * segment after the first " - "; it is a transfer when that name holds the first and last name of a member.
     */
    public static @Nullable TransactionKind propose(String sourceText, Collection<String> memberNames) {
        if (isCardBillPayment(sourceText)) {
            return TransactionKind.CARD_BILL_PAYMENT;
        }
        if (!fold(sourceText).contains(PIX)) {
            return null;
        }
        String[] segments = sourceText.split(Pattern.quote(SEGMENT_SEPARATOR), 3);
        if (segments.length < 2) {
            return null;
        }
        Set<String> counterpart = Set.copyOf(tokens(segments[1]));
        boolean isMember = memberNames.stream()
                .map(NeutralMovementRules::tokens)
                .anyMatch(name -> !name.isEmpty()
                        && counterpart.contains(name.getFirst())
                        && counterpart.contains(name.getLast()));
        return isMember ? TransactionKind.TRANSFER : null;
    }

    private static List<String> tokens(String name) {
        return List.of(NAME_SEPARATORS.split(fold(name))).stream()
                .filter(token -> !token.isEmpty())
                .toList();
    }

    /** Lower case with the accents taken off, so "Marína" and "MARINA" read the same. */
    private static String fold(String text) {
        return ACCENT_MARKS
                .matcher(Normalizer.normalize(text, Normalizer.Form.NFD))
                .replaceAll("")
                .toLowerCase(Locale.ROOT);
    }
}
