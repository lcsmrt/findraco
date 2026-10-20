import { waitFor } from "@testing-library/react";
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

  it("sends no request when id is null", () => {
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetFinancialTransactionCategory(null), {
      plan: plan5,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(requests).toEqual([]);
  });

  it("sends one request for a (plan, id) across re-renders", async () => {
    server.use(categoryHandlers.get(category));
    const requests = recordRequests();

    const { result, rerender } = renderHookWithProviders(
      () => useGetFinancialTransactionCategory(12),
      { plan: plan5 },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    rerender();
    rerender();

    expect(requests).toHaveLength(1);
  });

  it("uses the exported key builder so seeded data avoids the request", async () => {
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetFinancialTransactionCategory(12), {
      plan: plan5,
      seed: (queryClient) =>
        queryClient.setQueryData(financialTransactionCategoryKey(5, 12), category),
    });

    expect(result.current.data).toEqual(category);
    expect(financialTransactionCategoryKey(5, 12)).toEqual([
      "financialTransactionCategory",
      5,
      12,
    ]);
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(requests).toEqual([]);
  });
});

describe("category mutations refresh the category-by-id cache", () => {
  it("update refetches the edited category so its name is not stale", async () => {
    const renamed: FinancialTransactionCategory = { ...category, description: "Food" };
    server.use(categoryHandlers.update(renamed), categoryHandlers.get(renamed));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(
      () => ({
        query: useGetFinancialTransactionCategory(12),
        update: useUpdateFinancialTransactionCategory(),
      }),
      {
        plan: plan5,
        seed: (queryClient) =>
          queryClient.setQueryData(financialTransactionCategoryKey(5, 12), category),
      },
    );
    expect(result.current.query.data).toEqual(category);

    result.current.update.mutate({ params: { id: 12 }, body: { description: "Food" } });

    await waitFor(() => expect(result.current.query.data).toEqual(renamed));
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["PUT", `${categoriesPath}/12`],
      ["GET", `${categoriesPath}/12`],
    ]);
    expect(await requests[0].json()).toEqual({ description: "Food" });
  });

  it("update leaves other cached categories untouched", async () => {
    server.use(categoryHandlers.update({ ...category, description: "Food" }));

    const { result, queryClient } = renderHookWithProviders(
      () => useUpdateFinancialTransactionCategory(),
      {
        plan: plan5,
        seed: (client) =>
          client.setQueryData(financialTransactionCategoryKey(5, 13), {
            id: 13,
            type: "DEBIT",
            description: "Rent",
          }),
      },
    );
    result.current.mutate({ params: { id: 12 }, body: { description: "Food" } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(
      queryClient.getQueryState(financialTransactionCategoryKey(5, 13))?.isInvalidated,
    ).toBe(false);
  });

  it("delete refetches the deleted category so a filter on it sees the 404", async () => {
    server.use(categoryHandlers.delete(), categoryHandlers.getNotFound());
    const requests = recordRequests();

    const { result } = renderHookWithProviders(
      () => ({
        query: useGetFinancialTransactionCategory(12),
        remove: useDeleteFinancialTransactionCategory(),
      }),
      {
        plan: plan5,
        seed: (queryClient) =>
          queryClient.setQueryData(financialTransactionCategoryKey(5, 12), category),
      },
    );

    result.current.remove.mutate({ id: 12 });

    await waitFor(() => expect(result.current.query.isError).toBe(true));
    expect(result.current.query.error).toMatchObject({ response: { status: 404 } });
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["DELETE", `${categoriesPath}/12`],
      ["GET", `${categoriesPath}/12`],
    ]);
  });
});

describe("useCreateFinancialTransactionCategory", () => {
  it("POSTs the body to the plan-scoped collection and resolves with the created category", async () => {
    server.use(categoryHandlers.create(category));
    const requests = recordRequests();
    const body: CreateFinancialTransactionCategoryRequest["body"] = {
      type: "DEBIT",
      description: "Groceries",
      spendingLimit: 400,
      memberLimits: [{ memberId: 9, amount: 150 }],
    };

    const { result } = renderHookWithProviders(() => useCreateFinancialTransactionCategory(), {
      plan: plan5,
    });
    result.current.mutate({ body });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(new URL(requests[0].url).pathname).toBe(categoriesPath);
    expect(await requests[0].json()).toEqual(body);
    expect(result.current.data).toEqual(category);
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

  it("requests again when the range changes", async () => {
    server.use(categoryHandlers.spending(tree));
    const requests = recordRequests();
    const nextRange = { startDate: "2026-08-01", endDate: "2026-10-31" };

    const { result, rerender } = renderHookWithProviders(
      ({ r }: { r: typeof range }) => useGetCategorySpending(r),
      { plan: plan5, initialProps: { r: range } },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    rerender({ r: nextRange });

    await waitFor(() => expect(requests).toHaveLength(2));
    expect(Object.fromEntries(new URL(requests[1].url).searchParams)).toEqual(nextRange);
  });

  it("sends no request without an active plan", () => {
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetCategorySpending(range), {
      plan: planContext(null),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(requests).toEqual([]);
  });
});

describe("delete with reassignment", () => {
  it("sends no reassignTo when no target is given", async () => {
    server.use(categoryHandlers.delete());
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useDeleteFinancialTransactionCategory(), {
      plan: plan5,
    });
    result.current.mutate({ id: 12 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("DELETE");
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe(`${categoriesPath}/12`);
    expect(url.search).toBe("");
  });

  it("sends reassignTo when a target is given", async () => {
    server.use(categoryHandlers.delete());
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useDeleteFinancialTransactionCategory(), {
      plan: plan5,
    });
    result.current.mutate({ id: 12, reassignTo: 30 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("DELETE");
    const url = new URL(requests[0].url);
    expect(url.pathname).toBe(`${categoriesPath}/12`);
    expect(Object.fromEntries(url.searchParams)).toEqual({ reassignTo: "30" });
  });

  it("refreshes the transactions list after a reassignment", async () => {
    server.use(categoryHandlers.delete());

    const { result, queryClient } = renderHookWithProviders(
      () => useDeleteFinancialTransactionCategory(),
      {
        plan: plan5,
        seed: (client) => client.setQueryData(["financialTransactions", 5, {}], { content: [] }),
      },
    );
    result.current.mutate({ id: 12, reassignTo: 30 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryState(["financialTransactions", 5, {}])?.isInvalidated).toBe(true);
  });
});

const categoryMutations = {
  create: {
    handler: () => categoryHandlers.create(category),
    useCase: function useCreateCase() {
      const m = useCreateFinancialTransactionCategory();
      return {
        isSuccess: m.isSuccess,
        run: () => m.mutate({ body: { type: "DEBIT", description: "Groceries" } }),
      };
    },
  },
  update: {
    handler: () => categoryHandlers.update(category),
    useCase: function useUpdateCase() {
      const m = useUpdateFinancialTransactionCategory();
      return {
        isSuccess: m.isSuccess,
        run: () => m.mutate({ params: { id: 12 }, body: { description: "Groceries" } }),
      };
    },
  },
  delete: {
    handler: () => categoryHandlers.delete(),
    useCase: function useDeleteCase() {
      const m = useDeleteFinancialTransactionCategory();
      return { isSuccess: m.isSuccess, run: () => m.mutate({ id: 12 }) };
    },
  },
};

describe("every category mutation refreshes categories, spending and dashboard", () => {
  const seededKeys = [
    ["financialTransactionCategories", 5, undefined],
    ["categorySpending", 5, { startDate: "2026-10-01", endDate: "2026-10-31" }],
    ["dashboardSummary", 5, { startDate: "2026-10-01", endDate: "2026-10-31" }],
  ];

  it.each(["create", "update", "delete"] as const)("%s", async (name) => {
    server.use(categoryMutations[name].handler());

    const { result, queryClient } = renderHookWithProviders(categoryMutations[name].useCase, {
      plan: plan5,
      seed: (client) => seededKeys.forEach((key) => client.setQueryData(key, [])),
    });
    result.current.run();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(seededKeys.map((key) => queryClient.getQueryState(key)?.isInvalidated)).toEqual([
      true,
      true,
      true,
    ]);
  });
});

describe("every category mutation shows its short success message", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["create", "Category created."],
    ["update", "Category updated."],
    ["delete", "Category deleted."],
  ] as const)(`%s shows "%s" (NAV-05 AC 1, 2)`, async (name, message) => {
    // sonner is a third-party module; the toast is the user-visible outcome.
    const success = vi.spyOn(toast, "success");
    server.use(categoryMutations[name].handler());

    const { result } = renderHookWithProviders(categoryMutations[name].useCase, { plan: plan5 });
    result.current.run();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(success).toHaveBeenCalledWith(message);
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

  it("keys the counts by plan and category", () => {
    expect(categoryUsageKey(5, 12)).toEqual(["categoryUsage", 5, 12]);
    expect(categoryUsageKey(6, 12)).not.toEqual(categoryUsageKey(5, 12));
  });

  it("does not fetch without a category or while disabled", () => {
    const requests = recordRequests();

    renderHookWithProviders(() => useGetCategoryUsage(null), { plan: plan5 });
    renderHookWithProviders(() => useGetCategoryUsage(12, { enabled: false }), { plan: plan5 });

    expect(requests).toEqual([]);
  });

  it("is refreshed after a category is deleted", async () => {
    server.use(categoryHandlers.delete());

    const { result, queryClient } = renderHookWithProviders(
      () => useDeleteFinancialTransactionCategory(),
      {
        plan: plan5,
        seed: (client) =>
          client.setQueryData(categoryUsageKey(5, 1), {
            transactions: 0,
            items: 0,
            recurrenceDefinitions: 0,
          }),
      },
    );
    result.current.mutate({ id: 12, reassignTo: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryClient.getQueryState(categoryUsageKey(5, 1))?.isInvalidated).toBe(true);
  });
});
