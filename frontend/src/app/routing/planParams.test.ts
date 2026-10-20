import { describe, expect, it } from "vitest";
import { parsePlanParam } from "./planParams";

function params(init: Record<string, string>) {
  return new URLSearchParams(init);
}

describe("plan param", () => {
  it("reads the plan id", () => {
    expect(parsePlanParam(params({ plan: "5", q: "market" }))).toBe(5);
  });

  const malformed: Record<string, string>[] = [
    {},
    { plan: "abc" },
    { plan: "0" },
    { plan: "1.5" },
  ];

  it.each(malformed)(
    "returns null for a missing or malformed plan %o",
    (init) => {
      expect(parsePlanParam(params(init))).toBeNull();
    },
  );
});
