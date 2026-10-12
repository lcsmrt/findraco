import { useAuth } from "@/app/providers/AuthProvider";
import { usePlanContext } from "@/app/providers/PlanProvider";
import { loadHomeFilters, saveHomeFilters } from "@/lib/filterStorage";
import { useEffect, useRef, type ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  CATEGORIES_PARAM_KEYS,
  OVERVIEW_PARAM_KEYS,
  PLAN_PARAM,
  parsePlanParam,
  TAB_PARAM,
  TRANSACTION_PARAM_KEYS,
} from "./homeFilterParams";

const HOME_PARAM_KEYS = [
  PLAN_PARAM,
  TAB_PARAM,
  ...OVERVIEW_PARAM_KEYS,
  ...TRANSACTION_PARAM_KEYS,
  ...CATEGORIES_PARAM_KEYS,
];

type HomeFiltersGateProps = {
  children: ReactNode;
};

/**
 * Makes sure the home URL carries the active plan's filters before the tabs mount:
 * - matching plan → render the tabs and remember the query string;
 * - the user switched the active plan → redirect to that plan's saved state;
 * - a link (or first mount) for another plan the user belongs to → make it active,
 *   keeping the URL filters;
 * - no home params or an unknown plan → redirect to the active plan's saved state.
 */
export const HomeFiltersGate = ({ children }: HomeFiltersGateProps) => {
  const { user } = useAuth();
  const { activePlanId, setActivePlanId, plans, isLoading } = usePlanContext();
  const [searchParams] = useSearchParams();
  // Active plan the URL last agreed with. It differs from `activePlanId` only after
  // the user switched plans, which tells a plan switch apart from a link to a plan.
  const agreedPlanIdRef = useRef<number | null>(null);

  const userId = user?.id ?? null;
  const search = searchParams.toString();
  const urlPlanId = parsePlanParam(searchParams);
  const isCurrent =
    userId != null && activePlanId != null && urlPlanId === activePlanId;

  const activePlanSwitched =
    agreedPlanIdRef.current != null && agreedPlanIdRef.current !== activePlanId;
  const followsUrlPlan = !isCurrent && !activePlanSwitched && urlPlanId != null;
  const isAwaitingPlans = followsUrlPlan && isLoading;
  const linkedPlanId =
    followsUrlPlan && plans.some((plan) => plan.id === urlPlanId)
      ? urlPlanId
      : null;

  useEffect(() => {
    if (!isCurrent) return;
    agreedPlanIdRef.current = activePlanId;
    saveHomeFilters(userId, activePlanId, search);
  }, [isCurrent, userId, activePlanId, search]);

  useEffect(() => {
    if (linkedPlanId != null) setActivePlanId(linkedPlanId);
  }, [linkedPlanId, setActivePlanId]);

  if (userId == null || activePlanId == null) return null;
  if (isCurrent) return <>{children}</>;
  // Nothing renders until the URL and the active plan agree, so no query mixes them.
  if (isAwaitingPlans || linkedPlanId != null) return null;

  const hasHomeParams = HOME_PARAM_KEYS.some((key) => searchParams.has(key));
  const hasPlanParam = searchParams.has(PLAN_PARAM);
  // Params without a `plan` (e.g. a hand-written link) are applied as-is for the
  // active plan; otherwise (plan switch, unknown plan) restore its saved state.
  const base =
    hasHomeParams && !hasPlanParam
      ? search
      : (loadHomeFilters(userId, activePlanId) ?? "");
  const next = new URLSearchParams(base);
  next.set(PLAN_PARAM, String(activePlanId));

  return <Navigate replace to={{ search: `?${next.toString()}` }} />;
};
