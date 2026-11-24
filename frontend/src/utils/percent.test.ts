import { describe, expect, it } from "vitest";
import { formatPercent } from "./percent";

describe("formatPercent", () => {
  it('writes 61.8 as "61,8%" in pt-BR', () => {
    expect(formatPercent(61.8, "pt-BR")).toBe("61,8%");
  });

  it('writes 61.8 as "61.8%" in en', () => {
    expect(formatPercent(61.8, "en")).toBe("61.8%");
  });

  it('writes 50 as "50%" in pt-BR', () => {
    expect(formatPercent(50, "pt-BR")).toBe("50%");
  });
});
