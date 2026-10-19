import type { Plan } from "@/api/dtos";
import { dashboardHandlers } from "@/api/services/dashboard.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useOverviewTrend } from "./useOverviewTrend";

const PLAN_ID = 5;
const JULY = { startDate: "2026-07-01", endDate: "2026-07-31" };

function planValue(): PlanContextValue {
  const plan: Plan = { id: PLAN_ID, name: "Home", isDefault: true, myRole: "OWNER" };
  return {
    activePlanId: PLAN_ID,
    setActivePlanId: vi.fn(),
    activePlan: plan,
    plans: [plan],
    isLoading: false,
  };
}

function setup(memberId: number | null) {
  server.use(
    dashboardHandlers.trend([{ year: 2026, month: 7, income: 5000, expenses: 3200 }]),
  );
  const requests = recordRequests();
  const { result } = renderHookWithProviders(() => useOverviewTrend(JULY, memberId), {
    plan: planValue(),
  });
  return { result, requests };
}

function params(request: Request) {
  return Object.fromEntries(new URL(request.url).searchParams);
}

describe("useOverviewTrend", () => {
  it("asks for the six months ending with the period, for every member", async () => {
    const { result, requests } = setup(null);

    expect(result.current).toEqual({ months: undefined, isLoading: true });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(requests.map(params)).toEqual([{ startDate: "2026-02-01", endDate: "2026-07-31" }]);
  });

  it("asks for the selected member only", async () => {
    const { result, requests } = setup(2);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(requests.map(params)).toEqual([
      { startDate: "2026-02-01", endDate: "2026-07-31", memberId: "2" },
    ]);
  });

  it("returns one month per window month, zero where the API has none, marking the period", async () => {
    const { result } = setup(null);

    await waitFor(() => expect(result.current.months).toBeDefined());
    expect(result.current.months).toEqual([
      { year: 2026, month: 2, income: 0, expenses: 0, label: "Feb", inPeriod: false },
      { year: 2026, month: 3, income: 0, expenses: 0, label: "Mar", inPeriod: false },
      { year: 2026, month: 4, income: 0, expenses: 0, label: "Apr", inPeriod: false },
      { year: 2026, month: 5, income: 0, expenses: 0, label: "May", inPeriod: false },
      { year: 2026, month: 6, income: 0, expenses: 0, label: "Jun", inPeriod: false },
      { year: 2026, month: 7, income: 5000, expenses: 3200, label: "Jul", inPeriod: true },
    ]);
  });
});
