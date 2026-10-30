import type { Plan, PlanCapabilities } from "@/api/dtos";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { describe, expect, it, vi } from "vitest";
import { usePlanPermissions, type PlanPermissions } from "./usePlanPermissions";

function planValue(overrides: Partial<PlanContextValue>): PlanContextValue {
  return {
    activePlanId: 5,
    setActivePlanId: vi.fn(),
    plans: [],
    isLoading: false,
    ...overrides,
  };
}

/** A plan whose role says one thing and whose flags another: the hook must read the flags. */
function planWith(permissions: PlanCapabilities): Plan {
  return { id: 5, name: "Home", isDefault: true, myRole: "OWNER", permissions };
}

function permissionsWith(plan: PlanContextValue) {
  return renderHookWithProviders(() => usePlanPermissions(), { plan }).result.current;
}

const NONE: PlanPermissions = {
  canCreateTransactions: false,
  canAttributeToOthers: false,
  canManageCategories: false,
  canManagePlan: false,
};

describe("usePlanPermissions", () => {
  it("reads each capability from the flags the server sent with the active plan, computing none", () => {
    const plan = planWith({
      createTransactions: true,
      attributeToOthers: false,
      manageCategories: true,
      managePlan: false,
    });

    expect(permissionsWith(planValue({ activePlan: plan }))).toEqual({
      canCreateTransactions: true,
      canAttributeToOthers: false,
      canManageCategories: true,
      canManagePlan: false,
    });
  });

  it("reports every capability as false while the plans load (STD-06 AC 12)", () => {
    expect(permissionsWith(planValue({ isLoading: true, activePlan: undefined }))).toEqual(NONE);
  });

  it("reports every capability as false when no plan is active (STD-06 AC 12)", () => {
    expect(permissionsWith(planValue({ activePlanId: null, activePlan: undefined }))).toEqual(NONE);
  });
});
