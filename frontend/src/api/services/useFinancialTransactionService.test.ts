import { waitFor } from "@testing-library/react";
import type { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import type {
  CreateFinancialTransactionRequest,
  FinancialTransaction,
  FinancialTransactionSeriesResponse,
  PagedResponse,
  RecurrenceDefinitionResponse,
  UpdateFinancialTransactionSeriesRequest,
} from "@/api/dtos";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { financialTransactionHandlers as handlers } from "./financialTransaction.handlers";
import {
  useCreateFinancialTransaction,
  useCreateFinancialTransactionSeries,
  useDeleteFinancialTransaction,
  useDeleteFinancialTransactionSeries,
  useGetFinancialTransactions,
  useGetFinancialTransactionSeries,
  useImportNubankCsv,
  useUpdateFinancialTransaction,
  useUpdateFinancialTransactionSeries,
} from "./useFinancialTransactionService";

function planContext(activePlanId: number | null): PlanContextValue {
  return { activePlanId, setActivePlanId: () => {}, plans: [], isLoading: false };
}

const plan5 = planContext(5);
const path = "/api/findraco/plan/5/financial-transaction";

const transaction: FinancialTransaction = {
  id: 40,
  type: "DEBIT",
  amount: 120.5,
  description: "Groceries",
  startDate: "2026-10-01",
  endDate: "2026-10-01",
  splitMode: "EQUAL",
  participants: [],
  items: [],
};

const body: CreateFinancialTransactionRequest["body"] = {
  type: "DEBIT",
  amount: 120.5,
  description: "Groceries",
  startDate: "2026-10-01",
};

const series: FinancialTransactionSeriesResponse = { seriesId: "s1", count: 1, occurrences: [transaction] };

const definition: RecurrenceDefinitionResponse = {
  id: 3,
  seriesId: "s1",
  type: "DEBIT",
  amount: 50,
  description: "Gym",
  mode: "RECURRING",
  interval: "MONTHLY",
  startDate: "2026-01-05",
  splitMode: "EQUAL",
  participants: [],
};

function sent(request: Request) {
  const url = new URL(request.url);
  return [request.method, url.pathname, Object.fromEntries(url.searchParams)];
}

// The caches every transaction mutation must refresh: the lists, the category usage counts, the
// spending tree and the dashboard totals and trend.
function seedLists(client: QueryClient) {
  client.setQueryData(["financialTransactions", 5, undefined], { content: [] });
  client.setQueryData(["categoryUsage", 5, 12], { transactions: 1 });
  client.setQueryData(["categorySpending", 5, { startDate: "2026-10-01" }], []);
  client.setQueryData(["dashboardSummary", 5, { startDate: "2026-10-01" }], { totalIncome: 0 });
  client.setQueryData(["dashboardTrend", 5, { months: 6 }], []);
  client.setQueryData(["financialTransactionSeries", 5, "s1"], definition);
  client.setQueryData(["financialTransactionSeries", 5, "other"], definition);
}

function invalidated(client: QueryClient) {
  return {
    lists: client.getQueryState(["financialTransactions", 5, undefined])?.isInvalidated,
    usage: client.getQueryState(["categoryUsage", 5, 12])?.isInvalidated,
    spending: client.getQueryState(["categorySpending", 5, { startDate: "2026-10-01" }])?.isInvalidated,
    summary: client.getQueryState(["dashboardSummary", 5, { startDate: "2026-10-01" }])?.isInvalidated,
    trend: client.getQueryState(["dashboardTrend", 5, { months: 6 }])?.isInvalidated,
    series: client.getQueryState(["financialTransactionSeries", 5, "s1"])?.isInvalidated,
    otherSeries: client.getQueryState(["financialTransactionSeries", 5, "other"])?.isInvalidated,
  };
}

const transactionData = { lists: true, usage: true, spending: true, summary: true, trend: true };

describe("useGetFinancialTransactions", () => {
  it("GETs the plan-scoped page with paging, sort and filter in the query and returns it", async () => {
    const page: PagedResponse<FinancialTransaction> = {
      content: [transaction],
      page: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1,
      last: true,
    };
    server.use(handlers.list(page));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(
      () =>
        useGetFinancialTransactions({
          page: 0,
          size: 10,
          sort: { by: "amount", direction: "desc" },
          filter: { type: "DEBIT", description: "" },
        }),
      { plan: plan5 },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([
      ["GET", path, { page: "0", size: "10", sortBy: "amount", sortDirection: "desc", type: "DEBIT" }],
    ]);
    expect(result.current.data).toEqual(page);
  });

  it("sends no request without an active plan", () => {
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetFinancialTransactions(), { plan: planContext(null) });

    expect(result.current.fetchStatus).toBe("idle");
    expect(requests).toEqual([]);
  });

  it("sends no request while the caller disables it", () => {
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetFinancialTransactions(undefined, { enabled: false }), {
      plan: plan5,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(requests).toEqual([]);
  });
});

describe("useGetFinancialTransactionSeries", () => {
  it("GETs the plan-scoped series definition and returns it", async () => {
    server.use(handlers.series(definition));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetFinancialTransactionSeries("s1"), { plan: plan5 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["GET", `${path}/series/s1`, {}]]);
    expect(result.current.data).toEqual(definition);
  });

  it.each([
    ["without a series", undefined, plan5, undefined],
    ["without an active plan", "s1", planContext(null), undefined],
    ["while the caller disables it", "s1", plan5, { enabled: false }],
  ])("sends no request %s", (_, seriesId, plan, options) => {
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetFinancialTransactionSeries(seriesId, options), { plan });

    expect(result.current.fetchStatus).toBe("idle");
    expect(requests).toEqual([]);
  });
});

describe("transaction mutations", () => {
  it("create POSTs the body, returns the transaction, refreshes the transaction, dashboard and category data and calls the caller's onSuccess (NAV-02 AC 4)", async () => {
    server.use(handlers.create(transaction));
    const requests = recordRequests();
    const onSuccess = vi.fn();

    const { result, queryClient } = renderHookWithProviders(() => useCreateFinancialTransaction({ onSuccess }), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate({ body });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["POST", path, {}]]);
    expect(await requests[0].json()).toEqual(body);
    expect(result.current.data).toEqual(transaction);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(onSuccess).toHaveBeenCalledWith(transaction, { body });
  });

  it("a failed create refreshes nothing (NAV-02 AC 7)", async () => {
    server.use(handlers.createRejected("Amount must be positive"));

    const { result, queryClient } = renderHookWithProviders(() => useCreateFinancialTransaction(), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate({ body });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidated(queryClient)).toEqual({
      lists: false,
      usage: false,
      spending: false,
      summary: false,
      trend: false,
      series: false,
      otherSeries: false,
    });
  });

  it("update PUTs the body to the transaction's URL and refreshes the transaction, dashboard and category data (NAV-02 AC 4)", async () => {
    server.use(handlers.update(transaction));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useUpdateFinancialTransaction(), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate({ params: { id: 40 }, body });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["PUT", `${path}/40`, {}]]);
    expect(await requests[0].json()).toEqual(body);
    expect(result.current.data).toEqual(transaction);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
  });

  it("update calls the caller's onSuccess with the result and the request", async () => {
    server.use(handlers.update(transaction));
    const onSuccess = vi.fn();

    const { result } = renderHookWithProviders(() => useUpdateFinancialTransaction({ onSuccess }), { plan: plan5 });
    result.current.mutate({ params: { id: 40 }, body });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalledWith(transaction, { params: { id: 40 }, body });
  });

  it("delete DELETEs the transaction's URL and refreshes the transaction, dashboard and category data (NAV-02 AC 4)", async () => {
    server.use(handlers.remove());
    const requests = recordRequests();
    const onSuccess = vi.fn();

    const { result, queryClient } = renderHookWithProviders(() => useDeleteFinancialTransaction({ onSuccess }), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate(40);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["DELETE", `${path}/40`, {}]]);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(onSuccess).toHaveBeenCalledWith(undefined, 40);
  });

  it("delete works without caller options", async () => {
    server.use(handlers.remove());

    const { result, queryClient } = renderHookWithProviders(() => useDeleteFinancialTransaction(), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate(40);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidated(queryClient)).toMatchObject(transactionData);
  });

  it("import POSTs to the import URL, returns the count and refreshes the transaction, dashboard and category data (NAV-02 AC 4)", async () => {
    server.use(handlers.importCsv({ imported: 12 }));
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const file = new File(["date,amount\n"], "nubank.csv", { type: "text/csv" });

    const { result, queryClient } = renderHookWithProviders(() => useImportNubankCsv({ onSuccess }), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate(file);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // The multipart body is not asserted: jsdom's FormData is not the one MSW's XHR interceptor
    // reads, so the request arrives as the text "[object FormData]" here, never in a browser.
    expect(requests.map(sent)).toEqual([["POST", `${path}/import`, {}]]);
    expect(result.current.data).toEqual({ imported: 12 });
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(onSuccess).toHaveBeenCalledWith({ imported: 12 }, file);
  });

  it("import works without caller options", async () => {
    server.use(handlers.importCsv({ imported: 0 }));

    const { result } = renderHookWithProviders(() => useImportNubankCsv(), { plan: plan5 });
    result.current.mutate(new File([""], "empty.csv"));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ imported: 0 });
  });
});

describe("series mutations", () => {
  const seriesBody = { ...body, mode: "INSTALLMENT" as const, parcelsNumber: 3, currentParcel: 1 };

  it("create POSTs the series body, returns the series and refreshes the transaction, dashboard and category data (NAV-02 AC 4)", async () => {
    server.use(handlers.createSeries(series));
    const requests = recordRequests();
    const onSuccess = vi.fn();

    const { result, queryClient } = renderHookWithProviders(
      () => useCreateFinancialTransactionSeries({ onSuccess }),
      { plan: plan5, seed: seedLists },
    );
    result.current.mutate({ body: seriesBody });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["POST", `${path}/series`, {}]]);
    expect(await requests[0].json()).toEqual(seriesBody);
    expect(result.current.data).toEqual(series);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(onSuccess).toHaveBeenCalledWith(series, { body: seriesBody });
  });

  it("create works without caller options", async () => {
    server.use(handlers.createSeries(series));

    const { result } = renderHookWithProviders(() => useCreateFinancialTransactionSeries(), { plan: plan5 });
    result.current.mutate({ body: seriesBody });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(series);
  });

  it("update PUTs to the series URL and refreshes the transaction, dashboard and category data and that series only (NAV-02 AC 4)", async () => {
    server.use(handlers.updateSeries(series));
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const request: UpdateFinancialTransactionSeriesRequest = {
      params: { seriesId: "s1" },
      body: { ...seriesBody, scope: "THIS_AND_FOLLOWING", pivotOccurrenceId: 40 },
    };

    const { result, queryClient } = renderHookWithProviders(
      () => useUpdateFinancialTransactionSeries({ onSuccess }),
      { plan: plan5, seed: seedLists },
    );
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["PUT", `${path}/series/s1`, {}]]);
    expect(await requests[0].json()).toEqual(request.body);
    expect(result.current.data).toEqual(series);
    expect(invalidated(queryClient)).toEqual({ ...transactionData, series: true, otherSeries: false });
    expect(onSuccess).toHaveBeenCalledWith(series, request);
  });

  it("update works without caller options", async () => {
    server.use(handlers.updateSeries(series));

    const { result } = renderHookWithProviders(() => useUpdateFinancialTransactionSeries(), { plan: plan5 });
    result.current.mutate({ params: { seriesId: "s1" }, body: { ...seriesBody, scope: "ALL" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(series);
  });

  it("delete sends the scope and the pivot occurrence and refreshes the transaction, dashboard and category data and that series only (NAV-02 AC 4)", async () => {
    server.use(handlers.removeSeries());
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const request = { seriesId: "s1", scope: "THIS_AND_FOLLOWING" as const, pivotOccurrenceId: 40 };

    const { result, queryClient } = renderHookWithProviders(
      () => useDeleteFinancialTransactionSeries({ onSuccess }),
      { plan: plan5, seed: seedLists },
    );
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([
      ["DELETE", `${path}/series/s1`, { scope: "THIS_AND_FOLLOWING", pivotOccurrenceId: "40" }],
    ]);
    expect(invalidated(queryClient)).toEqual({ ...transactionData, series: true, otherSeries: false });
    expect(onSuccess).toHaveBeenCalledWith(undefined, request);
  });

  it("delete sends no pivot occurrence when the scope needs none", async () => {
    server.use(handlers.removeSeries());
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useDeleteFinancialTransactionSeries(), { plan: plan5 });
    result.current.mutate({ seriesId: "s1", scope: "ALL" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["DELETE", `${path}/series/s1`, { scope: "ALL" }]]);
  });
});
