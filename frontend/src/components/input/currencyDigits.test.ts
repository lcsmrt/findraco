import { describe, expect, it } from "vitest";
import { MAX_CURRENCY_DIGITS, parseCurrencyDigits } from "./currencyDigits";

describe("parseCurrencyDigits", () => {
  it.each([
    ["1", 0.01],
    ["12", 0.12],
    ["123", 1.23],
    ["1234", 12.34],
  ])("enters %s from the right as cents: %s (STD-06 AC 4)", (typed, expected) => {
    expect(parseCurrencyDigits(typed)).toBe(expected);
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
    ["only zeros", "R$\u00a00,0"],
  ])("returns null for %s (STD-06 AC 4)", (_label, typed) => {
    expect(parseCurrencyDigits(typed)).toBeNull();
  });
});
