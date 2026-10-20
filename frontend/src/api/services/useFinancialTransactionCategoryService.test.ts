import { waitFor } from "@testing-library/react";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  CategorySpending,
  CreateFinancialTransactionCategoryRequest,
  FinancialTransactionCategory,
} from "@/api/dtos";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { financialTransactionCategoryHandlers as categoryHandlers } from "./financialTransactionCategory.handlers";
import {
  categoryUsageKey,
  financialTransactionCategoryKey,
  useCreateFinancialTransactionCategory,
  useDeleteFinancialTransactionCategory,
  useGetCategorySpending,
  useGetCategoryUsage,
  useGetFinancialTransactionCategories,
  useGetFinancialTransactionCategory,
  useUpdateFinancialTransactionCategory,
} from "./useFinancialTransactionCategoryService";

function planContext(activePlanId: number | null): PlanContextValue {
  return { activePlanId, setActivePlanId: () => {}, plans: [], isLoading: false };
}

const plan5 = planContext(5);
const categoriesPath = "/api/findraco/plan/5/financial-transaction-category";

const category: FinancialTransactionCategory = { id: 12, type: "DEBIT", description: "Groceries" };

// Every category mutation refreshes these views.
const categoryViewKeys = [
  ["financialTransactionCategories", 5, undefined],
  ["categorySpending", 5, { startDate: "2026-10-01", endDate: "2026-10-31" }],
  ["dashboardSummary", 5, { startDate: "2026-10-01", endDate: "2026-10-31" }],
];

function seedCategoryViews(queryClient: QueryClient) {
  categoryViewKeys.forEach((key) => queryClient.setQueryData(key, []));
}

function invalidated(queryClient: QueryClient, keys: readonly (readonly unknown[])[]) {
  return keys.map((key) => queryClient.getQueryState(key)?.isInvalidated);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useGetFinancialTransactionCategories", () => {
  it("GETs the plan-scoped page with paging, sort and filter in the query and returns it", async () => {
    const page = { content: [category], page: 1, size: 20, totalElements: 21, totalPages: 2, last: true };
    server.use(categoryHandlers.list(page));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(
      () =>
        useGetFinancialTransactionCategories({
          page: 1,
          size: 20,
          sort: { by: "description", direction: "asc" },
          filter: { type: "DEBIT", description: "" },
        }),
      { plan: plan5 },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("GET");
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe(categoriesPath);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      page: "1",
      size: "20",
      sortBy: "description",
      sortDirection: "asc",
      type: "DEBIT",
    });
    expect(result.current.data).toEqual(page);
  });
});

describe("useGetFinancialTransactionCategory", () => {
  it("GETs the plan-scoped category by id and returns it", async () => {
    server.use(categoryHandlers.get(category));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetFinancialTransactionCategory(12), {
      plan: plan5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["GET", `${categoriesPath}/12`],
    ]);
    expect(result.current.data).toEqual(category);
  });
});

describe("useCreateFinancialTransactionCategory", () => {
  it("POSTs the body to the plan-scoped collection, resolves with the created category, refreshes the category views and toasts (NAV-05 AC 1)", async () => {
    server.use(categoryHandlers.create(category));
    const requests = recordRequests();
    // sonner is a third-party module; the toast is the user-visible outcome.
    const success = vi.spyOn(toast, "success");
    const body: CreateFinancialTransactionCategoryRequest["body"] = {
      type: "DEBIT",
      description: "Groceries",
      spendingLimit: 400,
      memberLimits: [{ memberId: 9, amount: 150 }],
    };

    const { result, queryClient } = renderHookWithProviders(() => useCreateFinancialTransactionCategory(), {
      plan: plan5,
      seed: seedCategoryViews,
    });
    result.current.mutate({ body });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(new URL(requests[0].url).pathname).toBe(categoriesPath);
    expect(await requests[0].json()).toEqual(body);
    expect(result.current.data).toEqual(category);
    expect(invalidated(queryClient, categoryViewKeys)).toEqual([true, true, true]);
    expect(success).toHaveBeenCalledWith("Category created.");
  });
});

describe("useUpdateFinancialTransactionCategory", () => {
  it("PUTs the body, refreshes the edited category and the category views, leaves other categories cached and toasts (NAV-05 AC 1)", async () => {
    server.use(categoryHandlers.update({ ...category, description: "Food" }));
    const requests = recordRequests();
    const success = vi.spyOn(toast, "success");

    const { result, queryClient } = renderHookWithProviders(
      () => useUpdateFinancialTransactionCategory(),
      {
        plan: plan5,
        seed: (client) => {
          seedCategoryViews(client);
          client.setQueryData(financialTransactionCategoryKey(5, 12), category);
          client.setQueryData(financialTransactionCategoryKey(5, 13), {
            id: 13,
            type: "DEBIT",
            description: "Rent",
          });
        },
      },
    );
    result.current.mutate({ params: { id: 12 }, body: { description: "Food" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["PUT", `${categoriesPath}/12`],
    ]);
    expect(await requests[0].json()).toEqual({ description: "Food" });
    expect(
      invalidated(queryClient, [
        ...categoryViewKeys,
        financialTransactionCategoryKey(5, 12),
        financialTransactionCategoryKey(5, 13),
      ]),
    ).toEqual([true, true, true, true, false]);
    expect(success).toHaveBeenCalledWith("Category updated.");
  });
});

describe("useDeleteFinancialTransactionCategory", () => {
  it("DELETEs with reassignTo, refreshes the deleted category, the category views, usage and transactions, and toasts (NAV-05 AC 2)", async () => {
    server.use(categoryHandlers.delete());
    const requests = recordRequests();
    const success = vi.spyOn(toast, "success");
    const transactionsKey = ["financialTransactions", 5, {}];
    const usage = { transactions: 0, items: 0, recurrenceDefinitions: 0 };

    const { result, queryClient } = renderHookWithProviders(
      () => useDeleteFinancialTransactionCategory(),
      {
        plan: plan5,
        seed: (client) => {
          seedCategoryViews(client);
          client.setQueryData(financialTransactionCategoryKey(5, 12), category);
          client.setQueryData(categoryUsageKey(5, 30), usage);
          client.setQueryData(transactionsKey, { content: [] });
        },
      },
    );
    result.current.mutate({ id: 12, reassignTo: 30 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("DELETE");
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe(`${categoriesPath}/12`);
    expect(Object.fromEntries(url.searchParams)).toEqual({ reassignTo: "30" });
    expect(
      invalidated(queryClient, [
        ...categoryViewKeys,
        financialTransactionCategoryKey(5, 12),
        categoryUsageKey(5, 30),
        transactionsKey,
      ]),
    ).toEqual([true, true, true, true, true, true]);
    expect(success).toHaveBeenCalledWith("Category deleted.");
  });
});

describe("useGetCategorySpending", () => {
  const range = { startDate: "2026-10-01", endDate: "2026-10-31" };
  const tree: CategorySpending[] = [
    {
      categoryId: 1,
      parentId: null,
      name: "Food",
      type: "DEBIT",
      ownerId: null,
      ownerName: null,
      ownerActive: null,
      spent: 300,
      limit: 400,
      remaining: 100,
      percentUsed: 75,
      overLimit: false,
      members: [],
      children: [],
    },
  ];

  it("GETs the plan-scoped spending tree for the range and caches it under plan and range", async () => {
    server.use(categoryHandlers.spending(tree));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useGetCategorySpending(range), {
      plan: plan5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("GET");
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe(`${categoriesPath}/spending`);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      startDate: "2026-10-01",
      endDate: "2026-10-31",
    });
    expect(result.current.data).toEqual(tree);
    expect(queryClient.getQueryData(["categorySpending", 5, range])).toEqual(tree);
  });
});

describe("useGetCategoryUsage", () => {
  it("GETs the plan-scoped usage counts of the category", async () => {
    const counts = { transactions: 3, items: 1, recurrenceDefinitions: 0 };
    server.use(categoryHandlers.usage(counts));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useGetCategoryUsage(12), {
      plan: plan5,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["GET", `${categoriesPath}/12/usage`],
    ]);
    expect(result.current.data).toEqual(counts);
    expect(queryClient.getQueryData(["categoryUsage", 5, 12])).toEqual(counts);
  });
});
