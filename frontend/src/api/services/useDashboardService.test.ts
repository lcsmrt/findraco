import { waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { dashboardHandlers } from "./dashboard.handlers";
import { useGetDashboardSummary, useGetDashboardTrend } from "./useDashboardService";

function planContext(activePlanId: number | null): PlanContextValue {
  return { activePlanId, setActivePlanId: () => {}, plans: [], isLoading: false };
}

const params = { startDate: "2026-05-01", endDate: "2026-10-31", memberId: 9 };

describe("useGetDashboardSummary", () => {
  it("GETs the plan-scoped summary with start, end and memberId and returns it", async () => {
    const summary = {
      totalIncome: 1000,
      totalExpenses: 250,
      netBalance: 750,
      personBreakdown: [],
    };
    server.use(dashboardHandlers.summary(summary));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetDashboardSummary(params), {
      plan: planContext(5),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("GET");
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe("/api/findraco/plan/5/dashboard");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      startDate: "2026-05-01",
      endDate: "2026-10-31",
      memberId: "9",
    });
    expect(result.current.data).toEqual(summary);
  });
});

describe("useGetDashboardTrend (UX-05 AC 7)", () => {
  const trend = [{ year: 2026, month: 8, income: 1000, expenses: 250 }];

  it("GETs the plan-scoped trend with start, end and memberId", async () => {
    server.use(dashboardHandlers.trend(trend));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetDashboardTrend(params), {
      plan: planContext(5),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("GET");
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe("/api/findraco/plan/5/dashboard/trend");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      startDate: "2026-05-01",
      endDate: "2026-10-31",
      memberId: "9",
    });
    expect(result.current.data).toEqual(trend);
  });
});
