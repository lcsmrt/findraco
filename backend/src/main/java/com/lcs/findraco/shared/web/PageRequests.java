package com.lcs.findraco.shared.web;

import java.util.Set;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

/** Builds the page of a paged filter, refusing a sort field the endpoint does not allow. */
public final class PageRequests {

    private PageRequests() {}

    public static PageRequest of(
            int page, int size, String sortBy, String sortDirection, Set<String> allowedSortFields) {
        if (!allowedSortFields.contains(sortBy)) {
            throw new IllegalArgumentException("Invalid sort field: " + sortBy);
        }
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        return PageRequest.of(page, size, sort);
    }
}
