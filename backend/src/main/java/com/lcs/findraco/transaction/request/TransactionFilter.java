package com.lcs.findraco.transaction.request;

import com.lcs.findraco.transaction.model.TransactionSortField;
import com.lcs.findraco.transaction.model.TransactionType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Query parameters of the transaction list; absent paging parameters take their defaults. */
public record TransactionFilter(
        TransactionType type,
        Long categoryId,
        Long memberId,

        @Size(max = 255, message = "Description cannot exceed 255 characters.")
        String description,

        LocalDate startDateFrom,
        LocalDate startDateTo,
        BigDecimal amountMin,
        BigDecimal amountMax,

        @Min(value = 0, message = "Page number cannot be negative.")
        Integer page,

        @Min(value = 1, message = "Page size must be at least 1.")
        @Max(value = 100, message = "Page size must be at most 100.")
        Integer size,

        TransactionSortField sortBy,

        @Pattern(
                regexp = "asc|desc",
                flags = Pattern.Flag.CASE_INSENSITIVE,
                message = "Sort direction must be 'asc' or 'desc'.")
        @Size(max = 4, message = "Sort direction must be 'asc' or 'desc'.")
        String sortDirection) {

    public TransactionFilter {
        page = page == null ? 0 : page;
        size = size == null ? 10 : size;
        sortBy = sortBy == null ? TransactionSortField.startDate : sortBy;
        sortDirection = sortDirection == null ? "desc" : sortDirection;
    }
}
