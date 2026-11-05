import { describe, expect, it } from "vitest";
import type { Transaction } from "@/api/dtos/transaction";
import {
  confirmTransactionSchema,
  toConfirmFormValues,
  toConfirmPayload,
} from "./confirmTransactionForm";

const pending: Transaction = {
  id: 40,
  permissions: { edit: true, delete: true },
  version: 3,
  type: "DEBIT",
  amount: 200,
  description: "Electricity",
  startDate: "2026-10-10",
  endDate: "2026-10-10",
  seriesId: "s1",
  splitMode: "EQUAL",
  participants: [],
  items: [],
  status: "PENDING",
  requiresConfirmation: true,
};

describe("confirmTransactionForm", () => {
  it("rejects an empty or zero amount", () => {
    const date = new Date(2026, 9, 10);

    for (const amount of [null, 0]) {
      const result = confirmTransactionSchema.safeParse({ amount, date });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]).toMatchObject({
        path: ["amount"],
        message: "transactions.form.amountMustBePositive",
      });
    }
  });

  it("requires a date", () => {
    const result = confirmTransactionSchema.safeParse({ amount: 10, date: undefined });

    expect(result.error?.issues[0]).toMatchObject({
      path: ["date"],
      message: "transactions.form.dateIsRequired",
    });
  });

  it("presets the occurrence's amount and date", () => {
    expect(toConfirmFormValues(pending)).toEqual({ amount: 200, date: new Date(2026, 9, 10) });
  });

  it("sends the edited amount and date with the occurrence's version", () => {
    expect(toConfirmPayload(pending, { amount: 187.4, date: new Date(2026, 9, 12) })).toEqual({
      params: { id: 40 },
      body: { amount: 187.4, startDate: "2026-10-12", version: 3 },
    });
  });
});
