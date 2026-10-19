import type { FinancialTransaction } from "@/api/dtos/financialTransaction";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { groupByDay } from "./groupByDay";

function tx(id: number, startDate: string): FinancialTransaction {
  return {
    id,
    type: "DEBIT",
    amount: 10,
    description: `T${id}`,
    startDate,
    endDate: startDate,
    splitMode: "EQUAL",
    participants: [],
    items: [],
  };
}

function shape(groups: ReturnType<typeof groupByDay>) {
  return groups.map((g) => ({ day: g.day, ids: g.transactions.map((t) => t.id) }));
}

// UX-02 AC 4: the narrow Transactions list groups rows by day under a date heading.
describe("groupByDay", () => {
  it("makes one group per calendar day, in the page's order", () => {
    const page = [
      tx(1, "2026-10-12"),
      tx(2, "2026-10-12"),
      tx(3, "2026-10-10"),
      tx(4, "2026-09-30"),
    ];

    expect(shape(groupByDay(page))).toEqual([
      { day: "2026-10-12", ids: [1, 2] },
      { day: "2026-10-10", ids: [3] },
      { day: "2026-09-30", ids: [4] },
    ]);
  });

  it("keeps one group per day when the page order interleaves days (e.g. sorted by amount)", () => {
    const page = [
      tx(1, "2026-10-12"),
      tx(2, "2026-10-01"),
      tx(3, "2026-10-12"),
      tx(4, "2026-10-01"),
      tx(5, "2026-10-05"),
    ];

    expect(shape(groupByDay(page))).toEqual([
      { day: "2026-10-12", ids: [1, 3] },
      { day: "2026-10-01", ids: [2, 4] },
      { day: "2026-10-05", ids: [5] },
    ]);
  });

  it("returns no groups for an empty page", () => {
    expect(groupByDay([])).toEqual([]);
  });

  describe("in a timezone behind UTC", () => {
    const originalTz = process.env.TZ;
    beforeAll(() => {
      process.env.TZ = "America/Sao_Paulo";
    });
    afterAll(() => {
      process.env.TZ = originalTz;
    });

    it("keeps the transaction's own date, with no UTC shift", () => {
      const page = [
        tx(1, "2026-10-01"),
        tx(2, "2026-10-01T00:00:00"),
        tx(3, "2026-09-30"),
      ];

      expect(shape(groupByDay(page))).toEqual([
        { day: "2026-10-01", ids: [1, 2] },
        { day: "2026-09-30", ids: [3] },
      ]);
    });
  });
});
