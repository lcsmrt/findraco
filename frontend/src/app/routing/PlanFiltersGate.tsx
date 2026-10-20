import { useAuth } from "@/app/providers/useAuth";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { loadFilters, saveFilters, type FilterScreen } from "./filterStorage";
import { useEffect, useRef, type ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { PLAN_PARAM, parsePlanParam } from "./planParams";

type PlanFiltersGateProps = {
  screen: FilterScreen;
  paramKeys: readonly string[];
  children: ReactNode;
};

/**
 * Makes sure a screen's URL carries the active plan's filters for that screen before it mounts:
 * - matching plan → render the screen and remember the query string for it;
 * - the user switched the active plan → redirect to that plan's saved state for the screen;
 * - a link (or first mount) for another plan the user belongs to → make it active,
 *   keeping the URL filters;
 * - no screen params or an unknown plan → redirect to the active plan's saved state for the screen.
 */
export function PlanFiltersGate({ screen, paramKeys, children }: PlanFiltersGateProps) {
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
    saveFilters(screen, userId, activePlanId, search);
  }, [isCurrent, screen, userId, activePlanId, search]);

  useEffect(() => {
    if (linkedPlanId != null) setActivePlanId(linkedPlanId);
  }, [linkedPlanId, setActivePlanId]);

  if (userId == null || activePlanId == null) return null;
  if (isCurrent) return <>{children}</>;
  // Nothing renders until the URL and the active plan agree, so no query mixes them.
  if (isAwaitingPlans || linkedPlanId != null) return null;

  const hasScreenParams = paramKeys.some((key) => searchParams.has(key));
  const hasPlanParam = searchParams.has(PLAN_PARAM);
  // Params without a `plan` (e.g. a hand-written link) are applied as-is for the
  // active plan; otherwise (plan switch, unknown plan) restore its saved state.
  const base =
    hasScreenParams && !hasPlanParam
      ? search
      : (loadFilters(screen, userId, activePlanId) ?? "");
  const next = new URLSearchParams(base);
  next.set(PLAN_PARAM, String(activePlanId));

  return <Navigate replace to={{ search: `?${next.toString()}` }} />;
}
