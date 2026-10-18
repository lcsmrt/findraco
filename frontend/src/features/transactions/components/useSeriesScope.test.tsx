import { cleanup, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SeriesScopeDialogContext,
  type SeriesScopeDialogContextValue,
  useSeriesScope,
} from "./useSeriesScope";

afterEach(cleanup);

describe("useSeriesScope", () => {
  it("throws when used outside a SeriesScopeDialogProvider (STD-02 AC 6)", () => {
    expect(() => renderHook(() => useSeriesScope())).toThrow(
      "useSeriesScope must be used within a SeriesScopeDialogProvider",
    );
  });

  it("returns the provided chooseScope function inside a SeriesScopeDialogProvider (STD-02 AC 6)", () => {
    const value: SeriesScopeDialogContextValue = { chooseScope: vi.fn() };
    function wrapper({ children }: { children: ReactNode }) {
      return (
        <SeriesScopeDialogContext.Provider value={value}>
          {children}
        </SeriesScopeDialogContext.Provider>
      );
    }

    const { result } = renderHook(() => useSeriesScope(), { wrapper });

    expect(result.current).toBe(value.chooseScope);
  });
});
