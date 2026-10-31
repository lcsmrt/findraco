package com.lcs.findraco.transaction.service;

/** How many transactions, items and recurrence definitions point at one category. */
public record CategoryReferenceCounts(long transactions, long items, long recurrenceDefinitions) {}
