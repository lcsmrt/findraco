import { describe, expect, it } from "vitest";
import { formatDate, getFirstAndLastInitials, getFirstName } from "./formatters";

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

describe("formatDate", () => {
  it("formats a stored date by its calendar day, ignoring the time and timezone", () => {
    expect(formatDate("2026-10-31T23:30:00.000Z", "dd/MM/yyyy")).toBe("31/10/2026");
    expect(formatDate("2026-10-01", "EEE, d MMM yyyy")).toBe("Thu, 1 Oct 2026");
  });

  it("formats a Date object as it is", () => {
    expect(formatDate(new Date(2026, 9, 5), "dd/MM/yyyy")).toBe("05/10/2026");
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
