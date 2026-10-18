import { cleanup, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlanContext, type PlanContextValue, usePlanContext } from "./usePlanContext";

afterEach(cleanup);

describe("usePlanContext", () => {
  it("throws when used outside a PlanProvider (STD-02 AC 6)", () => {
    expect(() => renderHook(() => usePlanContext())).toThrow(
      "usePlanContext must be used within a PlanProvider",
    );
  });

  it("returns the provided value inside a PlanProvider (STD-02 AC 6)", () => {
    const plan = { id: 7, name: "Household", isDefault: true, myRole: "OWNER" as const };
    const value: PlanContextValue = {
      activePlanId: 7,
      setActivePlanId: vi.fn(),
      activePlan: plan,
      plans: [plan],
      isLoading: false,
    };
    function wrapper({ children }: { children: ReactNode }) {
      return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
    }

    const { result } = renderHook(() => usePlanContext(), { wrapper });

    expect(result.current).toBe(value);
  });
});
