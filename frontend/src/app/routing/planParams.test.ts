import { describe, expect, it } from "vitest";
import { parsePlanParam } from "./planParams";

function params(init: Record<string, string>) {
  return new URLSearchParams(init);
}

describe("plan param", () => {
  it("reads the plan id", () => {
    expect(parsePlanParam(params({ plan: "5", q: "market" }))).toBe(5);
  });

  it("returns null for a malformed plan", () => {
    expect(parsePlanParam(params({ plan: "abc" }))).toBeNull();
  });
});
