import { describe, expect, it } from "vitest";
import { currentDestination, DESTINATION_PATHS } from "./navigation";

describe("DESTINATION_PATHS", () => {
  it("serves each destination at its own path (NAV-06 AC 1)", () => {
    expect(DESTINATION_PATHS).toEqual({
      overview: "/overview",
      transactions: "/transactions",
      categories: "/categories",
      plans: "/plans",
    });
  });
});

describe("currentDestination", () => {
  it.each([
    ["/overview", "overview"],
    ["/transactions", "transactions"],
    ["/categories", "categories"],
    ["/plans", "plans"],
  ] as const)("maps %s to %s (NAV-06 AC 1, NAV-01 AC 4)", (pathname, destination) => {
    expect(currentDestination(pathname)).toBe(destination);
  });

  it.each(["/invitation/abc", "/", "/settings"])(
    "maps %s, which is no destination, to null",
    (pathname) => {
      expect(currentDestination(pathname)).toBeNull();
    },
  );

  it("maps a path with a trailing slash to its destination", () => {
    expect(currentDestination("/categories/")).toBe("categories");
  });

  it("maps a nested path to its parent destination", () => {
    expect(currentDestination("/transactions/42")).toBe("transactions");
  });
});
