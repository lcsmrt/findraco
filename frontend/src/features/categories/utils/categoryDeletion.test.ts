import { problemError } from "@/test/problems";
import { describe, expect, it } from "vitest";
import { SessionExpiredError } from "@/api/clients/sessionExpiredError";
import type { CategoryUsage, Category } from "@/api/dtos";
import {
  buildDeleteRequest,
  classifyDeleteError,
  describeUsage,
  eligibleDeleteTargets,
  isCategoryInUse,
} from "./categoryDeletion";

function cat(
  id: number,
  description: string,
  overrides: Partial<Category> = {},
): Category {
  return {
    id,
    version: 0,
    description,
    type: "DEBIT",
    parentId: null,
    ...overrides,
  };
}

const food = cat(1, "Food");
const delivery = cat(2, "Delivery", { parentId: 1 });
const diningOut = cat(3, "Dining out", { parentId: 1 });
const shopping = cat(4, "Shopping");
const home = cat(5, "Home", { parentId: 4 });
const salary = cat(6, "Salary", { type: "CREDIT" });
const categories = [food, delivery, diningOut, shopping, home, salary];

describe("eligibleDeleteTargets", () => {
  it("offers every other category of the same type, sorted by name", () => {
    expect(eligibleDeleteTargets(shopping, categories).map((c) => c.id)).toEqual([
      2, 3, 1,
    ]);
  });

  it("excludes the category itself and its own children", () => {
    const ids = eligibleDeleteTargets(food, categories).map((c) => c.id);
    expect(ids).toEqual([5, 4]);
  });

  it("lets a child go to its parent or a sibling", () => {
    expect(eligibleDeleteTargets(delivery, categories).map((c) => c.id)).toEqual([
      3, 1, 5, 4,
    ]);
  });

  it("never offers a category of the other type", () => {
    expect(eligibleDeleteTargets(salary, categories)).toEqual([]);
  });
});

function usage(
  transactions: number,
  items: number,
  recurrenceDefinitions: number,
): CategoryUsage {
  return { transactions, items, recurrenceDefinitions };
}

const unused = usage(0, 0, 0);

describe("isCategoryInUse", () => {
  it("is not in use when every count is zero", () => {
    expect(isCategoryInUse(unused)).toBe(false);
  });

  it("is in use when any single count is above zero", () => {
    expect(isCategoryInUse(usage(1, 0, 0))).toBe(true);
    expect(isCategoryInUse(usage(0, 1, 0))).toBe(true);
    expect(isCategoryInUse(usage(0, 0, 1))).toBe(true);
  });
});

describe("describeUsage", () => {
  it("shows every count, singular or plural", () => {
    expect(describeUsage(usage(3, 1, 0))).toBe(
      "3 transactions, 1 item and 0 recurrence definitions",
    );
    expect(describeUsage(usage(1, 2, 1))).toBe(
      "1 transaction, 2 items and 1 recurrence definition",
    );
  });
});

describe("buildDeleteRequest", () => {
  it("sends a plain delete for a category no one uses", () => {
    expect(
      buildDeleteRequest(4, { hasChildren: false, usage: unused, targetId: null }),
    ).toEqual({ id: 4 });
  });

  it("cannot submit before the usage counts are known", () => {
    expect(
      buildDeleteRequest(4, { hasChildren: false, usage: null, targetId: null }),
    ).toBeNull();
    expect(
      buildDeleteRequest(4, { hasChildren: false, usage: null, targetId: 1 }),
    ).toBeNull();
  });

  it("cannot submit an in-use delete without a target, whichever count is above zero", () => {
    for (const counts of [usage(2, 0, 0), usage(0, 1, 0), usage(0, 0, 1)]) {
      expect(
        buildDeleteRequest(4, { hasChildren: false, usage: counts, targetId: null }),
      ).toBeNull();
    }
  });

  it("reassigns to the chosen target for an in-use category", () => {
    expect(
      buildDeleteRequest(4, { hasChildren: false, usage: usage(3, 1, 1), targetId: 1 }),
    ).toEqual({ id: 4, reassignTo: 1 });
  });

  it("ignores a chosen target when the category is unused", () => {
    expect(
      buildDeleteRequest(4, { hasChildren: false, usage: unused, targetId: 1 }),
    ).toEqual({ id: 4 });
  });

  it("cannot submit while the category has children", () => {
    expect(
      buildDeleteRequest(1, { hasChildren: true, usage: unused, targetId: 4 }),
    ).toBeNull();
  });
});

describe("classifyDeleteError", () => {
  it("reads the children 409 from its type (BST-08 AC 12)", () => {
    expect(
      classifyDeleteError(problemError(409, "category-has-subcategories")),
    ).toBe("has-children");
  });

  it("reads the in-use 409 from its type (BST-08 AC 12)", () => {
    expect(
      classifyDeleteError(problemError(409, "category-in-use")),
    ).toBe("in-use");
  });

  it("recognizes a failure caused by an expired session", () => {
    expect(
      classifyDeleteError(
        new SessionExpiredError(problemError(401, "session-invalid")),
      ),
    ).toBe("session-expired");
  });

  it("ignores other errors", () => {
    expect(classifyDeleteError(problemError(404, "category-not-found"))).toBeNull();
    expect(classifyDeleteError(problemError(409, "stale-version"))).toBeNull();
    expect(classifyDeleteError(new Error("Network"))).toBeNull();
  });
});
