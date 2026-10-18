import { cleanup, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeContext, type ThemeContextValue, useTheme } from "./useTheme";

afterEach(cleanup);

describe("useTheme", () => {
  it("throws when used outside a ThemeProvider (STD-02 AC 6)", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
  });

  it("returns the provided value inside a ThemeProvider (STD-02 AC 6)", () => {
    const value: ThemeContextValue = {
      theme: "dark",
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    };
    function wrapper({ children }: { children: ReactNode }) {
      return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
    }

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toBe(value);
  });
});
