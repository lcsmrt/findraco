package com.lcs.findraco.shared.error;

import java.net.URI;

/**
 * Every problem the API answers, one slug each. The slug is contract: clients branch on it and map it to
 * their own copy, so a slug is never renamed and a new rule gets a new slug.
 */
public enum ProblemType {
    // Any endpoint
    MALFORMED_REQUEST("malformed-request"),
    UNSUPPORTED_REQUEST("unsupported-request"),
    VALIDATION_FAILED("validation-failed"),
    UNAUTHENTICATED("unauthenticated"),
    FORBIDDEN("forbidden"),
    NOT_FOUND("not-found"),
    STALE_VERSION("stale-version"),
    RATE_LIMITED("rate-limited"),
    INTERNAL("internal"),

    // Authentication and account
    INVALID_CREDENTIALS("invalid-credentials"),
    SESSION_INVALID("session-invalid"),
    RESET_TOKEN_INVALID("reset-token-invalid"),
    EMAIL_TAKEN("email-taken"),

    // Plans, members and invitations
    PLAN_NOT_FOUND("plan-not-found"),
    MEMBER_NOT_FOUND("member-not-found"),
    INSUFFICIENT_ROLE("insufficient-role"),
    NOT_TRANSACTION_CREATOR("not-transaction-creator"),
    LAST_PLAN("last-plan"),
    LAST_OWNER("last-owner"),
    OWNER_ROLE_NEEDS_TRANSFER("owner-role-needs-transfer"),
    OWNERSHIP_TRANSFER_TO_SELF("ownership-transfer-to-self"),
    INVITATION_NOT_FOUND("invitation-not-found"),
    INVITATION_EMAIL_MISMATCH("invitation-email-mismatch"),
    INVITATION_REVOKED("invitation-revoked"),
    INVITATION_USED("invitation-used"),
    INVITATION_EXPIRED("invitation-expired"),

    // Categories
    CATEGORY_NOT_FOUND("category-not-found"),
    CATEGORY_PARENT_IS_ITSELF("category-parent-is-itself"),
    CATEGORY_PARENT_IS_SUBCATEGORY("category-parent-is-subcategory"),
    CATEGORY_PARENT_TYPE_MISMATCH("category-parent-type-mismatch"),
    CATEGORY_SUBCATEGORIES_BLOCK_PARENT("category-subcategories-block-parent"),
    CATEGORY_SUBCATEGORIES_BLOCK_TYPE_CHANGE("category-subcategories-block-type-change"),
    CATEGORY_HAS_SUBCATEGORIES("category-has-subcategories"),
    CATEGORY_IN_USE("category-in-use"),
    CATEGORY_INVALID_REASSIGN_TARGET("category-invalid-reassign-target"),
    CATEGORY_MEMBER_LIMITS_ON_INCOME("category-member-limits-on-income"),
    CATEGORY_MEMBER_LIMITS_ON_OWNED("category-member-limits-on-owned"),
    CATEGORY_MEMBER_LIMIT_DUPLICATE("category-member-limit-duplicate"),
    CATEGORY_MEMBER_LIMIT_NOT_MEMBER("category-member-limit-not-member"),
    CATEGORY_OWNER_ON_SUBCATEGORY("category-owner-on-subcategory"),
    CATEGORY_OWNER_NOT_MEMBER("category-owner-not-member"),

    // Transactions and series
    TRANSACTION_NOT_FOUND("transaction-not-found"),
    SERIES_NOT_FOUND("series-not-found"),
    TRANSACTION_CATEGORY_TYPE_MISMATCH("transaction-category-type-mismatch"),
    ITEM_CATEGORY_TYPE_MISMATCH("item-category-type-mismatch"),
    ITEMS_EXCEED_AMOUNT("items-exceed-amount"),
    PARTICIPANT_SHARES_MISMATCH("participant-shares-mismatch"),
    PARTICIPANT_DUPLICATE("participant-duplicate"),
    PARTICIPANT_NOT_MEMBER("participant-not-member"),
    PARTICIPANTS_REQUIRED("participants-required"),
    EXACT_SHARE_INVALID("exact-share-invalid"),
    SPLIT_MODE_NOT_SUPPORTED("split-mode-not-supported"),
    ITEM_INVALID("item-invalid"),
    PERIOD_START_AFTER_END("period-start-after-end"),
    SERIES_PARCELS_REQUIRED("series-parcels-required"),
    SERIES_CURRENT_PARCEL_OUT_OF_RANGE("series-current-parcel-out-of-range"),
    SERIES_INTERVAL_REQUIRED("series-interval-required"),
    SERIES_PIVOT_NOT_FOUND("series-pivot-not-found"),
    SERIES_PARCELS_CHANGE_NEEDS_ALL("series-parcels-change-needs-all"),
    SERIES_TOO_MANY_OCCURRENCES("series-too-many-occurrences"),
    IMPORT_LINE_INVALID("import-line-invalid");

    private static final String PREFIX = "urn:findraco:problem:";

    private final String slug;

    ProblemType(String slug) {
        this.slug = slug;
    }

    public String slug() {
        return slug;
    }

    public URI uri() {
        return URI.create(PREFIX + slug);
    }
}
