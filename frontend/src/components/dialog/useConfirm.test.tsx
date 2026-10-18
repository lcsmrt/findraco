import { cleanup, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ConfirmDialogContext,
  type ConfirmDialogContextValue,
  useConfirm,
} from "./useConfirm";

afterEach(cleanup);

describe("useConfirm", () => {
  it("throws when used outside a ConfirmDialogProvider (STD-02 AC 6)", () => {
    expect(() => renderHook(() => useConfirm())).toThrow(
      "useConfirm must be used within a ConfirmDialogProvider",
    );
  });

  it("returns the provided confirm function inside a ConfirmDialogProvider (STD-02 AC 6)", () => {
    const value: ConfirmDialogContextValue = { confirm: vi.fn() };
    function wrapper({ children }: { children: ReactNode }) {
      return (
        <ConfirmDialogContext.Provider value={value}>{children}</ConfirmDialogContext.Provider>
      );
    }

    const { result } = renderHook(() => useConfirm(), { wrapper });

    expect(result.current).toBe(value.confirm);
  });
});
