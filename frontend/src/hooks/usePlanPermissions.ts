import type { PlanRole } from "@/api/dtos";
import { usePlanContext } from "@/app/providers/usePlanContext";

/** What the current member may do in the active plan. */
export type PlanPermissions = {
  canCreateTransactions: boolean;
  canAttributeToOthers: boolean;
  canManageCategories: boolean;
  canManagePlan: boolean;
};

const NO_PERMISSIONS: PlanPermissions = {
  canCreateTransactions: false,
  canAttributeToOthers: false,
  canManageCategories: false,
  canManagePlan: false,
};

/**
 * The active plan's capabilities for the current member. They mirror the backend's
 * `PlanAuthorization`, which still enforces them; a rule changed there must change here too.
 * Every capability is false until the plan and its role have loaded, so no screen offers an
 * action the role may not allow.
 */
export function usePlanPermissions(): PlanPermissions {
  // The plans query has no data while it loads, so the active plan, and its role, is missing then.
  const { activePlan } = usePlanContext();
  if (!activePlan) return NO_PERMISSIONS;
  return permissionsFor(activePlan.myRole);
}

function permissionsFor(role: PlanRole): PlanPermissions {
  return {
    // Mirrors PlanAuthorization.requireCanCreateTransaction.
    canCreateTransactions: role !== "VIEWER",
    // Mirrors PlanAuthorization.requireCanAttributeToOthers.
    canAttributeToOthers: role === "OWNER" || role === "EDITOR",
    // Mirrors PlanAuthorization.requireCanManageCategories.
    canManageCategories: role === "OWNER",
    // Mirrors PlanAuthorization.requireOwner.
    canManagePlan: role === "OWNER",
  };
}
