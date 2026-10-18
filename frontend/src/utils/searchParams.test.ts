import { describe, expect, it } from "vitest";
import { parseDate, parseId } from "./searchParams";

describe("parseId", () => {
  it("reads a positive integer", () => {
    expect(parseId("12")).toBe(12);
  });

  it.each([null, "abc", "1.5", "-3", "0", "9007199254740993"])(
    "returns null for %s",
    (value) => {
      expect(parseId(value)).toBeNull();
    },
  );
});

describe("parseDate", () => {
  it("reads a yyyy-MM-dd date", () => {
    expect(parseDate("2026-10-01")).toBe("2026-10-01");
  });

  it.each([null, "yesterday", "2026-13-45", "2026-02-30", "2026-1-01"])(
    "returns null for %s",
    (value) => {
      expect(parseDate(value)).toBeNull();
    },
  );
});
