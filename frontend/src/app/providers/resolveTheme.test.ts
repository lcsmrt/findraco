import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveTheme } from "./resolveTheme";

function stubSystemPrefersDark(prefersDark: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(prefers-color-scheme: dark)" && prefersDark,
  }));
}

afterEach(() => vi.unstubAllGlobals());

describe("resolveTheme", () => {
  it.each(["light", "dark"] as const)("keeps an explicit %s theme", (theme) => {
    stubSystemPrefersDark(theme === "light");

    expect(resolveTheme(theme)).toBe(theme);
  });

  it.each([
    [true, "dark"],
    [false, "light"],
  ] as const)("follows the system preference (prefers dark: %s → %s)", (prefersDark, expected) => {
    stubSystemPrefersDark(prefersDark);

    expect(resolveTheme("system")).toBe(expected);
  });
});
