/**
 * The slugs of `urn:findraco:problem:<slug>`, mirroring the backend `ProblemType` enum. Hand-written until
 * the types are generated from the committed OpenAPI file.
 */
export type ProblemType =
  | "malformed-request"
  | "unsupported-request"
  | "validation-failed"
  | "unauthenticated"
  | "forbidden"
  | "not-found"
  | "stale-version"
  | "rate-limited"
  | "internal"
  | "invalid-credentials"
  | "session-invalid"
  | "reset-token-invalid"
  | "email-taken"
  | "plan-not-found"
  | "member-not-found"
  | "insufficient-role"
  | "not-transaction-creator"
  | "last-plan"
  | "last-owner"
  | "owner-role-needs-transfer"
  | "ownership-transfer-to-self"
  | "invitation-not-found"
  | "invitation-email-mismatch"
  | "invitation-revoked"
  | "invitation-used"
  | "invitation-expired"
  | "invitation-email-required"
  | "category-not-found"
  | "category-parent-is-itself"
  | "category-parent-is-subcategory"
  | "category-parent-type-mismatch"
  | "category-subcategories-block-parent"
  | "category-subcategories-block-type-change"
  | "category-has-subcategories"
  | "category-in-use"
  | "category-type-change-in-use"
  | "category-invalid-reassign-target"
  | "category-member-limits-on-income"
  | "category-member-limits-on-owned"
  | "category-member-limit-duplicate"
  | "category-member-limit-not-member"
  | "category-owner-on-subcategory"
  | "category-owner-not-member"
  | "transaction-not-found"
  | "series-not-found"
  | "transaction-category-type-mismatch"
  | "item-category-type-mismatch"
  | "items-exceed-amount"
  | "participant-shares-mismatch"
  | "participant-duplicate"
  | "participant-not-member"
  | "participants-required"
  | "exact-share-invalid"
  | "split-mode-not-supported"
  | "item-invalid"
  | "period-start-after-end"
  | "series-parcels-required"
  | "series-current-parcel-out-of-range"
  | "series-interval-required"
  | "series-pivot-not-found"
  | "series-parcels-change-needs-all"
  | "series-too-many-occurrences"
  | "import-line-invalid"
  | "csv-unknown-format"
  | "csv-format-not-supported"
  | "csv-encoding-invalid"
  | "csv-too-many-rows"
  | "csv-too-large";

/** One failed constraint of a 422 `validation-failed`; `code` is the constraint name (`NotBlank`). */
export type FieldProblem = {
  field: string | null;
  code: string;
  message: string;
};

/** One invalid line of an imported file, in a 422 `import-line-invalid`; `code` names the reason. */
export type LineProblem = {
  line: number;
  field: string;
  code: string;
};

/** The RFC 9457 body of every API error. `detail` is for developers and never shown. */
export type Problem = {
  type: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
  requestId?: string;
  field?: string;
  errors?: (FieldProblem | LineProblem)[];
};
