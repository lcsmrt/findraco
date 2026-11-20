package com.lcs.findraco.transaction.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/** Query parameters of the trash list; absent paging parameters take their defaults. */
public record TransactionTrashFilter(
        @Min(value = 0, message = "Page number cannot be negative.")
        Integer page,

        @Min(value = 1, message = "Page size must be at least 1.")
        @Max(value = 100, message = "Page size must be at most 100.")
        Integer size) {

    public TransactionTrashFilter {
        page = page == null ? 0 : page;
        size = size == null ? 20 : size;
    }
}
