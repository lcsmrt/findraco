import { describe, expect, it } from "vitest";
import { getFirstName } from "./formatters";

describe("getFirstName", () => {
  it("returns the first word of a full name", () => {
    expect(getFirstName("Livia Vitória Bernardes Pereira Xavier")).toBe("Livia");
  });

  it("ignores surrounding and repeated whitespace", () => {
    expect(getFirstName("  Lucas   Silva ")).toBe("Lucas");
  });

  it("keeps a single-word name", () => {
    expect(getFirstName("Partner")).toBe("Partner");
  });
});
