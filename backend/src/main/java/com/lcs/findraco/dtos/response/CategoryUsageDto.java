package com.lcs.findraco.dtos.response;

/**
 * How many transactions, items and recurrence definitions reference a category (CAT-10, P1 Sub
 * AC 18). The delete dialog reads it to decide whether a target category is required.
 */
public class CategoryUsageDto {
    private final long transactions;
    private final long items;
    private final long recurrenceDefinitions;

    public CategoryUsageDto(long transactions, long items, long recurrenceDefinitions) {
        this.transactions = transactions;
        this.items = items;
        this.recurrenceDefinitions = recurrenceDefinitions;
    }

    public long getTransactions() { return transactions; }
    public long getItems() { return items; }
    public long getRecurrenceDefinitions() { return recurrenceDefinitions; }

    public boolean inUse() {
        return transactions + items + recurrenceDefinitions > 0;
    }
}
