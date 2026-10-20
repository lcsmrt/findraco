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
  it("asks for the selected member only", async () => {
    const { result, requests } = setup(2);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(requests.map(params)).toEqual([
      { startDate: "2026-02-01", endDate: "2026-07-31", memberId: "2" },
    ]);
  });
});
