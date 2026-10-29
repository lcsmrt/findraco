package com.lcs.findraco.category.request;

import com.lcs.findraco.category.model.CategorySortField;
import com.lcs.findraco.shared.web.PageRequests;
import com.lcs.findraco.transaction.model.TransactionType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.domain.PageRequest;

/** Query parameters of the category list; absent paging parameters take their defaults. */
public record CategoryFilter(
        String description,
        TransactionType type,

        @Min(value = 0, message = "Page number cannot be negative.")
        Integer page,

        @Min(value = 1, message = "Page size must be at least 1.")
        @Max(value = 100, message = "Page size must be at most 100.")
        Integer size,

        CategorySortField sortBy,

        @Pattern(
                regexp = "asc|desc",
                flags = Pattern.Flag.CASE_INSENSITIVE,
                message = "Sort direction must be 'asc' or 'desc'.")
        String sortDirection) {

    public CategoryFilter {
        page = page == null ? 0 : page;
        size = size == null ? 10 : size;
        sortBy = sortBy == null ? CategorySortField.description : sortBy;
        sortDirection = sortDirection == null ? "asc" : sortDirection;
    }

    public PageRequest toPageable() {
        return PageRequests.of(page, size, sortBy.name(), sortDirection);
    }
}
