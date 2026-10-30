package com.lcs.findraco.shared.web;

import com.lcs.findraco.shared.error.MalformedRequestException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

/** Builds the page of a paged filter, refusing a sort field the endpoint does not allow. */
public final class PageRequests {

    private static final String TIEBREAKER = "id";

    private PageRequests() {}

    public static PageRequest of(int page, int size, String sortBy, String sortDirection) {
        // The id breaks ties between equal sort keys, so a row never shows on two pages or on none.
        Sort sort = Sort.by(direction(sortDirection), sortBy).and(Sort.by(TIEBREAKER));
        return PageRequest.of(page, size, sort);
    }

    public static Sort.Direction direction(String sortDirection) {
        return Sort.Direction.fromOptionalString(sortDirection)
                .orElseThrow(() -> new MalformedRequestException("sortDirection", "Invalid sort direction."));
    }
}
