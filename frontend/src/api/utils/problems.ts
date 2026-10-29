import { AxiosError } from "axios";
import type { FieldProblem, Problem, ProblemType } from "../dtos";

const PREFIX = "urn:findraco:problem:";

/** The copy of each problem the API can answer. A new backend slug fails the build until it has copy. */
const PROBLEM_COPY: Record<ProblemType, string> = {
  "malformed-request": "The request could not be sent. Reload the page and try again.",
  "unsupported-request": "This action is not supported.",
  "validation-failed": "Some fields are invalid.",
  unauthenticated: "Your session has ended. Sign in again.",
  forbidden: "You are not allowed to do this.",
  "not-found": "This item no longer exists.",
  "stale-version": "Someone else changed this in the meantime. Reload it and try again.",
  "rate-limited": "Too many attempts. Wait a few minutes and try again.",
  internal: "Something went wrong on our side. Try again later.",
  "invalid-credentials": "Invalid e-mail or password.",
  "session-invalid": "Your session has ended. Sign in again.",
  "reset-token-invalid": "This password reset link is invalid or has expired. Request a new one.",
  "email-taken": "This e-mail is already in use.",
  "plan-not-found": "This plan no longer exists or you are no longer a member.",
  "member-not-found": "This person is no longer a member of the plan.",
  "insufficient-role": "Your role in this plan does not allow this.",
  "not-transaction-creator": "You can only change transactions you created.",
  "last-plan": "You cannot leave or delete your only plan.",
  "last-owner": "The plan needs another owner first. Transfer ownership before this.",
  "owner-role-needs-transfer": "To make someone the owner, transfer ownership.",
  "ownership-transfer-to-self": "You already own this plan.",
  "invitation-not-found": "This invitation does not exist.",
  "invitation-email-mismatch": "This invitation was sent to a different e-mail address.",
  "invitation-revoked": "This invitation has been revoked.",
  "invitation-used": "This invitation has already been used.",
  "invitation-expired": "This invitation has expired.",
  "category-not-found": "This category no longer exists.",
  "category-parent-is-itself": "A category cannot be its own parent.",
  "category-parent-is-subcategory": "A subcategory cannot be a parent.",
  "category-parent-type-mismatch": "A subcategory must have the same type as its parent.",
  "category-subcategories-block-parent": "A category with subcategories cannot be given a parent.",
  "category-subcategories-block-type-change": "The type of a category with subcategories cannot change.",
  "category-has-subcategories":
    "This category now has subcategories. Move or delete them before deleting it.",
  "category-in-use": "This category is now in use. Choose a category to receive its transactions.",
  "category-invalid-reassign-target": "Choose another category of the same type to receive them.",
  "category-member-limits-on-income": "Income categories cannot have per-member limits.",
  "category-member-limits-on-owned": "A category that belongs to one member cannot have per-member limits.",
  "category-member-limit-duplicate": "Each member can have only one limit.",
  "category-member-limit-not-member": "A per-member limit names someone who is not a member of the plan.",
  "category-owner-on-subcategory": "A subcategory belongs to its parent's owner.",
  "category-owner-not-member": "The owner must be a member of the plan.",
  "transaction-not-found": "This transaction no longer exists.",
  "series-not-found": "This series no longer exists.",
  "transaction-category-type-mismatch": "The category does not match the transaction type.",
  "item-category-type-mismatch": "An item's category does not match the transaction type.",
  "items-exceed-amount": "The items add up to more than the transaction amount.",
  "participant-shares-mismatch": "The shares must add up to the transaction amount.",
  "participant-duplicate": "A person is listed twice in the split.",
  "participant-not-member": "The split names someone who is not a member of the plan.",
  "participants-required": "Choose at least one person for this transaction.",
  "exact-share-invalid": "Give every person in the split an amount of zero or more.",
  "split-mode-not-supported": "This way of splitting is not supported.",
  "item-invalid": "Every item needs a description and an amount greater than zero.",
  "period-start-after-end": "The start date must not be after the end date.",
  "series-parcels-required": "Enter the number of installments.",
  "series-current-parcel-out-of-range": "The current installment must be between 1 and the number of installments.",
  "series-interval-required": "Choose how often the transaction repeats.",
  "series-pivot-not-found": "This occurrence is no longer part of the series.",
  "series-parcels-change-needs-all": "The number of installments can only change for the whole series.",
  "series-too-many-occurrences": "This series would create too many occurrences. Shorten it.",
  "import-line-invalid": "The file has a line that could not be read. Check the file and try again.",
};

/** Copy for a problem whose type this client does not know yet. */
const STATUS_COPY: Record<number, string> = {
  400: "The request could not be sent. Reload the page and try again.",
  401: "Your session has ended. Sign in again.",
  403: "You are not allowed to do this.",
  404: "This item no longer exists.",
  409: "This conflicts with a recent change. Reload and try again.",
  422: "Some values are invalid. Check them and try again.",
  429: "Too many attempts. Wait a few minutes and try again.",
};

const SERVER_ERROR_COPY = "Something went wrong on our side. Try again later.";
const NETWORK_COPY = "Could not reach the server. Check your connection and try again.";

/** How a field constraint reads after the field name. */
const CONSTRAINT_COPY: Record<string, string> = {
  NotBlank: "is required",
  NotEmpty: "is required",
  NotNull: "is required",
  Size: "has the wrong length",
  Positive: "must be greater than zero",
  PositiveOrZero: "cannot be negative",
  Min: "is too small",
  DecimalMin: "is too small",
  Max: "is too large",
  DecimalMax: "is too large",
  Digits: "has too many digits",
  Email: "is not a valid e-mail",
  Pattern: "has an invalid format",
};

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
  if (type != null) return PROBLEM_COPY[type];
  if (fallback) return fallback;
  if (!(error instanceof AxiosError)) return "An unexpected error occurred.";
  const status = error.response?.status;
  if (status == null) return NETWORK_COPY;
  return STATUS_COPY[status] ?? SERVER_ERROR_COPY;
}

/** The field errors of a 422 `validation-failed`, each as "field is required". */
export function problemFieldErrors(error: unknown): { field: string | null; message: string }[] {
  const errors: FieldProblem[] = readProblem(error)?.errors ?? [];
  return errors.map(({ field, code, message }) => {
    const constraint = CONSTRAINT_COPY[code] ?? message;
    return { field, message: field ? `${field} ${constraint}` : constraint };
  });
}

/** A toast for an error: the copy, plus the field errors and the request id to report. */
export function problemToast(error: unknown, fallback?: string): { message: string; description?: string } {
  const lines = problemFieldErrors(error).map((fieldError) => fieldError.message);
  const requestId = readProblem(error)?.requestId;
  if (requestId) lines.push(`Request id: ${requestId}`);
  return {
    message: problemMessage(error, fallback),
    ...(lines.length > 0 && { description: lines.join("\n") }),
  };
}
