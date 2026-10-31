package com.lcs.findraco.transaction.response;

/** What an import did: rows stored, and rows skipped because the bank id was already stored. */
public record ImportResultResponse(int imported, int skippedDuplicates) {}
