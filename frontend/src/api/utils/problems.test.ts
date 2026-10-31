import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { problemError } from "@/test/problems";
import { problemFieldErrors, problemLineErrors, problemMessage, problemToast, problemType } from "./problems";

function plainHttpError(status: number, data: unknown) {
  return new AxiosError(`Request failed with status code ${status}`, String(status), undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  });
}

describe("problemMessage", () => {
  it("shows the copy of a known type, never the API's detail (BST-08 AC 11)", () => {
    const error = problemError(409, "category-has-subcategories", { detail: "Category 7 has subcategories." });

    expect(problemMessage(error)).toBe(
      "This category now has subcategories. Move or delete them before deleting it.",
    );
    expect(problemType(error)).toBe("category-has-subcategories");
  });

  it("has copy for the rate limit and the stale version (BST-08 AC 11, BST-14 AC 4)", () => {
    expect(problemMessage(problemError(429, "rate-limited"))).toBe(
      "Too many attempts. Wait a few minutes and try again.",
    );
    expect(problemMessage(problemError(409, "stale-version"))).toBe(
      "Someone else changed this in the meantime. Reload it and try again.",
    );
  });

  it("falls back to the status for an unknown type (BST-08 AC 11)", () => {
    const error = problemError(409, "brand-new-rule", { detail: "Shown to nobody." });

    expect(problemType(error)).toBeNull();
    expect(problemMessage(error)).toBe("This conflicts with a recent change. Reload and try again.");
    expect(problemMessage(problemError(503, "brand-new-rule"))).toBe(
      "Something went wrong on our side. Try again later.",
    );
  });

  it("prefers the caller's fallback to the status copy, but not to a known type's copy", () => {
    expect(problemMessage(problemError(409, "brand-new-rule"), "Could not delete the plan.")).toBe(
      "Could not delete the plan.",
    );
    expect(problemMessage(problemError(409, "last-plan"), "Could not delete the plan.")).toBe(
      "You cannot leave or delete your only plan.",
    );
  });

  it("ignores a body that is not a problem and a network failure", () => {
    expect(problemType(plainHttpError(400, { message: "Raw server text" }))).toBeNull();
    expect(problemMessage(plainHttpError(400, { message: "Raw server text" }))).toBe(
      "The request could not be sent. Reload the page and try again.",
    );
    expect(problemMessage(new AxiosError("Network Error", AxiosError.ERR_NETWORK))).toBe(
      "Could not reach the server. Check your connection and try again.",
    );
    expect(problemMessage(new Error("Boom"))).toBe("An unexpected error occurred.");
  });
});

describe("problemFieldErrors", () => {
  it("translates each 422 field error by its constraint code (BST-08 AC 4)", () => {
    const error = problemError(422, "validation-failed", {
      errors: [
        { field: "description", code: "NotBlank", message: "Description cannot be blank." },
        { field: "amount", code: "Positive", message: "must be greater than 0" },
        { field: "name", code: "SomethingNew", message: "is odd" },
        { field: null, code: "ValidPeriod", message: "the period is invalid" },
      ],
    });

    expect(problemFieldErrors(error)).toEqual([
      { field: "description", message: "description is required" },
      { field: "amount", message: "amount must be greater than zero" },
      { field: "name", message: "name is odd" },
      { field: null, message: "the period is invalid" },
    ]);
  });

  it("is empty for any other error", () => {
    expect(problemFieldErrors(problemError(404, "category-not-found"))).toEqual([]);
    expect(problemFieldErrors(new Error("Boom"))).toEqual([]);
  });
});

describe("problemToast", () => {
  it("adds the field errors and the request id to report", () => {
    const error = problemError(422, "validation-failed", {
      requestId: "req-42",
      errors: [{ field: "description", code: "NotBlank", message: "Description cannot be blank." }],
    });

    expect(problemToast(error)).toEqual({
      message: "Some fields are invalid.",
      description: "description is required\nRequest id: req-42",
    });
  });

  it("has no description without a request id or field errors", () => {
    expect(problemToast(new Error("Boom"), "Could not save.")).toEqual({ message: "Could not save." });
  });
});

describe("problemLineErrors", () => {
  it("says what is wrong on each line of a rejected import and sums up the rest", () => {
    const errors = Array.from({ length: 12 }, (_, index) => ({
      line: index + 2,
      field: "date",
      code: index === 0 ? "date-invalid" : "mystery",
    }));
    const error = problemError(422, "import-line-invalid", { errors });

    const lines = problemLineErrors(error);

    expect(lines).toHaveLength(11);
    expect(lines[0]).toBe("Line 2: date must be a real date as dd/mm/yyyy");
    expect(lines[1]).toBe("Line 3: date is invalid");
    expect(lines[10]).toBe("...and 2 more");
    expect(problemFieldErrors(error)).toEqual([]);
    expect(problemToast(error).description).toContain("Line 2:");
  });

  it("is empty for field errors", () => {
    const error = problemError(422, "validation-failed", {
      errors: [{ field: "name", code: "NotBlank", message: "x" }],
    });

    expect(problemLineErrors(error)).toEqual([]);
  });
});
