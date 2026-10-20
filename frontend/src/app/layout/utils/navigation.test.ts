import { describe, expect, it } from "vitest";
import { currentDestination } from "./navigation";

describe("currentDestination", () => {
  it("maps a destination's path to it (NAV-06 AC 1, NAV-01 AC 4)", () => {
    expect(currentDestination("/transactions")).toBe("transactions");
  });

  it("maps a path that is no destination to null", () => {
    expect(currentDestination("/invitation/abc")).toBeNull();
  });

  it("maps a path with a trailing slash to its destination", () => {
    expect(currentDestination("/categories/")).toBe("categories");
  });

  it("maps a nested path to its parent destination", () => {
    expect(currentDestination("/transactions/42")).toBe("transactions");
  });
});
