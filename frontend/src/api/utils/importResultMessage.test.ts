import { describe, expect, it } from "vitest";
import { importResultMessage } from "./importResultMessage";

describe("importResultMessage", () => {
  it("counts what was stored, and what was skipped as already there", () => {
    expect(importResultMessage({ imported: 12, skippedDuplicates: 0 })).toBe(
      "Imported 12 transactions.",
    );
    expect(importResultMessage({ imported: 1, skippedDuplicates: 3 })).toBe(
      "Imported 1 transaction; 3 already in the plan were skipped.",
    );
  });

  it("says so when nothing was new or the file was empty", () => {
    expect(importResultMessage({ imported: 0, skippedDuplicates: 1 })).toBe(
      "Nothing new to import: 1 transaction already in the plan.",
    );
    expect(importResultMessage({ imported: 0, skippedDuplicates: 0 })).toBe(
      "The file has no transactions.",
    );
  });
});
