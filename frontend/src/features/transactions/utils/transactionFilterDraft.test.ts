import type { Category } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import {
  fromDraft,
  toDraft,
  withDraftCategory,
  withDraftMember,
  type AppliedFilters,
} from "./transactionFilterDraft";

const groceries: Category = {
  id: 12,
  version: 0,
  type: "DEBIT",
  description: "Groceries",
};

describe("transaction filter draft mapping", () => {
  it("keeps the category and member filters when applied before their display objects have loaded", () => {
    const applied: AppliedFilters = {
      filter: { categoryId: 12, memberId: 7, type: "DEBIT" },
      categoryForDisplay: null,
      memberForDisplay: null,
    };

    expect(fromDraft(toDraft(applied)).filter).toEqual({
      categoryId: 12,
      memberId: 7,
      type: "DEBIT",
    });
  });

  it("removes the category and member filters when each is explicitly cleared", () => {
    const applied: AppliedFilters = {
      filter: { categoryId: 12, memberId: 7, type: "DEBIT" },
      categoryForDisplay: null,
      memberForDisplay: null,
    };

    const draft = withDraftMember(withDraftCategory(toDraft(applied), null), null);

    expect(fromDraft(draft).filter).toEqual({ type: "DEBIT" });
  });

  it("applies a newly picked category and member with their display objects", () => {
    const ana = { id: 7, name: "Ana" };
    const draft = withDraftMember(
      withDraftCategory(toDraft({ filter: {}, categoryForDisplay: null, memberForDisplay: null }), groceries),
      ana,
    );

    expect(fromDraft(draft)).toEqual({
      filter: { categoryId: 12, memberId: 7 },
      categoryForDisplay: groceries,
      memberForDisplay: ana,
    });
  });

  it("holds the applied amount bounds as numbers in reais (STD-06 AC 4)", () => {
    const draft = toDraft({
      filter: { amountMin: 50, amountMax: 200.5 },
      categoryForDisplay: null,
      memberForDisplay: null,
    });

    expect(draft.amountMin).toBe(50);
    expect(draft.amountMax).toBe(200.5);
  });

  it("holds null for an amount bound that is not applied (STD-06 AC 4)", () => {
    const draft = toDraft({ filter: {}, categoryForDisplay: null, memberForDisplay: null });

    expect(draft.amountMin).toBeNull();
    expect(draft.amountMax).toBeNull();
  });

  it("applies the typed amount bounds as numbers (STD-06 AC 4)", () => {
    const draft = toDraft({ filter: {}, categoryForDisplay: null, memberForDisplay: null });

    expect(fromDraft({ ...draft, amountMin: 12.34, amountMax: 1500 }).filter).toEqual({
      amountMin: 12.34,
      amountMax: 1500,
    });
  });

  it("applies one bound alone and drops an emptied one (STD-06 AC 4)", () => {
    const draft = toDraft({
      filter: { amountMin: 50, amountMax: 200 },
      categoryForDisplay: null,
      memberForDisplay: null,
    });

    expect(fromDraft({ ...draft, amountMax: null }).filter).toEqual({ amountMin: 50 });
    expect(fromDraft({ ...draft, amountMin: null }).filter).toEqual({ amountMax: 200 });
  });

  it("neither drafts nor applies the period dates (PNAV-02 AC 1)", () => {
    const draft = toDraft({
      filter: { startDateFrom: "2026-10-01", startDateTo: "2026-10-31" },
      categoryForDisplay: null,
      memberForDisplay: null,
    });

    expect(draft).not.toHaveProperty("dateRange");
    expect(fromDraft(draft).filter).toEqual({});
  });

  it("holds the 'all' type and applies nothing when no filter is applied", () => {
    const draft = toDraft({ filter: {}, categoryForDisplay: null, memberForDisplay: null });

    expect(draft.type).toBe("ALL");
    expect(fromDraft(draft).filter).toEqual({});
  });
});
