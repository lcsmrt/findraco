import { createElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { findracoApi } from "../clients/findracoApi";
import { useGetDashboardTrend } from "./useDashboardService";

vi.mock("../clients/findracoApi", () => ({
  findracoApi: { get: vi.fn() },
}));

let mockedActivePlanId: number | null = 5;
vi.mock("@/app/providers/usePlanContext", () => ({
  usePlanContext: () => ({ activePlanId: mockedActivePlanId }),
}));

const mockedGet = findracoApi.get as unknown as Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  return { queryClient, Wrapper };
};

afterEach(() => {
  vi.clearAllMocks();
  mockedActivePlanId = 5;
});

describe("useGetDashboardTrend (UX-05 AC 7)", () => {
  const params = { startDate: "2026-05-01", endDate: "2026-10-31", memberId: 9 };
  const trend = [{ year: 2026, month: 8, income: 1000, expenses: 250 }];

  it("GETs the plan-scoped trend with start, end and memberId", async () => {
    mockedGet.mockResolvedValue({ data: trend });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useGetDashboardTrend(params), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledWith("/plan/5/dashboard/trend", { params });
    expect(result.current.data).toEqual(trend);
  });

  it("keys the query by plan and params", async () => {
    mockedGet.mockResolvedValue({ data: trend });
    const { queryClient, Wrapper } = createWrapper();

    const { result } = renderHook(() => useGetDashboardTrend(params), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryClient.getQueryData(["dashboardTrend", 5, params])).toEqual(trend);
    expect(
      queryClient.getQueryData(["dashboardTrend", 5, { ...params, memberId: 10 }]),
    ).toBeUndefined();
  });

  it("is not fetched without an active plan", () => {
    mockedActivePlanId = null;
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useGetDashboardTrend(params), { wrapper: Wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedGet).not.toHaveBeenCalled();
  });
});
