import { cleanup, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CategoryFormSheetContext,
  type CategoryFormSheetContextValue,
  useCategoryFormSheet,
} from "./useCategoryFormSheet";

afterEach(cleanup);

describe("useCategoryFormSheet", () => {
  it("returns the provided value inside a CategoryFormSheetProvider (STD-02 AC 6)", () => {
    const value: CategoryFormSheetContextValue = {
      openCreate: vi.fn(),
      openEdit: vi.fn(),
    };
    function wrapper({ children }: { children: ReactNode }) {
      return (
        <CategoryFormSheetContext.Provider value={value}>
          {children}
        </CategoryFormSheetContext.Provider>
      );
    }

    const { result } = renderHook(() => useCategoryFormSheet(), { wrapper });

    expect(result.current).toBe(value);
  });
});
