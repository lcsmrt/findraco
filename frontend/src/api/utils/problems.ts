import { AxiosError } from "axios";
import type { ParseKeys } from "i18next";
import { i18n } from "@/i18n/i18n";
import type { FieldProblem, LineProblem, Problem, ProblemType } from "../dtos";

const PREFIX = "urn:findraco:problem:";

/** The copy of each problem the API can answer. A new backend slug fails the build until it has copy. */
const PROBLEM_COPY = {
  "malformed-request": "problems.malformed-request",
  "unsupported-request": "problems.unsupported-request",
  "validation-failed": "problems.validation-failed",
  unauthenticated: "problems.unauthenticated",
  forbidden: "problems.forbidden",
  "not-found": "problems.not-found",
  "stale-version": "problems.stale-version",
  "rate-limited": "problems.rate-limited",
  internal: "problems.internal",
  "invalid-credentials": "problems.invalid-credentials",
  "session-invalid": "problems.session-invalid",
  "reset-token-invalid": "problems.reset-token-invalid",
  "email-taken": "problems.email-taken",
  "plan-not-found": "problems.plan-not-found",
  "member-not-found": "problems.member-not-found",
  "insufficient-role": "problems.insufficient-role",
  "not-transaction-creator": "problems.not-transaction-creator",
  "plan-not-archived": "problems.plan-not-archived",
  "last-plan": "problems.last-plan",
  "last-owner": "problems.last-owner",
  "owner-role-needs-transfer": "problems.owner-role-needs-transfer",
  "ownership-transfer-to-self": "problems.ownership-transfer-to-self",
  "invitation-not-found": "problems.invitation-not-found",
  "invitation-email-mismatch": "problems.invitation-email-mismatch",
  "invitation-revoked": "problems.invitation-revoked",
  "invitation-used": "problems.invitation-used",
  "invitation-expired": "problems.invitation-expired",
  "invitation-email-required": "problems.invitation-email-required",
  "category-not-found": "problems.category-not-found",
  "category-parent-is-itself": "problems.category-parent-is-itself",
  "category-parent-is-subcategory": "problems.category-parent-is-subcategory",
  "category-parent-type-mismatch": "problems.category-parent-type-mismatch",
  "category-subcategories-block-parent": "problems.category-subcategories-block-parent",
  "category-subcategories-block-type-change": "problems.category-subcategories-block-type-change",
  "category-has-subcategories": "problems.category-has-subcategories",
  "category-in-use": "problems.category-in-use",
  "category-type-change-in-use": "problems.category-type-change-in-use",
  "category-invalid-reassign-target": "problems.category-invalid-reassign-target",
  "category-member-limits-on-income": "problems.category-member-limits-on-income",
  "category-member-limits-on-owned": "problems.category-member-limits-on-owned",
  "category-member-limit-duplicate": "problems.category-member-limit-duplicate",
  "category-member-limit-not-member": "problems.category-member-limit-not-member",
  "category-owner-on-subcategory": "problems.category-owner-on-subcategory",
  "category-owner-not-member": "problems.category-owner-not-member",
  "transaction-not-found": "problems.transaction-not-found",
  "series-not-found": "problems.series-not-found",
  "transaction-not-awaiting-confirmation": "problems.transaction-not-awaiting-confirmation",
  "transaction-category-type-mismatch": "problems.transaction-category-type-mismatch",
  "item-category-type-mismatch": "problems.item-category-type-mismatch",
  "items-exceed-amount": "problems.items-exceed-amount",
  "participant-shares-mismatch": "problems.participant-shares-mismatch",
  "participant-duplicate": "problems.participant-duplicate",
  "participant-not-member": "problems.participant-not-member",
  "participants-required": "problems.participants-required",
  "exact-share-invalid": "problems.exact-share-invalid",
  "item-invalid": "problems.item-invalid",
  "period-start-after-end": "problems.period-start-after-end",
  "series-parcels-required": "problems.series-parcels-required",
  "series-current-parcel-out-of-range": "problems.series-current-parcel-out-of-range",
  "series-interval-required": "problems.series-interval-required",
  "series-pivot-not-found": "problems.series-pivot-not-found",
  "series-parcels-change-needs-all": "problems.series-parcels-change-needs-all",
  "series-too-many-occurrences": "problems.series-too-many-occurrences",
  "import-line-invalid": "problems.import-line-invalid",
  "csv-unknown-format": "problems.csv-unknown-format",
  "csv-format-not-supported": "problems.csv-format-not-supported",
  "csv-encoding-invalid": "problems.csv-encoding-invalid",
  "csv-too-many-rows": "problems.csv-too-many-rows",
  "csv-too-large": "problems.csv-too-large",
} as const satisfies Record<ProblemType, ParseKeys>;

/** Copy for a problem whose type this client does not know yet. */
const STATUS_COPY: Record<number, ParseKeys | undefined> = {
  "400": "problems.status.400",
  "401": "problems.status.401",
  "403": "problems.status.403",
  "404": "problems.status.404",
  "409": "problems.status.409",
  "422": "problems.status.422",
  "429": "problems.status.429",
};

const SERVER_ERROR_COPY = "problems.serverError";
const NETWORK_COPY = "problems.network";

/** How a field constraint reads after the field name. */
const CONSTRAINT_COPY: Record<string, ParseKeys | undefined> = {
  NotBlank: "problems.constraint.NotBlank",
  NotEmpty: "problems.constraint.NotEmpty",
  NotNull: "problems.constraint.NotNull",
  Size: "problems.constraint.Size",
  Positive: "problems.constraint.Positive",
  PositiveOrZero: "problems.constraint.PositiveOrZero",
  Min: "problems.constraint.Min",
  DecimalMin: "problems.constraint.DecimalMin",
  Max: "problems.constraint.Max",
  DecimalMax: "problems.constraint.DecimalMax",
  Digits: "problems.constraint.Digits",
  NarrowedEnum: "problems.constraint.NarrowedEnum",
  Email: "problems.constraint.Email",
  Pattern: "problems.constraint.Pattern",
  PasswordLength: "problems.constraint.PasswordLength",
  PasswordCharacters: "problems.constraint.PasswordCharacters",
};

/** Why a line of an imported file was refused, by the API's `code`. */
const LINE_COPY: Record<string, ParseKeys | undefined> = {
  "date-invalid": "problems.line.date-invalid",
  "amount-invalid": "problems.line.amount-invalid",
  "amount-zero": "problems.line.amount-zero",
  "column-count": "problems.line.column-count",
  malformed: "problems.line.malformed",
  "too-long": "problems.line.too-long",
  blank: "problems.line.blank",
};

/** Lines listed in a toast before the rest are summed up. */
const LINES_SHOWN = 10;

function isLineProblem(error: FieldProblem | LineProblem): error is LineProblem {
  return "line" in error;
}

function isFieldProblem(error: FieldProblem | LineProblem): error is FieldProblem {
  return !isLineProblem(error);
}

function isProblemType(slug: string): slug is ProblemType {
  return Object.prototype.hasOwnProperty.call(PROBLEM_COPY, slug);
}

/** The problem body of an API error, or null for anything else (a network failure, a plain error). */
export function readProblem(error: unknown): Problem | null {
  if (!(error instanceof AxiosError)) return null;
  const data: unknown = error.response?.data;
  if (typeof data !== "object" || data === null || !("type" in data) || !("status" in data)) {
    return null;
  }
  return typeof data.type === "string" && data.type.startsWith(PREFIX) ? (data as Problem) : null;
}

/** The problem's slug when this client knows it; branch on it, never on wording. */
export function problemType(error: unknown): ProblemType | null {
  const slug = readProblem(error)?.type.slice(PREFIX.length);
  return slug != null && isProblemType(slug) ? slug : null;
}

/**
 * The copy to show for an error: the type's own copy, else the caller's fallback, else a generic sentence
 * per status. The API's `detail` is never shown.
 */
export function problemMessage(error: unknown, fallback?: string): string {
  const type = problemType(error);
  // Resolved at call time: this runs outside React, so the language in use now is the one that counts.
  if (type != null) return i18n.t(PROBLEM_COPY[type]);
  if (fallback) return fallback;
  if (!(error instanceof AxiosError)) return i18n.t("problems.unexpected");
  const status = error.response?.status;
  if (status == null) return i18n.t(NETWORK_COPY);
  return i18n.t(STATUS_COPY[status] ?? SERVER_ERROR_COPY);
}

/** The field's name in the language in use; a name this client has no copy for shows as the API wrote it. */
function fieldName(field: string): string {
  const key = `problems.fieldName.${field}`;
  // The key is built from the API's field name, so it is checked at run time, not by the type.
  return i18n.exists(key) ? i18n.t(key as ParseKeys) : field;
}

/** The field errors of a 422 `validation-failed`, each as "field is required". */
export function problemFieldErrors(error: unknown): { field: string | null; message: string }[] {
  const errors = (readProblem(error)?.errors ?? []).filter(isFieldProblem);
  return errors.map(({ field, code, message }) => {
    const constraintKey = CONSTRAINT_COPY[code];
    const constraint = constraintKey ? i18n.t(constraintKey) : message;
    return { field, message: field ? i18n.t("problems.fieldError", { field: fieldName(field), constraint }) : constraint };
  });
}

/** The invalid lines of a rejected import, each as "Line 5: date must be ...", the rest summed up. */
export function problemLineErrors(error: unknown): string[] {
  const lines = (readProblem(error)?.errors ?? []).filter(isLineProblem);
  const shown = lines.slice(0, LINES_SHOWN).map(({ line, field, code }) => {
    const lineKey = LINE_COPY[code];
    const reason = lineKey ? i18n.t(lineKey) : i18n.t("problems.fieldInvalid", { field: fieldName(field) });
    return i18n.t("problems.lineError", { line, reason });
  });
  return lines.length > LINES_SHOWN
    ? [...shown, i18n.t("problems.andMore", { remaining: lines.length - LINES_SHOWN })]
    : shown;
}

/** A toast for an error: the copy, plus the field or line errors and the request id to report. */
export function problemToast(error: unknown, fallback?: string): { message: string; description?: string } {
  const lines = [...problemFieldErrors(error).map((fieldError) => fieldError.message), ...problemLineErrors(error)];
  const requestId = readProblem(error)?.requestId;
  if (requestId) lines.push(i18n.t("problems.requestId", { id: requestId }));
  return {
    message: problemMessage(error, fallback),
    ...(lines.length > 0 && { description: lines.join("\n") }),
  };
}
