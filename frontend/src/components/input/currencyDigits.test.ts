import { describe, expect, it } from "vitest";
import { MAX_CURRENCY_DIGITS, parseCurrencyDigits } from "./currencyDigits";

describe("parseCurrencyDigits", () => {
  it("enters digits from the right as cents (STD-06 AC 4)", () => {
    expect(parseCurrencyDigits("1234")).toBe(12.34);
  });

  it("reads the next keystroke on the formatted display (STD-06 AC 4)", () => {
    expect(parseCurrencyDigits("R$\u00a01,234")).toBe(12.34);
  });

  it("drops the last digit when backspace removes it from the display (STD-06 AC 4)", () => {
    expect(parseCurrencyDigits("R$\u00a012,3")).toBe(1.23);
  });

  it.each([
    ["letters", "1a2b3c4", 12.34],
    ["symbols and spaces", "-1 2.3,4!", 12.34],
  ])("ignores %s (STD-06 AC 5)", (_label, typed, expected) => {
    expect(parseCurrencyDigits(typed)).toBe(expected);
  });

  it("reads a pasted formatted amount (STD-06 AC 5)", () => {
    expect(parseCurrencyDigits("R$ 12,34")).toBe(12.34);
  });

  it(`keeps at most ${MAX_CURRENCY_DIGITS} digits (STD-06 AC 4)`, () => {
    expect(MAX_CURRENCY_DIGITS).toBe(15);
    expect(parseCurrencyDigits("1234567890123456")).toBe(1234567890123.45);
    expect(parseCurrencyDigits("999999999999999")).toBe(9999999999999.99);
  });

  it.each([
    ["an empty string", ""],
    ["only non-digits", "R$ ,"],
  ])("returns null for %s (STD-06 AC 4)", (_label, typed) => {
    expect(parseCurrencyDigits(typed)).toBeNull();
  });

  it("keeps a typed zero: zero is a value, not empty (STD-06 AC 4)", () => {
    expect(parseCurrencyDigits("0")).toBe(0);
  });

  it("returns null when a deletion leaves only the display's zero padding (STD-06 AC 4)", () => {
    // Backspace on R$ 0,01 or on R$ 0,00 both leave "R$ 0,0".
    expect(parseCurrencyDigits("R$\u00a00,0", { deleting: true })).toBeNull();
  });

  it("keeps the remaining digits when a deletion leaves some (STD-06 AC 4)", () => {
    expect(parseCurrencyDigits("R$\u00a00,1", { deleting: true })).toBe(0.01);
    expect(parseCurrencyDigits("R$\u00a010,0", { deleting: true })).toBe(1);
  });
});
