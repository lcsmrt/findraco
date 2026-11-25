import { waitFor } from "@testing-library/react";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  ConfirmTransactionRequest,
  CreateTransactionRequest,
  NeutralCandidate,
  Transaction,
  TransactionSeriesResponse,
  PagedResponse,
  RecurrenceDefinitionResponse,
  TransactionTrashEntry,
  UpdateTransactionSeriesRequest,
} from "@/api/dtos";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { transactionHandlers as handlers } from "./transaction.handlers";
import {
  useConfirmTransaction,
  useCreateTransaction,
  useCreateTransactionSeries,
  useDeleteTransaction,
  useDeleteTransactionSeries,
  useGetNeutralCandidates,
  useGetTransactions,
  useGetTransactionSeries,
  useGetTransactionTrash,
  useImportNubankCsv,
  useRestoreDeletion,
  useSetTransactionKind,
  useUpdateTransaction,
  useUpdateTransactionSeries,
} from "./useTransactionService";

function planContext(activePlanId: number | null): PlanContextValue {
  return { activePlanId, setActivePlanId: () => {}, plans: [], isLoading: false };
}

const plan5 = planContext(5);
const path = "/api/findraco/plan/5/transaction";

const transaction: Transaction = {
  id: 40,
  permissions: { edit: true, delete: true },
  version: 0,
  type: "DEBIT",
  amount: 120.5,
  description: "Groceries",
  startDate: "2026-10-01",
  endDate: "2026-10-01",
  splitMode: "EQUAL",
  participants: [],
  items: [],
  status: "ACTUAL",
  requiresConfirmation: false,
};

const body: CreateTransactionRequest["body"] = {
  type: "DEBIT",
  amount: 120.5,
  description: "Groceries",
  startDate: "2026-10-01",
};

const series: TransactionSeriesResponse = { seriesId: "s1", count: 1, occurrences: [transaction] };

const definition: RecurrenceDefinitionResponse = {
  id: 3,
  version: 0,
  seriesId: "s1",
  type: "DEBIT",
  amount: 50,
  description: "Gym",
  mode: "RECURRING",
  interval: "MONTHLY",
  startDate: "2026-01-05",
  splitMode: "EQUAL",
  participants: [],
  requiresConfirmation: false,
};

function sent(request: Request) {
  const url = new URL(request.url);
  return [request.method, url.pathname, Object.fromEntries(url.searchParams)];
}

// The caches every transaction mutation must refresh: the lists, the category usage counts, the
// spending tree and the dashboard totals and trend.
function seedLists(client: QueryClient) {
  client.setQueryData(["transactions", 5, undefined], { content: [] });
  client.setQueryData(["categoryUsage", 5, 12], { transactions: 1 });
  client.setQueryData(["categorySpending", 5, { startDate: "2026-10-01" }], []);
  client.setQueryData(["dashboardSummary", 5, { startDate: "2026-10-01" }], { totalIncome: 0 });
  client.setQueryData(["dashboardTrend", 5, { months: 6 }], []);
  client.setQueryData(["transactionTrash", 5, undefined], { content: [] });
  client.setQueryData(["neutralCandidates", 5, undefined], { content: [] });
  client.setQueryData(["contacts", 5, false], []);
  client.setQueryData(["contactStatement", 5, 7], { months: [] });
  client.setQueryData(["transactionSeries", 5, "s1"], definition);
  client.setQueryData(["transactionSeries", 5, "other"], definition);
}

function invalidated(client: QueryClient) {
  return {
    lists: client.getQueryState(["transactions", 5, undefined])?.isInvalidated,
    usage: client.getQueryState(["categoryUsage", 5, 12])?.isInvalidated,
    spending: client.getQueryState(["categorySpending", 5, { startDate: "2026-10-01" }])?.isInvalidated,
    summary: client.getQueryState(["dashboardSummary", 5, { startDate: "2026-10-01" }])?.isInvalidated,
    trend: client.getQueryState(["dashboardTrend", 5, { months: 6 }])?.isInvalidated,
    trash: client.getQueryState(["transactionTrash", 5, undefined])?.isInvalidated,
    candidates: client.getQueryState(["neutralCandidates", 5, undefined])?.isInvalidated,
    contacts: client.getQueryState(["contacts", 5, false])?.isInvalidated,
    statement: client.getQueryState(["contactStatement", 5, 7])?.isInvalidated,
    series: client.getQueryState(["transactionSeries", 5, "s1"])?.isInvalidated,
    otherSeries: client.getQueryState(["transactionSeries", 5, "other"])?.isInvalidated,
  };
}

// The toast is the user-visible outcome of a mutation; sonner is a third-party module.
beforeEach(() => {
  vi.spyOn(toast, "success");
});

afterEach(() => {
  vi.restoreAllMocks();
});

const transactionData = {
  lists: true,
  usage: true,
  spending: true,
  summary: true,
  trend: true,
  trash: true,
  candidates: true,
  // A share or a payment moves a contact's balance and statement.
  contacts: true,
  statement: true,
};

describe("useGetTransactions", () => {
  it("GETs the plan-scoped page with paging, sort and filter in the query and returns it", async () => {
    const page: PagedResponse<Transaction> = {
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
        useGetTransactions({
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
});

describe("useGetTransactionSeries", () => {
  it("GETs the plan-scoped series definition and returns it", async () => {
    server.use(handlers.series(definition));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetTransactionSeries("s1"), { plan: plan5 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["GET", `${path}/series/s1`, {}]]);
    expect(result.current.data).toEqual(definition);
  });
});

describe("transaction mutations", () => {
  it(`create POSTs the body, returns the transaction, refreshes the transaction, dashboard and category data, shows "Transaction added." and calls the caller's onSuccess (NAV-02 AC 3, 4; NAV-05 AC 2)`, async () => {
    server.use(handlers.create(transaction));
    const requests = recordRequests();
    const onSuccess = vi.fn();

    const { result, queryClient } = renderHookWithProviders(() => useCreateTransaction({ onSuccess }), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate({ body });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["POST", path, {}]]);
    expect(await requests[0].json()).toEqual(body);
    expect(result.current.data).toEqual(transaction);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(toast.success).toHaveBeenCalledWith("Transaction added.");
    expect(onSuccess).toHaveBeenCalledWith(transaction, { body });
  });

  it(`update PUTs the body to the transaction's URL, refreshes the transaction, dashboard and category data and shows "Transaction updated." (NAV-02 AC 4; NAV-05 AC 2)`, async () => {
    server.use(handlers.update(transaction));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useUpdateTransaction(), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate({ params: { id: 40 }, body: { ...body, items: [], version: 3 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["PUT", `${path}/40`, {}]]);
    expect(await requests[0].json()).toEqual({ ...body, items: [], version: 3 });
    expect(result.current.data).toEqual(transaction);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(toast.success).toHaveBeenCalledWith("Transaction updated.");
  });

  it(`delete DELETEs the transaction's URL, refreshes the transaction, dashboard and category data and shows "Transaction deleted." (NAV-02 AC 4; NAV-05 AC 2)`, async () => {
    server.use(handlers.remove());
    const requests = recordRequests();
    const onSuccess = vi.fn();

    const { result, queryClient } = renderHookWithProviders(() => useDeleteTransaction({ onSuccess }), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate(40);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["DELETE", `${path}/40`, {}]]);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(toast.success).toHaveBeenCalledWith("Transaction deleted.", expect.anything());
    expect(onSuccess).toHaveBeenCalledWith({ deletionId: 1 }, 40);
  });

  it(`import POSTs to the import URL and returns the counts; the toast and the refresh are asserted once, in the page flow (BST-17 AC 5)`, async () => {
    server.use(handlers.importCsv({ imported: 12, skippedDuplicates: 3 }));
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const file = new File(["date,amount\n"], "nubank.csv", { type: "text/csv" });

    const { result } = renderHookWithProviders(() => useImportNubankCsv({ onSuccess }), { plan: plan5 });
    result.current.mutate(file);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // The multipart body is not asserted: jsdom's FormData is not the one MSW's XHR interceptor
    // reads, so the request arrives as the text "[object FormData]" here, never in a browser.
    expect(requests.map(sent)).toEqual([["POST", `${path}/import`, {}]]);
    expect(result.current.data).toEqual({ imported: 12, skippedDuplicates: 3 });
    expect(onSuccess).toHaveBeenCalledWith({ imported: 12, skippedDuplicates: 3 }, file);
  });
});

describe("confirmTransaction", () => {
  it("posts amount, date and version", async () => {
    const confirmed: Transaction = { ...transaction, amount: 187.4, startDate: "2026-10-12", status: "ACTUAL" };
    server.use(handlers.confirm(confirmed));
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const request: ConfirmTransactionRequest = {
      params: { id: 40 },
      body: { amount: 187.4, startDate: "2026-10-12", version: 3 },
    };

    const { result, queryClient } = renderHookWithProviders(() => useConfirmTransaction({ onSuccess }), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["POST", `${path}/40/confirm`, {}]]);
    expect(await requests[0].json()).toEqual({ amount: 187.4, startDate: "2026-10-12", version: 3 });
    expect(result.current.data).toEqual(confirmed);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(toast.success).toHaveBeenCalledWith("Transaction confirmed.");
    expect(onSuccess).toHaveBeenCalledWith(confirmed, request);
  });
});

describe("series mutations", () => {
  const seriesBody = { ...body, mode: "INSTALLMENT" as const, parcelsNumber: 3, currentParcel: 1 };

  it(`create POSTs the series body, returns the series, refreshes the transaction, dashboard and category data and shows "Series created." (NAV-02 AC 3, 4; NAV-05 AC 2)`, async () => {
    server.use(handlers.createSeries(series));
    const requests = recordRequests();
    const onSuccess = vi.fn();

    const { result, queryClient } = renderHookWithProviders(
      () => useCreateTransactionSeries({ onSuccess }),
      { plan: plan5, seed: seedLists },
    );
    result.current.mutate({ body: seriesBody });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["POST", `${path}/series`, {}]]);
    expect(await requests[0].json()).toEqual(seriesBody);
    expect(result.current.data).toEqual(series);
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(toast.success).toHaveBeenCalledWith("Series created.");
    expect(onSuccess).toHaveBeenCalledWith(series, { body: seriesBody });
  });

  it(`update PUTs to the series URL, refreshes the transaction, dashboard and category data and that series only, and shows "Series updated." (NAV-02 AC 4; NAV-05 AC 2)`, async () => {
    server.use(handlers.updateSeries(series));
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const request: UpdateTransactionSeriesRequest = {
      params: { seriesId: "s1" },
      body: { scope: "THIS_AND_FOLLOWING", pivotOccurrenceId: 40, series: seriesBody, version: 2 },
    };

    const { result, queryClient } = renderHookWithProviders(
      () => useUpdateTransactionSeries({ onSuccess }),
      { plan: plan5, seed: seedLists },
    );
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["PUT", `${path}/series/s1`, {}]]);
    expect(await requests[0].json()).toEqual(request.body);
    expect(result.current.data).toEqual(series);
    expect(invalidated(queryClient)).toEqual({ ...transactionData, series: true, otherSeries: false });
    expect(toast.success).toHaveBeenCalledWith("Series updated.");
    expect(onSuccess).toHaveBeenCalledWith(series, request);
  });

  it(`delete sends the scope and the pivot occurrence, refreshes the transaction, dashboard and category data and that series only, and shows "Series deleted." (NAV-02 AC 4; NAV-05 AC 2)`, async () => {
    server.use(handlers.removeSeries());
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const request = { seriesId: "s1", scope: "THIS_AND_FOLLOWING" as const, pivotOccurrenceId: 40 };

    const { result, queryClient } = renderHookWithProviders(
      () => useDeleteTransactionSeries({ onSuccess }),
      { plan: plan5, seed: seedLists },
    );
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([
      ["DELETE", `${path}/series/s1`, { scope: "THIS_AND_FOLLOWING", pivotOccurrenceId: "40" }],
    ]);
    expect(invalidated(queryClient)).toEqual({ ...transactionData, series: true, otherSeries: false });
    expect(toast.success).toHaveBeenCalledWith("Series deleted.", expect.anything());
    expect(onSuccess).toHaveBeenCalledWith({ deletionId: 1 }, request);
  });

  it("restore POSTs the deletion's restore URL, refreshes the transaction data and the trash and shows \"Transaction restored.\"", async () => {
    server.use(handlers.restore(6));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useRestoreDeletion(), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate(9);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["POST", `${path}/trash/9/restore`, {}]]);
    expect(result.current.data).toEqual({ restored: 6 });
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(toast.success).toHaveBeenCalledWith("Transaction restored.");
  });
});

describe("useGetTransactionTrash", () => {
  it("GETs the plan's trash page and returns it", async () => {
    const entry: TransactionTrashEntry = {
      id: 9,
      kind: "SERIES",
      scope: "ALL",
      description: "Gym",
      count: 6,
      amount: 1800,
      type: "DEBIT",
      deletedAt: "2026-11-18T12:00:00Z",
      deletedBy: { id: 1, name: "Ana" },
      expiresAt: "2026-12-18T12:00:00Z",
    };
    const page: PagedResponse<TransactionTrashEntry> = {
      content: [entry],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      last: true,
    };
    server.use(handlers.trash(page));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetTransactionTrash({ page: 0, size: 20 }), {
      plan: plan5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["GET", `${path}/trash`, { page: "0", size: "20" }]]);
    expect(result.current.data).toEqual(page);
  });
});

describe("neutral candidates", () => {
  const candidate: NeutralCandidate = { transaction, proposedKind: "TRANSFER" };

  it("GETs the plan's review page and returns it", async () => {
    const page: PagedResponse<NeutralCandidate> = {
      content: [candidate],
      page: 0,
      size: 50,
      totalElements: 1,
      totalPages: 1,
      last: true,
    };
    server.use(handlers.neutralCandidates(page));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetNeutralCandidates({ page: 0, size: 50 }), {
      plan: plan5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["GET", `${path}/neutral-candidates`, { page: "0", size: "50" }]]);
    expect(result.current.data).toEqual(page);
  });

  it("applying a kind POSTs the kind and version, refreshes the transaction data and the review and shows \"Movement marked.\"", async () => {
    server.use(handlers.setKind({ ...transaction, kind: "TRANSFER", version: 1 }));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useSetTransactionKind(), {
      plan: plan5,
      seed: seedLists,
    });
    result.current.mutate({ params: { id: 40 }, body: { kind: "TRANSFER", version: 0 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map(sent)).toEqual([["POST", `${path}/40/kind`, {}]]);
    expect(await requests[0].clone().json()).toEqual({ kind: "TRANSFER", version: 0 });
    expect(result.current.data).toMatchObject({ kind: "TRANSFER", version: 1 });
    expect(invalidated(queryClient)).toMatchObject(transactionData);
    expect(toast.success).toHaveBeenCalledWith("Movement marked.");
  });
});
