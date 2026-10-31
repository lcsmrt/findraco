package com.lcs.findraco.transaction.importer;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.jspecify.annotations.Nullable;

/**
 * One valid row of a bank file, the same shape whatever the bank.
 *
 * @param amount signed: negative is money out, positive money in.
 * @param sourceText the bank's text for the row, exactly as the bank wrote it.
 * @param sourceRef the bank's id of the row; null when the bank gave none, so the row cannot be told apart.
 */
public record ImportedRow(
        LocalDate date,
        BigDecimal amount,
        String sourceText,
        @Nullable String sourceRef,
        StatementFormat format) {}
