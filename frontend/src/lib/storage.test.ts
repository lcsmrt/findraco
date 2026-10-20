import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { clearSessionStorage, getItemFromStorage } from "./storage";

// Theme key owned by app/providers/ThemeProvider.tsx
const THEME_KEY = "findraco-theme";

beforeEach(() => localStorage.clear());

describe("clearSessionStorage", () => {
  it("removes the auth keys", () => {
    localStorage.setItem("hasSession", "true");
    localStorage.setItem("user", '{"id":1}');
    localStorage.setItem("activePlanId", "10");

    clearSessionStorage();

    expect(localStorage.getItem("hasSession")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("activePlanId")).toBeNull();
  });

  it("keeps saved filters and the theme choice", () => {
    localStorage.setItem("hasSession", "true");
    localStorage.setItem("filters:transactions:1:10", "plan=10&q=market");
    localStorage.setItem("filters:overview:1:11", "plan=11");
    localStorage.setItem(THEME_KEY, "dark");

    clearSessionStorage();

    expect(localStorage.getItem("filters:transactions:1:10")).toBe(
      "plan=10&q=market",
    );
    expect(localStorage.getItem("filters:overview:1:11")).toBe("plan=11");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });
});

describe("getItemFromStorage", () => {
  it("returns the stored value when it matches the schema", () => {
    localStorage.setItem("activePlanId", "10");

    expect(getItemFromStorage("activePlanId", z.number())).toBe(10);
  });

  it("returns null when the key is missing", () => {
    expect(getItemFromStorage("activePlanId", z.number())).toBeNull();
  });

  it("returns null when the stored text is not JSON", () => {
    localStorage.setItem("activePlanId", "{not json");

    expect(getItemFromStorage("activePlanId", z.number())).toBeNull();
  });

  it("returns null when the stored value has the wrong shape", () => {
    localStorage.setItem("activePlanId", '"10"');

    expect(getItemFromStorage("activePlanId", z.number())).toBeNull();
  });
});
