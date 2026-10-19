import { describe, expect, it } from "vitest";
import { maskDate } from "./masks";

describe("maskDate", () => {
  it.each([
    ["", ""],
    ["0", "0"],
    ["01", "01"],
    ["010", "01/0"],
    ["0101", "01/01"],
    ["01012", "01/01/2"],
    ["01012024", "01/01/2024"],
  ])("masks %j as %j", (typed, masked) => {
    expect(maskDate(typed)).toBe(masked);
  });

  it("strips non-digits, so a pasted or re-typed masked date stays the same", () => {
    expect(maskDate("01/01/2024")).toBe("01/01/2024");
    expect(maskDate("a1b2")).toBe("12");
  });

  it("drops digits past the year", () => {
    expect(maskDate("010120249")).toBe("01/01/2024");
  });
});
