import { createElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { findracoApi } from "../clients/findracoApi";
import {
  financialTransactionCategoryKey,
  useDeleteFinancialTransactionCategory,
  useGetFinancialTransactionCategory,
  useUpdateFinancialTransactionCategory,
} from "./useFinancialTransactionCategoryService";

vi.mock("../clients/findracoApi", () => ({
  findracoApi: { get: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

let mockedActivePlanId: number | null = 5;
vi.mock("@/app/providers/PlanProvider", () => ({
  usePlanContext: () => ({ activePlanId: mockedActivePlanId }),
}));

const mockedGet = findracoApi.get as unknown as Mock;
const mockedPut = findracoApi.put as unknown as Mock;
const mockedDelete = findracoApi.delete as unknown as Mock;

const category = { id: 12, description: "Groceries" };

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  return { queryClient, Wrapper };
};

afterEach(() => {
  vi.clearAllMocks();
  mockedActivePlanId = 5;
});

describe("useGetFinancialTransactionCategory", () => {
  it("GETs the plan-scoped category by id and returns it", async () => {
    mockedGet.mockResolvedValue({ data: category });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useGetFinancialTransactionCategory(12), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGet).toHaveBeenCalledWith(
      "/plan/5/financial-transaction-category/12",
    );
    expect(result.current.data).toEqual(category);
  });

  it("sends no request when id is null", async () => {
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => useGetFinancialTransactionCategory(null),
      { wrapper: Wrapper },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("sends one request for a (plan, id) across re-renders", async () => {
    mockedGet.mockResolvedValue({ data: category });
    const { Wrapper } = createWrapper();

    const { result, rerender } = renderHook(
      () => useGetFinancialTransactionCategory(12),
      { wrapper: Wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    rerender();
    rerender();

    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it("uses the exported key builder so seeded data avoids the request", async () => {
    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData(financialTransactionCategoryKey(5, 12), category);

    const { result } = renderHook(() => useGetFinancialTransactionCategory(12), {
      wrapper: Wrapper,
    });

    expect(result.current.data).toEqual(category);
    expect(financialTransactionCategoryKey(5, 12)).toEqual([
      "financialTransactionCategory",
      5,
      12,
    ]);
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(mockedGet).not.toHaveBeenCalled();
  });
});

describe("category mutations refresh the category-by-id cache", () => {
  it("update refetches the edited category so its name is not stale", async () => {
    const renamed = { id: 12, description: "Food" };
    mockedPut.mockResolvedValue({ data: renamed });
    mockedGet.mockResolvedValue({ data: renamed });
    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData(financialTransactionCategoryKey(5, 12), category);

    const { result } = renderHook(
      () => ({
        query: useGetFinancialTransactionCategory(12),
        update: useUpdateFinancialTransactionCategory(),
      }),
      { wrapper: Wrapper },
    );
    expect(result.current.query.data).toEqual(category);

    result.current.update.mutate({
      params: { id: 12 },
      body: { description: "Food" },
    });

    await waitFor(() => expect(result.current.query.data).toEqual(renamed));
    expect(mockedGet).toHaveBeenCalledWith(
      "/plan/5/financial-transaction-category/12",
    );
  });

  it("update leaves other cached categories untouched", async () => {
    mockedPut.mockResolvedValue({ data: { id: 12, description: "Food" } });
    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData(financialTransactionCategoryKey(5, 13), {
      id: 13,
      description: "Rent",
    });

    const { result } = renderHook(
      () => useUpdateFinancialTransactionCategory(),
      { wrapper: Wrapper },
    );
    result.current.mutate({ params: { id: 12 }, body: { description: "Food" } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(
      queryClient.getQueryState(financialTransactionCategoryKey(5, 13))
        ?.isInvalidated,
    ).toBe(false);
  });

  it("delete refetches the deleted category so a filter on it sees the 404", async () => {
    mockedDelete.mockResolvedValue({});
    mockedGet.mockRejectedValue(
      Object.assign(new Error("Not found"), { response: { status: 404 } }),
    );
    const { queryClient, Wrapper } = createWrapper();
    queryClient.setQueryData(financialTransactionCategoryKey(5, 12), category);

    const { result } = renderHook(
      () => ({
        query: useGetFinancialTransactionCategory(12),
        remove: useDeleteFinancialTransactionCategory(),
      }),
      { wrapper: Wrapper },
    );

    result.current.remove.mutate(12);

    await waitFor(() => expect(result.current.query.isError).toBe(true));
    expect(mockedGet).toHaveBeenCalledWith(
      "/plan/5/financial-transaction-category/12",
    );
  });
});
