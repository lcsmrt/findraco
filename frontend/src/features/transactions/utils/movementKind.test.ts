import { describe, expect, it } from "vitest";
import {
  categoryTypeFor,
  hidesItems,
  isNeutralKind,
  kindForType,
  kindsForType,
} from "./movementKind";

describe("movementKind", () => {
  it.each([
    ["TRANSFER", true],
    ["CARD_BILL_PAYMENT", true],
    ["SAVINGS", true],
    ["REPAYMENT", true],
    ["REFUND", false],
    [null, false],
    [undefined, false],
  ] as const)("%s is neutral: %s", (kind, neutral) => {
    expect(isNeutralKind(kind)).toBe(neutral);
  });

  it("offers a refund and a contact payment only on a credit", () => {
    expect(kindsForType("CREDIT")).toEqual(["TRANSFER", "CARD_BILL_PAYMENT", "SAVINGS", "REFUND", "REPAYMENT"]);
    expect(kindsForType("DEBIT")).toEqual(["TRANSFER", "CARD_BILL_PAYMENT", "SAVINGS"]);
  });

  it("drops a refund when the type turns to debit and keeps every other kind", () => {
    expect(kindForType("REFUND", "DEBIT")).toBeNull();
    expect(kindForType("REFUND", "CREDIT")).toBe("REFUND");
    expect(kindForType("REPAYMENT", "DEBIT")).toBeNull();
    expect(kindForType("SAVINGS", "DEBIT")).toBe("SAVINGS");
    expect(kindForType(undefined, "DEBIT")).toBeNull();
  });

  it("puts a refund in an expense category although the row is a credit", () => {
    expect(categoryTypeFor("CREDIT", "REFUND")).toBe("DEBIT");
    expect(categoryTypeFor("CREDIT", null)).toBe("CREDIT");
    expect(categoryTypeFor("DEBIT", undefined)).toBe("DEBIT");
  });

  it("hides the items of a neutral movement and of a refund", () => {
    expect(hidesItems("TRANSFER")).toBe(true);
    expect(hidesItems("REFUND")).toBe(true);
    expect(hidesItems("REPAYMENT")).toBe(true);
    expect(hidesItems(null)).toBe(false);
  });
});
