import { beforeEach, describe, expect, it } from "vitest";
import { clearSessionStorage } from "./storage";

// Theme key owned by app/providers/ThemeProvider.tsx
const THEME_KEY = "findraco-theme";

beforeEach(() => localStorage.clear());

describe("clearSessionStorage", () => {
  it("removes the auth keys", () => {
    localStorage.setItem("accessToken", '"t"');
    localStorage.setItem("user", '{"id":1}');
    localStorage.setItem("activePlanId", "10");

    clearSessionStorage();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("activePlanId")).toBeNull();
  });

  it("keeps saved home filters and the theme choice", () => {
    localStorage.setItem("accessToken", '"t"');
    localStorage.setItem("homeFilters:1:10", "plan=10&tab=transactions");
    localStorage.setItem("homeFilters:1:11", "plan=11");
    localStorage.setItem(THEME_KEY, "dark");

    clearSessionStorage();

    expect(localStorage.getItem("homeFilters:1:10")).toBe(
      "plan=10&tab=transactions",
    );
    expect(localStorage.getItem("homeFilters:1:11")).toBe("plan=11");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });
});
