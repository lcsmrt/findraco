import { describe, expect, it } from "vitest";
import { FinancialTransaction } from "@/api/dtos/financialTransaction";
import {
  TransactionFormOutput,
  TransactionFormValues,
  buildDefaultValues,
  categoryAttribution,
  itemsRemainderCents,
  ownerDefaultAttribution,
  toPayload,
  transactionFormSchema,
} from "./transactionForm";
import type { PlanMember } from "@/api/dtos/plan";

const validValues: TransactionFormOutput = {
  type: "DEBIT",
  description: "Groceries",
  amount: 100,
  category: { id: 1, type: "DEBIT", description: "Food", spendingLimit: null },
  date: new Date(2026, 6, 1),
  recurring: false,
  seriesEdit: false,
  attributionMode: "ME",
  splitMode: "EQUAL",
  participants: [],
  items: [],
};

const baseTransaction: FinancialTransaction = {
  id: 42,
  type: "DEBIT",
  amount: 150.5,
  description: "Rent",
  startDate: "2026-07-01T00:00:00.000Z",
  endDate: "2026-07-01T00:00:00.000Z",
  splitMode: "EQUAL",
  participants: [],
  items: [
    {
      id: 1,
      description: "Base rent",
      amount: 150.5,
      quantity: 1,
    },
  ],
};

describe("transactionFormSchema — plain transaction validation", () => {
  it("accepts a fully valid transaction", () => {
    const result = transactionFormSchema.safeParse(validValues);
    expect(result.success).toBe(true);
  });

  it("rejects an empty description", () => {
    const result = transactionFormSchema.safeParse({
      ...validValues,
      description: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.find((i) => i.path[0] === "description")
          ?.message,
      ).toBe("Description is required");
    }
  });

  it("rejects a zero amount", () => {
    const result = transactionFormSchema.safeParse({
      ...validValues,
      amount: 0,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.find((i) => i.path[0] === "amount")?.message,
      ).toBe("Amount must be positive");
    }
  });

  it("rejects an empty amount (STD-06 AC 4)", () => {
    const result = transactionFormSchema.safeParse({ ...validValues, amount: null });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.find((i) => i.path[0] === "amount")?.message).toBe(
        "Amount must be positive",
      );
    }
  });

  it("rejects an item with an empty amount (STD-06 AC 4)", () => {
    const result = transactionFormSchema.safeParse({
      ...validValues,
      items: [{ description: "Snacks", amount: null }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.find((i) => i.path.join(".") === "items.0.amount")?.message).toBe(
        "Amount must be positive",
      );
    }
  });

  it("compares items with the total in cents, so float drift does not exceed it (STD-06 AC 4)", () => {
    const result = transactionFormSchema.safeParse({
      ...validValues,
      amount: 0.3,
      items: [
        { description: "Item 1", amount: 0.1 },
        { description: "Item 2", amount: 0.2 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("accepts EXACT shares that add up to the total in cents (STD-06 AC 4)", () => {
    const result = transactionFormSchema.safeParse({
      ...validValues,
      amount: 0.3,
      attributionMode: "SPLIT",
      splitMode: "EXACT",
      participants: [
        { memberId: 1, memberName: "Alice", shareAmount: 0.1 },
        { memberId: 2, memberName: "Bob", shareAmount: 0.2 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a missing date", () => {
    const withoutDate: Record<string, unknown> = { ...validValues };
    delete withoutDate.date;
    const result = transactionFormSchema.safeParse(withoutDate);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.find((i) => i.path[0] === "date")?.message,
      ).toBe("Date is required");
    }
  });

  it("rejects items whose total exceeds the transaction amount", () => {
    const result = transactionFormSchema.safeParse({
      ...validValues,
      amount: 100,
      items: [
        { description: "Item 1", amount: 60 },
        { description: "Item 2", amount: 60 },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.find((i) => i.path[0] === "items")?.message,
      ).toBe("Items cannot exceed the transaction total");
    }
  });

  it("rejects EXACT split shares that don't add up to the total", () => {
    const result = transactionFormSchema.safeParse({
      ...validValues,
      amount: 100,
      attributionMode: "SPLIT",
      splitMode: "EXACT",
      participants: [
        { memberId: 1, memberName: "Alice", shareAmount: 30 },
        { memberId: 2, memberName: "Bob", shareAmount: 30 },
      ],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.find((i) => i.path[0] === "participants")
          ?.message,
      ).toBe("Shares must add up to the total amount");
    }
  });
});

describe("buildDefaultValues — plain transaction", () => {
  it("returns create-mode defaults when no transaction is given", () => {
    const defaults = buildDefaultValues(undefined, 7, undefined);

    expect(defaults.type).toBe("DEBIT");
    expect(defaults.description).toBe("");
    expect(defaults.amount).toBeNull();
    expect(defaults.category).toBeNull();
    expect(defaults.recurring).toBe(false);
    expect(defaults.seriesEdit).toBe(false);
    expect(defaults.attributionMode).toBe("ME");
    expect(defaults.splitMode).toBe("EQUAL");
    expect(defaults.participants).toEqual([]);
    expect(defaults.items).toEqual([]);
  });

  it("maps an existing transaction (non-series edit) into edit-mode defaults", () => {
    const defaults = buildDefaultValues(baseTransaction, 99, undefined);

    expect(defaults.description).toBe("Rent");
    expect(defaults.amount).toBe(150.5);
    expect(defaults.seriesEdit).toBe(false);
    expect(defaults.recurrenceMode).toBeUndefined();
    expect(defaults.attributionMode).toBe("ME");
    expect(defaults.participants).toEqual([]);
    expect(defaults.items).toEqual([
      { description: "Base rent", amount: 150.5, category: null },
    ]);
    expect(defaults.date).toEqual(new Date(2026, 6, 1));
  });
});

describe("toPayload — plain transaction", () => {
  it("maps form values into the create/update request body", () => {
    const body = toPayload(validValues, false, undefined);

    expect(body).toEqual({
      type: "DEBIT",
      description: "Groceries",
      amount: 100,
      categoryId: 1,
      startDate: "2026-07-01",
      splitMode: undefined,
      participants: undefined,
      items: [],
    });
  });

  it("includes attribution when showAttribution is true", () => {
    const body = toPayload(validValues, true, 7);

    expect(body.participants).toEqual([{ memberId: 7 }]);
    expect(body.splitMode).toBe("EQUAL");
  });

  it("sends EXACT shares as the numbers the form holds (STD-06 AC 4)", () => {
    const body = toPayload(
      {
        ...validValues,
        attributionMode: "SPLIT",
        splitMode: "EXACT",
        participants: [
          { memberId: 1, memberName: "Alice", shareAmount: 30.25 },
          { memberId: 2, memberName: "Bob", shareAmount: 69.75 },
        ],
      },
      true,
      1,
    );

    expect(body.participants).toEqual([
      { memberId: 1, shareAmount: 30.25 },
      { memberId: 2, shareAmount: 69.75 },
    ]);
    expect(body.splitMode).toBe("EXACT");
  });

  it("maps items with converted amounts and category ids", () => {
    const body = toPayload(
      {
        ...validValues,
        items: [
          {
            description: "Snacks",
            amount: 25,
            category: { id: 5, type: "DEBIT", description: "Food" },
          },
        ],
      },
      false,
      undefined,
    );

    expect(body.items).toEqual([
      { description: "Snacks", amount: 25, categoryId: 5 },
    ]);
  });
});

describe("edit-mode reset — plain transaction", () => {
  it("resets away from create-mode defaults once an existing transaction is provided", () => {
    const createDefaults = buildDefaultValues(undefined, 99, undefined);
    expect(createDefaults.description).toBe("");
    expect(createDefaults.amount).toBeNull();

    const editDefaults = buildDefaultValues(baseTransaction, 99, undefined);
    expect(editDefaults.description).toBe("Rent");
    expect(editDefaults.amount).toBe(150.5);
    expect(editDefaults).not.toEqual(createDefaults);
  });
});

describe("ownerDefaultAttribution — owned category default participant (CAT-17)", () => {
  const me: PlanMember = { userId: 1, name: "Lucas", email: "l@x.com", role: "OWNER" };
  const partner: PlanMember = { userId: 2, name: "Livia", email: "v@x.com", role: "EDITOR" };
  const members = [me, partner];

  it("sets another member who owns the category as the single 100% participant", () => {
    const attribution = ownerDefaultAttribution({
      category: { ownerId: 2 },
      members,
      currentUserId: 1,
      participantsTouched: false,
    });
    expect(attribution).toEqual({
      attributionMode: "SOMEONE",
      splitMode: "EQUAL",
      participants: [{ memberId: 2, memberName: "Livia", shareAmount: null }],
    });
    expect(
      toPayload({ ...validValues, ...attribution! }, true, 1).participants,
    ).toEqual([{ memberId: 2 }]);
  });

  it("attributes to the current user when they own the category", () => {
    const attribution = ownerDefaultAttribution({
      category: { ownerId: 1 },
      members,
      currentUserId: 1,
      participantsTouched: false,
    });
    expect(attribution).toEqual({ attributionMode: "ME", splitMode: "EQUAL", participants: [] });
    const splitBefore: TransactionFormOutput = { ...validValues, attributionMode: "SPLIT" };
    expect(toPayload({ ...splitBefore, ...attribution! }, true, 1).participants).toEqual([
      { memberId: 1 },
    ]);
  });

  it("is not applied after a manual participant edit", () => {
    expect(
      ownerDefaultAttribution({
        category: { ownerId: 2 },
        members,
        currentUserId: 1,
        participantsTouched: true,
      }),
    ).toBeNull();
  });

  it("has no owner attribution for an unowned category", () => {
    expect(
      ownerDefaultAttribution({
        category: { ownerId: null },
        members,
        currentUserId: 1,
        participantsTouched: false,
      }),
    ).toBeNull();
    expect(
      ownerDefaultAttribution({ category: null, members, currentUserId: 1, participantsTouched: false }),
    ).toBeNull();
  });

  it("is not applied when the owner is no longer a member of the plan", () => {
    expect(
      ownerDefaultAttribution({
        category: { ownerId: 3 },
        members,
        currentUserId: 1,
        participantsTouched: false,
      }),
    ).toBeNull();
  });
});

describe("categoryAttribution — participants follow the selected category (CAT-17, P3 AC 6)", () => {
  const me: PlanMember = { userId: 1, name: "Lucas", email: "l@x.com", role: "OWNER" };
  const partner: PlanMember = { userId: 2, name: "Livia", email: "v@x.com", role: "EDITOR" };
  const third: PlanMember = { userId: 4, name: "Rafa", email: "r@x.com", role: "EDITOR" };
  const members = [me, partner, third];
  const pick = ({ attributionMode, splitMode, participants }: TransactionFormValues) => ({
    attributionMode,
    splitMode,
    participants,
  });
  const createDefaults = pick(buildDefaultValues(undefined, 1, undefined));

  /** Applies a category selection to the form's attribution like the drawer does. */
  const select = (
    current: ReturnType<typeof pick>,
    ownerId: number | null | undefined,
    {
      mode = "create",
      defaults = createDefaults,
      participantsTouched = false,
    }: {
      mode?: "create" | "edit" | "duplicate";
      defaults?: ReturnType<typeof pick>;
      participantsTouched?: boolean;
    } = {},
  ) =>
    categoryAttribution({
      mode,
      defaults,
      category: ownerId === undefined ? null : { ownerId },
      members,
      currentUserId: 1,
      participantsTouched,
    }) ?? current;

  const livia = {
    attributionMode: "SOMEONE",
    splitMode: "EQUAL",
    participants: [{ memberId: 2, memberName: "Livia", shareAmount: null }],
  };

  it("sets the owner of an owned category at 100%", () => {
    expect(select(createDefaults, 2)).toEqual(livia);
  });

  it("restores the default participants when an unowned category replaces an owned one", () => {
    const owned = select(createDefaults, 2);
    expect(select(owned, null)).toEqual({ attributionMode: "ME", splitMode: "EQUAL", participants: [] });
  });

  it("restores the default participants when the category is cleared", () => {
    expect(select(select(createDefaults, 2), undefined)).toEqual(createDefaults);
  });

  it("restores the default participants when the new category's owner is a former member", () => {
    expect(select(select(createDefaults, 2), 3)).toEqual(createDefaults);
  });

  it("switches to the new owner when another owned category is selected", () => {
    expect(select(select(createDefaults, 2), 4)).toEqual({
      attributionMode: "SOMEONE",
      splitMode: "EQUAL",
      participants: [{ memberId: 4, memberName: "Rafa", shareAmount: null }],
    });
  });

  it("restores the duplicated transaction's participants as the default when duplicating", () => {
    const duplicated: FinancialTransaction = {
      ...baseTransaction,
      participants: [{ id: 4, name: "Rafa", shareAmount: 150.5 }],
    };
    const defaults = pick(buildDefaultValues(duplicated, 1, undefined));
    const owned = select(defaults, 2, { mode: "duplicate", defaults });
    expect(owned).toEqual(livia);
    expect(select(owned, null, { mode: "duplicate", defaults })).toEqual({
      attributionMode: "SOMEONE",
      splitMode: "EQUAL",
      participants: [{ memberId: 4, memberName: "Rafa", shareAmount: 150.5 }],
    });
  });

  it("changes nothing after a manual participant edit", () => {
    const manual = {
      attributionMode: "SPLIT" as const,
      splitMode: "EQUAL" as const,
      participants: [
        { memberId: 1, memberName: "Lucas", shareAmount: null },
        { memberId: 4, memberName: "Rafa", shareAmount: null },
      ],
    };
    expect(select(manual, 2, { participantsTouched: true })).toBe(manual);
    expect(select(manual, null, { participantsTouched: true })).toBe(manual);
  });

  it("never changes the participants in edit mode", () => {
    const editing = pick(buildDefaultValues(baseTransaction, 1, undefined));
    expect(select(editing, 2, { mode: "edit", defaults: editing })).toBe(editing);
    expect(select(editing, null, { mode: "edit", defaults: createDefaults })).toBe(editing);
  });
});

describe("itemsRemainderCents — what the items leave of the total (STD-07 AC 3)", () => {
  it("is the total minus the items, in cents", () => {
    expect(itemsRemainderCents(100, [{ amount: 30.25 }, { amount: 19.75 }])).toBe(5000);
  });

  it("is negative when the items exceed the total", () => {
    expect(itemsRemainderCents(10, [{ amount: 20 }])).toBe(-1000);
  });

  it("counts empty amounts as nothing", () => {
    expect(itemsRemainderCents(null, [{ amount: 2.5 }, { amount: null }])).toBe(-250);
  });

  it("sums in cents, so float drift leaves no remainder", () => {
    expect(itemsRemainderCents(0.3, [{ amount: 0.1 }, { amount: 0.2 }])).toBe(0);
  });
});
