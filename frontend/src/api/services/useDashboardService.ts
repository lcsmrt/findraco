import { useQuery } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import { DashboardFilter, DashboardSummaryResponse, MonthlyTrend } from "../dtos";
import { QueryOptions } from "../types/queryOptions";
import { usePlanContext } from "@/app/providers/usePlanContext";

async function getDashboardSummary(
  planId: number,
  params: DashboardFilter,
): Promise<DashboardSummaryResponse> {
  const { data } = await findracoApi.get<DashboardSummaryResponse>(
    `/plan/${planId}/dashboard`,
    { params },
  );
  return data;
}

export function useGetDashboardSummary(
  params: DashboardFilter,
  options?: QueryOptions<DashboardSummaryResponse>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getDashboardSummary(activePlanId!, params),
    queryKey: ["dashboardSummary", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}

async function getDashboardTrend(
  planId: number,
  params: DashboardFilter,
): Promise<MonthlyTrend[]> {
  const { data } = await findracoApi.get<MonthlyTrend[]>(
    `/plan/${planId}/dashboard/trend`,
    { params },
  );
  return data;
}

/** Income and expenses per month for a range and optional member (UX-05 AC 7). */
export function useGetDashboardTrend(
  params: DashboardFilter,
  options?: QueryOptions<MonthlyTrend[]>,
) {
  const { activePlanId } = usePlanContext();
  return useQuery({
    queryFn: () => getDashboardTrend(activePlanId!, params),
    queryKey: ["dashboardTrend", activePlanId, params],
    ...options,
    enabled: activePlanId != null && (options?.enabled ?? true),
  });
}
