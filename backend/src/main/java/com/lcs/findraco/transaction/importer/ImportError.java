package com.lcs.findraco.transaction.importer;

/**
 * One invalid line of a bank file, sent to the client as is. {@code field} names the column and
 * {@code code} the reason ({@code date-invalid}); the client turns the pair into its own words.
 */
public record ImportError(int line, String field, String code) {}
