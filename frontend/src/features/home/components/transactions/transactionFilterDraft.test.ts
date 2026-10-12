import type { FinancialTransactionCategory } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import {
  fromDraft,
  toDraft,
  withDraftCategory,
  type AppliedFilters,
} from "./transactionFilterDraft";

const groceries: FinancialTransactionCategory = {
  id: 12,
  type: "DEBIT",
  description: "Groceries",
};

describe("transaction filter draft mapping", () => {
  it("keeps the category filter when applied before the category name has loaded", () => {
    const applied: AppliedFilters = {
      filter: { categoryId: 12, type: "DEBIT" },
      categoryForDisplay: null,
      memberForDisplay: null,
    };

    expect(fromDraft(toDraft(applied)).filter).toEqual({
      categoryId: 12,
      type: "DEBIT",
    });
  });

  it("removes the category filter when the category is explicitly cleared", () => {
    const applied: AppliedFilters = {
      filter: { categoryId: 12, type: "DEBIT" },
      categoryForDisplay: null,
      memberForDisplay: null,
    };

    const draft = withDraftCategory(toDraft(applied), null);

    expect(fromDraft(draft).filter).toEqual({ type: "DEBIT" });
  });

  it("applies a newly picked category with its display object", () => {
    const draft = withDraftCategory(
      toDraft({ filter: {}, categoryForDisplay: null, memberForDisplay: null }),
      groceries,
    );

    expect(fromDraft(draft)).toEqual({
      filter: { categoryId: 12 },
      categoryForDisplay: groceries,
      memberForDisplay: null,
    });
  });
});
