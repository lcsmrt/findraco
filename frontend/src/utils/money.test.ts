import { describe, expect, it } from "vitest";
import { formatMoney, MONEY_CURRENCY, MONEY_LOCALE, toCents } from "./money";

// pt-BR separates the symbol (and the compact suffix) with a non-breaking space, U+00A0.
const NBSP = " ";

describe("money locale and currency", () => {
  it("come from one source, pt-BR and BRL today (STD-06 AC 6)", () => {
    expect(MONEY_LOCALE).toBe("pt-BR");
    expect(MONEY_CURRENCY).toBe("BRL");
  });
});

describe("formatMoney", () => {
  it.each([
    [12.34, `R$${NBSP}12,34`],
    [0, `R$${NBSP}0,00`],
    [1234567.89, `R$${NBSP}1.234.567,89`],
    [12.5, `R$${NBSP}12,50`],
  ])("formats %s as %j (STD-06 AC 6)", (value, expected) => {
    expect(formatMoney(value)).toBe(expected);
  });

  it("prefixes a negative value with a minus sign (STD-06 AC 6)", () => {
    expect(formatMoney(-12.34)).toBe(`-R$${NBSP}12,34`);
  });

  it.each([
    [0, `R$${NBSP}0`],
    [1500, `R$${NBSP}1,5${NBSP}mil`],
    [2000000, `R$${NBSP}2${NBSP}mi`],
    [-1500, `-R$${NBSP}1,5${NBSP}mil`],
  ])("formats the chart axis value %s compactly as %j (STD-06 AC 6)", (value, expected) => {
    expect(formatMoney(value, { compact: true })).toBe(expected);
  });

  it("keeps the full form when compact is false (STD-06 AC 6)", () => {
    expect(formatMoney(1500, { compact: false })).toBe(`R$${NBSP}1.500,00`);
  });
});

describe("toCents", () => {
  it("turns a float-prone sum into exact cents (STD-06 AC 6)", () => {
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents(0.1 + 0.2)).toBe(toCents(0.3));
  });

  it.each([
    [19.99, 1999],
    [12.34, 1234],
    [-12.34, -1234],
    [0, 0],
  ])("converts %s reais to %s cents (STD-06 AC 6)", (value, expected) => {
    expect(toCents(value)).toBe(expected);
  });
});
