import type { Plan, PlanRole } from "@/api/dtos";
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

function planWithRole(myRole: PlanRole): Plan {
  return { id: 5, name: "Home", isDefault: true, myRole };
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

// Expected values follow backend/src/main/java/com/lcs/findraco/security/PlanAuthorization.java:
// requireCanCreateTransaction (all but VIEWER), requireCanAttributeToOthers (OWNER, EDITOR),
// requireCanManageCategories (OWNER) and requireOwner (OWNER).
const MATRIX: [PlanRole, PlanPermissions][] = [
  [
    "OWNER",
    { canCreateTransactions: true, canAttributeToOthers: true, canManageCategories: true, canManagePlan: true },
  ],
  [
    "EDITOR",
    { canCreateTransactions: true, canAttributeToOthers: true, canManageCategories: false, canManagePlan: false },
  ],
  [
    "CONTRIBUTOR",
    { canCreateTransactions: true, canAttributeToOthers: false, canManageCategories: false, canManagePlan: false },
  ],
  ["VIEWER", NONE],
];

describe("usePlanPermissions", () => {
  it.each(MATRIX)("gives %s the capabilities PlanAuthorization allows (STD-06 AC 11)", (role, expected) => {
    expect(permissionsWith(planValue({ activePlan: planWithRole(role) }))).toEqual(expected);
  });

  it("reports every capability as false while the plans load (STD-06 AC 12)", () => {
    expect(permissionsWith(planValue({ isLoading: true, activePlan: undefined }))).toEqual(NONE);
  });

  it("reports every capability as false when no plan is active (STD-06 AC 12)", () => {
    expect(permissionsWith(planValue({ activePlanId: null, activePlan: undefined }))).toEqual(NONE);
  });
});
