import type { CategorySpending, CategorySpendingMember, UsageStatus } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import { buildSpendingRows, type SpendingRow } from "./spendingRows";

const LUCAS = 1;
const LIVIA = 2;
const COLORS: Record<number, string> = { [LUCAS]: "blue", [LIVIA]: "pink" };
function colorOf(id: number) {
  return COLORS[id] ?? "grey";
}

type Judged = Pick<CategorySpending, "limit" | "remaining" | "percentUsed" | "status">;

/** A limit as the API judged it for the period: the test states the verdict, it never computes one. */
function judged(limit: number, remaining: number, percentUsed: number, status: UsageStatus): Judged {
  return { limit, remaining, percentUsed, status };
}

/** A limit the API shows without judging it: a former member's entry. */
function shown(limit: number): Judged {
  return { limit, remaining: null, percentUsed: null, status: null };
}

const NO_LIMIT: Judged = { limit: null, remaining: null, percentUsed: null, status: null };

function member(
  memberId: number,
  spent: number,
  verdict: Judged = NO_LIMIT,
  active = true,
): CategorySpendingMember {
  return {
    memberId,
    name: memberId === LUCAS ? "Lucas" : "Livia",
    spent,
    ...verdict,
    active,
  };
}

let nextId = 100;
function category(
  name: string,
  spent: number,
  overrides: Partial<CategorySpending> = {},
): CategorySpending {
  return {
    categoryId: nextId++,
    parentId: null,
    name,
    type: "DEBIT",
    ownerId: null,
    ownerName: null,
    ownerActive: null,
    spent,
    ...NO_LIMIT,
    members: [],
    children: [],
    ...overrides,
  };
}

function build(
  tree: CategorySpending[],
  selectedMember: { id: number; name: string } | null = null,
) {
  return buildSpendingRows({ tree, selectedMember, colorOf });
}

function rowNamed(rows: SpendingRow[], name: string): SpendingRow {
  for (const row of rows) {
    if (row.name === name) return row;
    const child = row.children.find((c) => c.name === name);
    if (child) return child;
  }
  throw new Error(`No row ${name}`);
}

describe("buildSpendingRows: list and status (UX-03)", () => {
  it("lists DEBIT roots and their children alphabetically (AC 1)", () => {
    const { rows } = build([
      category("rent", 0),
      category("Food", 0, {
        children: [category("Restaurants", 0), category("delivery", 0)],
      }),
      category("Salary", 900, { type: "CREDIT" }),
    ]);

    expect(rows.map((r) => r.name)).toEqual(["Food", "rent"]);
    expect(rows[0].children.map((c) => c.name)).toEqual(["delivery", "Restaurants"]);
    expect(rows[0].depth).toBe(0);
    expect(rows[0].children[0].depth).toBe(1);
  });

  it("reads over, warning, ok and none from the API's status (AC 3)", () => {
    const { rows } = build([
      category("Over", 101, judged(100, -1, 101, "OVER")),
      category("AtLimit", 100, judged(100, 0, 100, "WARNING")),
      category("Warning", 80, judged(100, 20, 80, "WARNING")),
      category("Ok", 79, judged(100, 21, 79, "OK")),
      category("NoLimit", 50),
    ]);

    expect(rowNamed(rows, "Over").status).toBe("over");
    expect(rowNamed(rows, "AtLimit").status).toBe("warning");
    expect(rowNamed(rows, "Warning").status).toBe("warning");
    expect(rowNamed(rows, "Ok").status).toBe("ok");
    expect(rowNamed(rows, "NoLimit").status).toBe("none");
  });

  it("gives remaining when within the limit and overBy when over (AC 4)", () => {
    const { rows } = build([
      category("Within", 851, judged(1000, 149, 85.1, "WARNING")),
      category("Over", 1067, judged(1000, -67, 106.7, "OVER")),
    ]);

    expect(rowNamed(rows, "Within")).toMatchObject({ remaining: 149, overBy: null });
    expect(rowNamed(rows, "Over")).toMatchObject({ remaining: null, overBy: 67 });
  });

  it("shows percentages as integers (AC 8)", () => {
    const { rows } = build([category("Groceries", 872.8, judged(1000, 127.2, 87.28, "WARNING"))]);

    expect(rows[0].percent).toBe(87);
  });

  it("treats a zero limit with zero spend as 0% and not over (edge case)", () => {
    const { rows } = build([category("Zero", 0, judged(0, 0, 0, "OK"))]);

    expect(rows[0]).toMatchObject({ status: "ok", percent: 0, overBy: null });
  });

  it("gives a no-limit row no bar (AC 2)", () => {
    const { rows } = build([
      category("Gifts", 300, { members: [member(LUCAS, 300)] }),
    ]);

    expect(rows[0].bar).toBeNull();
    expect(rows[0].limit).toBeNull();
    expect(rows[0].spent).toBe(300);
  });

  it("ticks the limit and sizes the bar to the spend when over (AC 5)", () => {
    const { rows } = build([
      category("Over", 150, { ...judged(100, -50, 150, "OVER"), members: [member(LUCAS, 150)] }),
    ]);

    expect(rows[0].bar?.limitTickPct).toBeCloseTo(66.67, 1);
    expect(rows[0].bar?.segments[0].widthPct).toBe(100);
  });

  it("does not tick the limit when within it", () => {
    const { rows } = build([
      category("Within", 50, { ...judged(100, 50, 50, "OK"), members: [member(LUCAS, 50)] }),
    ]);

    expect(rows[0].bar?.limitTickPct).toBeNull();
    expect(rows[0].bar?.segments[0].widthPct).toBe(50);
  });

  it("expands on load only roots with a child in warning or over (AC 6)", () => {
    const warned = category("Food", 0, {
      children: [category("Delivery", 90, judged(100, 10, 90, "WARNING"))],
    });
    const overChild = category("Home", 0, {
      children: [category("Repairs", 200, judged(100, -100, 200, "OVER"))],
    });
    const calm = category("Leisure", 0, {
      children: [category("Cinema", 10, judged(100, 90, 10, "OK"))],
    });
    const overRootOnly = category("Travel", 500, {
      ...judged(100, -400, 500, "OVER"),
      children: [category("Hotels", 0)],
    });

    const { defaultExpandedIds } = build([warned, overChild, calm, overRootOnly]);

    expect(defaultExpandedIds.sort()).toEqual([warned.categoryId, overChild.categoryId].sort());
  });

  it("shows the limits the API scaled to the period (AC 9)", () => {
    const { rows } = build([
      category("Groceries", 900, {
        ...judged(1200, 300, 75, "OK"),
        members: [
          member(LUCAS, 500, judged(780, 280, 64.1, "OK")),
          member(LIVIA, 400, judged(420, 20, 95.2, "WARNING")),
        ],
      }),
    ]);

    expect(rows[0].limit).toBe(1200);
    expect(rows[0]).toMatchObject({ status: "ok", percent: 75, remaining: 300 });
    expect(rows[0].memberSubRows.map((s) => s.limit)).toEqual([780, 420]);
  });
});

describe("buildSpendingRows: per person (UX-04)", () => {
  it("draws unfiltered segments in member colours summing to the spend, with a member line (AC 3)", () => {
    const { rows } = build([
      category("Groceries", 1745, {
        ...judged(2000, 255, 87.25, "WARNING"),
        members: [member(LUCAS, 1051), member(LIVIA, 694)],
      }),
    ]);
    const segments = rows[0].bar?.segments ?? [];

    expect(segments.map((s) => [s.memberId, s.amount, s.color, s.dimmed])).toEqual([
      [LUCAS, 1051, "blue", false],
      [LIVIA, 694, "pink", false],
    ]);
    expect(segments.reduce((sum, s) => sum + s.amount, 0)).toBe(1745);
    expect(segments.reduce((sum, s) => sum + s.widthPct, 0)).toBeCloseTo(87.25, 2);
    expect(rows[0].memberLine.map((m) => [m.name, m.amount, m.color])).toEqual([
      ["Lucas", 1051, "blue"],
      ["Livia", 694, "pink"],
    ]);
    expect(rows[0].focus).toBeNull();
  });

  it("gives every per-member limit its own sub-row and status (AC 4)", () => {
    const { rows } = build([
      category("Groceries", 400, {
        ...judged(400, 0, 100, "WARNING"),
        members: [
          member(LUCAS, 250, judged(260, 10, 96.15, "WARNING")),
          member(LIVIA, 150, judged(140, -10, 107.14, "OVER")),
        ],
      }),
    ]);
    const [lucas, livia] = rows[0].memberSubRows;

    expect(lucas).toMatchObject({ memberId: LUCAS, spent: 250, limit: 260, status: "warning", remaining: 10, color: "blue" });
    expect(livia).toMatchObject({ memberId: LIVIA, spent: 150, limit: 140, status: "over", overBy: 10, color: "pink" });
    expect(livia.bar?.limitTickPct).toBeCloseTo(93.33, 1);
  });

  it("lists only limit holders as sub-rows and does not evaluate a former member", () => {
    const { rows } = build([
      category("Groceries", 500, {
        ...judged(260, -240, 192.31, "OVER"),
        members: [member(LUCAS, 300, judged(260, -40, 115.38, "OVER")), member(LIVIA, 200, shown(140), false)],
      }),
      category("Market", 100, { ...judged(500, 400, 20, "OK"), members: [member(LUCAS, 100)] }),
    ]);

    expect(rowNamed(rows, "Market").memberSubRows).toEqual([]);
    const former = rowNamed(rows, "Groceries").memberSubRows[1];
    expect(former).toMatchObject({ active: false, status: "none", limit: 140, bar: null });
  });

  it("draws an owned row as one owner segment with an owner pill (AC 5)", () => {
    const { rows } = build([
      category("Professional", 70, {
        ...judged(100, 30, 70, "OK"),
        ownerId: LIVIA,
        ownerName: "Livia",
        ownerActive: true,
        members: [member(LUCAS, 30), member(LIVIA, 70)],
      }),
    ]);

    expect(rows[0].owner).toEqual({ memberId: LIVIA, name: "Livia", color: "pink", active: true });
    expect(rows[0].bar?.segments.map((s) => [s.memberId, s.amount, s.color])).toEqual([
      [LIVIA, 70, "pink"],
    ]);
    expect(rows[0].memberSubRows).toEqual([]);
    expect(rows[0].spent).toBe(70);
  });

  it("shows a selected member's spend against their own limit (AC 6)", () => {
    const { rows } = build(
      [
        category("Groceries", 400, {
          ...judged(400, 0, 100, "WARNING"),
          members: [
            member(LUCAS, 250, judged(260, 10, 96.15, "WARNING")),
            member(LIVIA, 150, judged(140, -10, 107.14, "OVER")),
          ],
        }),
      ],
      { id: LIVIA, name: "Livia" },
    );

    expect(rows[0]).toMatchObject({ spent: 150, limit: 140, status: "over", overBy: 10, focus: null });
    expect(rows[0].bar?.segments.map((s) => [s.memberId, s.amount, s.dimmed])).toEqual([
      [LIVIA, 150, false],
    ]);
  });

  it("keeps the whole-category bar for a selected member without an own limit (AC 7)", () => {
    const { rows } = build(
      [
        category("Groceries", 1745, {
          ...judged(2000, 255, 87.25, "WARNING"),
          members: [member(LUCAS, 1051), member(LIVIA, 694)],
        }),
      ],
      { id: LIVIA, name: "Livia" },
    );

    expect(rows[0]).toMatchObject({ spent: 1745, limit: 2000, status: "warning", remaining: 255 });
    expect(rows[0].focus).toEqual({ memberId: LIVIA, name: "Livia", color: colorOf(LIVIA), spent: 694, of: 1745, sharedLimit: 2000 });
    expect(rows[0].bar?.segments.map((s) => [s.memberId, s.dimmed])).toEqual([
      [LUCAS, true],
      [LIVIA, false],
    ]);
  });

  it("never evaluates a member's share against the whole limit (AC 7)", () => {
    // Livia's 1000 alone would be 50% (ok) of the shared limit; the row reads the whole category: 1700 → 85% (warning).
    const { rows } = build(
      [
        category("Groceries", 1700, {
          ...judged(2000, 300, 85, "WARNING"),
          members: [member(LUCAS, 700), member(LIVIA, 1000)],
        }),
      ],
      { id: LIVIA, name: "Livia" },
    );

    expect(rows[0]).toMatchObject({ spent: 1700, status: "warning", percent: 85, remaining: 300 });
  });

  it("uses the whole category when the selected member's own entry is dormant (AC 7)", () => {
    const { rows } = build(
      [
        category("Groceries", 300, {
          ...judged(260, -40, 115.38, "OVER"),
          members: [member(LUCAS, 100, judged(260, 160, 38.46, "OK")), member(LIVIA, 200, shown(140), false)],
        }),
      ],
      { id: LIVIA, name: "Livia" },
    );

    expect(rows[0]).toMatchObject({ spent: 300, limit: 260, status: "over" });
    expect(rows[0].focus?.spent).toBe(200);
  });

  it("names a selected member with no spend in the category with 0 (AC 7)", () => {
    const { rows } = build(
      [category("Rent", 1500, { ...judged(1500, 0, 100, "WARNING"), members: [member(LUCAS, 1500)] })],
      { id: LIVIA, name: "Livia" },
    );

    expect(rows[0].focus).toEqual({ memberId: LIVIA, name: "Livia", color: colorOf(LIVIA), spent: 0, of: 1500, sharedLimit: 1500 });
  });
});
