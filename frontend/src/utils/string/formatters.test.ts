import { describe, expect, it } from "vitest";
import { getFirstAndLastInitials, getFirstName } from "./formatters";

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

describe("getFirstAndLastInitials", () => {
  it("takes the first letter of the first and last names, upper-cased", () => {
    expect(getFirstAndLastInitials("lucas martins silva")).toBe("LS");
  });

  it("repeats the initial of a single-word name", () => {
    expect(getFirstAndLastInitials("Ana")).toBe("AA");
  });
});
