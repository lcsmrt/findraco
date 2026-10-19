import type { FinancialTransactionCategory } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import {
  fromDraft,
  toDraft,
  withDraftCategory,
  withDraftMember,
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

  it("keeps the member filter when applied before the plan members have loaded", () => {
    const applied: AppliedFilters = {
      filter: { memberId: 7, type: "DEBIT" },
      categoryForDisplay: null,
      memberForDisplay: null,
    };

    expect(fromDraft(toDraft(applied)).filter).toEqual({
      memberId: 7,
      type: "DEBIT",
    });
  });

  it("removes the member filter when the member is explicitly cleared", () => {
    const applied: AppliedFilters = {
      filter: { memberId: 7, type: "DEBIT" },
      categoryForDisplay: null,
      memberForDisplay: null,
    };

    const draft = withDraftMember(toDraft(applied), null);

    expect(fromDraft(draft).filter).toEqual({ type: "DEBIT" });
  });

  it("applies a newly picked member with its display object", () => {
    const ana = { id: 7, name: "Ana" };
    const draft = withDraftMember(
      toDraft({ filter: {}, categoryForDisplay: null, memberForDisplay: null }),
      ana,
    );

    expect(fromDraft(draft)).toEqual({
      filter: { memberId: 7 },
      categoryForDisplay: null,
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

  it("opens the applied date range as calendar days and applies it back as ISO dates", () => {
    const draft = toDraft({
      filter: { startDateFrom: "2026-10-01", startDateTo: "2026-10-31" },
      categoryForDisplay: null,
      memberForDisplay: null,
    });

    expect(draft.dateRange).toEqual({ from: new Date(2026, 9, 1), to: new Date(2026, 9, 31) });
    expect(fromDraft(draft).filter).toEqual({ startDateFrom: "2026-10-01", startDateTo: "2026-10-31" });
  });

  it("keeps a range with only an end date, and one with only a start date", () => {
    const untilEnd = toDraft({ filter: { startDateTo: "2026-10-31" }, categoryForDisplay: null, memberForDisplay: null });
    const fromStart = toDraft({ filter: { startDateFrom: "2026-10-01" }, categoryForDisplay: null, memberForDisplay: null });

    expect(untilEnd.dateRange).toEqual({ from: undefined, to: new Date(2026, 9, 31) });
    expect(fromDraft(untilEnd).filter).toEqual({ startDateTo: "2026-10-31" });
    expect(fromStart.dateRange).toEqual({ from: new Date(2026, 9, 1), to: undefined });
    expect(fromDraft(fromStart).filter).toEqual({ startDateFrom: "2026-10-01" });
  });

  it("holds no range and the 'all' type when neither is applied, and applies neither", () => {
    const draft = toDraft({ filter: {}, categoryForDisplay: null, memberForDisplay: null });

    expect(draft.dateRange).toBeUndefined();
    expect(draft.type).toBe("ALL");
    expect(fromDraft(draft).filter).toEqual({});
  });
});
