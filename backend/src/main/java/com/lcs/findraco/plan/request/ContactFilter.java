package com.lcs.findraco.plan.request;

/**
 * The query of the contact list.
 *
 * @param archived when true the archived contacts are listed too, each marked {@code archived}; by default only the
 *     active ones are.
 */
public record ContactFilter(Boolean archived) {

    public boolean includeArchived() {
        return Boolean.TRUE.equals(archived);
    }
}
