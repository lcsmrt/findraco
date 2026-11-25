import { describe, expect, it } from "vitest";
import type { ContactStatement, ContactStatementShare } from "@/api/dtos";
import { allocationExcess, openAllocationRows, withAllocations, withSuggestion } from "./allocationRows";

function share(overrides: Partial<ContactStatementShare>): ContactStatementShare {
  return {
    participantId: 1,
    transactionId: 1,
    date: "2026-10-05",
    description: "Market",
    share: 200,
    allocated: 0,
    status: "OPEN",
    ...overrides,
  };
}

const mae = { id: 7, name: "Mãe", archived: false, owed: 0, credit: 0, version: 0 };

// November is listed first, as the API sends it; inside a month the shares run oldest first.
const statement: ContactStatement = {
  contact: mae,
  owed: 0,
  credit: 0,
  months: [
    {
      month: "2026-11",
      repayments: [],
      shares: [
        share({ participantId: 3, date: "2026-11-02", description: "Pharmacy", share: 50, status: "PLANNED" }),
        share({ participantId: 2, date: "2026-11-10", description: "Dinner", share: 300, allocated: 100, status: "PARTIAL" }),
      ],
    },
    {
      month: "2026-10",
      repayments: [],
      shares: [
        share({ participantId: 1, date: "2026-10-05", description: "Market", share: 200 }),
        share({ participantId: 4, date: "2026-10-20", description: "Gas", share: 80, allocated: 80, status: "PAID" }),
      ],
    },
  ],
};

describe("openAllocationRows", () => {
  it("lists the shares with something open, oldest first, with their open amount", () => {
    expect(openAllocationRows(statement, []).map((row) => [row.participantId, row.description, row.open])).toEqual([
      [1, "Market", 200],
      [2, "Dinner", 200],
    ]);
  });

  it("gives back to an edited payment what it already settles, a paid share included", () => {
    const rows = openAllocationRows(statement, [{ participantId: 4, transactionId: 9, amount: 80 }, { participantId: 2, transactionId: 9, amount: 100 }]);

    expect(rows.map((row) => [row.participantId, row.open])).toEqual([
      [1, 200],
      [4, 80],
      [2, 300],
    ]);
  });

  it("lists nothing before the statement is there", () => {
    expect(openAllocationRows(undefined, [])).toEqual([]);
  });
});

describe("withSuggestion and withAllocations", () => {
  it("ticks the oldest rows up to the amount and unticks the rest", () => {
    const rows = withSuggestion(openAllocationRows(statement, []), 300);

    expect(rows.map((row) => [row.participantId, row.checked, row.amount])).toEqual([
      [1, true, 200],
      [2, true, 100],
    ]);
    expect(withSuggestion(rows, 100).map((row) => [row.checked, row.amount])).toEqual([
      [true, 100],
      [false, null],
    ]);
  });

  it("ticks the shares an edited payment settles, at the amounts it settles them", () => {
    const own = [{ participantId: 2, transactionId: 9, amount: 100 }];

    const rows = withAllocations(openAllocationRows(statement, own), own);

    expect(rows.map((row) => [row.participantId, row.checked, row.amount])).toEqual([
      [1, false, null],
      [2, true, 100],
    ]);
  });
});

describe("allocationExcess", () => {
  it("is what the payment holds beyond the ticked amounts, never negative", () => {
    const rows = withSuggestion(openAllocationRows(statement, []), 300);

    expect(allocationExcess(600, rows)).toBe(300);
    expect(allocationExcess(300, rows)).toBe(0);
    expect(allocationExcess(100, rows)).toBe(0);
    expect(allocationExcess(null, rows)).toBe(0);
  });
});
