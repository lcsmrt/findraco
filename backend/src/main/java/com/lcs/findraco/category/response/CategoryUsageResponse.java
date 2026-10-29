package com.lcs.findraco.category.response;

/**
 * How many transactions, items and recurrence definitions reference a category (CAT-10, P1 Sub
 * AC 18). The delete dialog reads it to decide whether a target category is required.
 */
public record CategoryUsageResponse(long transactions, long items, long recurrenceDefinitions) {

    public boolean inUse() {
        return transactions + items + recurrenceDefinitions > 0;
    }
}
