package com.lcs.findraco.shared.web;

import com.lcs.findraco.shared.error.MalformedRequestException;
import java.util.Set;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

/** Builds the page of a paged filter, refusing a sort field the endpoint does not allow. */
public final class PageRequests {

    private PageRequests() {}

    public static PageRequest of(
            int page, int size, String sortBy, String sortDirection, Set<String> allowedSortFields) {
        if (!allowedSortFields.contains(sortBy)) {
            throw new MalformedRequestException("sortBy", "Invalid sort field: " + sortBy);
        }
        Sort sort = Sort.by(direction(sortDirection), sortBy);
        return PageRequest.of(page, size, sort);
    }

    public static Sort.Direction direction(String sortDirection) {
        return Sort.Direction.fromOptionalString(sortDirection)
                .orElseThrow(() -> new MalformedRequestException("sortDirection", "Invalid sort direction."));
    }
}
