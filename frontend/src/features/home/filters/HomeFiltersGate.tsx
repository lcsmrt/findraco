import { useAuth } from "@/app/providers/AuthProvider";
import { usePlanContext } from "@/app/providers/PlanProvider";
import { loadHomeFilters, saveHomeFilters } from "@/lib/filterStorage";
import { useEffect, type ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
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
];

type HomeFiltersGateProps = {
  children: ReactNode;
};

/**
 * Makes sure the home URL carries the active plan's filters before the tabs mount:
 * no home params or a different plan → redirect to the saved state; matching plan →
 * render the tabs and remember the query string.
 */
export const HomeFiltersGate = ({ children }: HomeFiltersGateProps) => {
  const { user } = useAuth();
  const { activePlanId } = usePlanContext();
  const [searchParams] = useSearchParams();

  const userId = user?.id ?? null;
  const search = searchParams.toString();
  const isCurrent =
    userId != null &&
    activePlanId != null &&
    parsePlanParam(searchParams) === activePlanId;

  useEffect(() => {
    if (isCurrent) saveHomeFilters(userId, activePlanId, search);
  }, [isCurrent, userId, activePlanId, search]);

  if (userId == null || activePlanId == null) return null;
  if (isCurrent) return <>{children}</>;

  const hasHomeParams = HOME_PARAM_KEYS.some((key) => searchParams.has(key));
  const hasPlanParam = searchParams.has(PLAN_PARAM);
  // Params without a `plan` (e.g. a hand-written link) are applied as-is for the
  // active plan; a different `plan` (plan switch) restores that plan's saved state.
  const base =
    hasHomeParams && !hasPlanParam
      ? search
      : (loadHomeFilters(userId, activePlanId) ?? "");
  const next = new URLSearchParams(base);
  next.set(PLAN_PARAM, String(activePlanId));

  return <Navigate replace to={{ search: `?${next.toString()}` }} />;
};
