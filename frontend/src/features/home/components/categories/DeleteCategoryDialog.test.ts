import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import type { FinancialTransactionCategory } from "@/api/dtos";
import {
  buildDeleteRequest,
  classifyDeleteError,
  eligibleDeleteTargets,
} from "./DeleteCategoryDialog";

const cat = (
  id: number,
  description: string,
  overrides: Partial<FinancialTransactionCategory> = {},
): FinancialTransactionCategory => ({
  id,
  description,
  type: "DEBIT",
  parentId: null,
  ...overrides,
});

const food = cat(1, "Food");
const delivery = cat(2, "Delivery", { parentId: 1 });
const diningOut = cat(3, "Dining out", { parentId: 1 });
const shopping = cat(4, "Shopping");
const home = cat(5, "Home", { parentId: 4 });
const salary = cat(6, "Salary", { type: "CREDIT" });
const categories = [food, delivery, diningOut, shopping, home, salary];

const httpError = (status: number, message: string) =>
  new AxiosError(message, String(status), undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { message },
  });

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

describe("buildDeleteRequest", () => {
  it("sends a plain delete for a category not known to be in use", () => {
    expect(
      buildDeleteRequest(4, { hasChildren: false, inUse: false, targetId: null }),
    ).toEqual({ id: 4 });
  });

  it("cannot submit an in-use delete without a target", () => {
    expect(
      buildDeleteRequest(4, { hasChildren: false, inUse: true, targetId: null }),
    ).toBeNull();
  });

  it("reassigns to the chosen target for an in-use category", () => {
    expect(
      buildDeleteRequest(4, { hasChildren: false, inUse: true, targetId: 1 }),
    ).toEqual({ id: 4, reassignTo: 1 });
  });

  it("cannot submit while the category has children", () => {
    expect(
      buildDeleteRequest(1, { hasChildren: true, inUse: false, targetId: 4 }),
    ).toBeNull();
  });
});

describe("classifyDeleteError", () => {
  it("reads the children 409", () => {
    expect(
      classifyDeleteError(
        httpError(409, "Category 1 has subcategories. Move or delete them before deleting it."),
      ),
    ).toBe("has-children");
  });

  it("reads the in-use 409", () => {
    expect(
      classifyDeleteError(
        httpError(
          409,
          "Category 4 is in use by 3 transaction(s), 0 item(s) and 1 recurrence definition(s).",
        ),
      ),
    ).toBe("in-use");
  });

  it("ignores other errors", () => {
    expect(classifyDeleteError(httpError(404, "Not found"))).toBeNull();
    expect(classifyDeleteError(new Error("Network"))).toBeNull();
  });
});
