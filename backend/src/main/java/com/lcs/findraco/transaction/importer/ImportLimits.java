package com.lcs.findraco.transaction.importer;

/** The bounds a parser enforces while it reads: rows allowed and errors worth listing. */
public record ImportLimits(int maxRows, int maxErrors) {}
