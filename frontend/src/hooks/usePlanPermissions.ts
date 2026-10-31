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
 * The active plan's capabilities for the current member, read from the plan the server sent; the
 * server decides them and still checks every call. Every capability is false until the plan has
 * loaded, so no screen offers an action the role may not allow.
 */
export function usePlanPermissions(): PlanPermissions {
  // The plans query has no data while it loads, so the active plan is missing then.
  const { activePlan } = usePlanContext();
  if (!activePlan) return NO_PERMISSIONS;
  const { permissions } = activePlan;
  return {
    canCreateTransactions: permissions.createTransactions,
    canAttributeToOthers: permissions.attributeToOthers,
    canManageCategories: permissions.manageCategories,
    canManagePlan: permissions.managePlan,
  };
}
