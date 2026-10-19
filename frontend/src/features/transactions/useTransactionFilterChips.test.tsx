import { act, cleanup, waitFor } from "@testing-library/react";
import type { HttpHandler } from "msw";
import { useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FinancialTransactionCategory, Plan, PlanMember } from "@/api/dtos";
import { financialTransactionCategoryHandlers } from "@/api/services/financialTransactionCategory.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { useTransactionFilters } from "./filters/useTransactionFilters";
import { useTransactionFilterChips } from "./useTransactionFilterChips";

const PLAN_ID = 5;
const MEMBERS_PATH = "/api/findraco/plan/5/members";
const CATEGORY_PATH = "/api/findraco/plan/5/financial-transaction-category/12";
const members: PlanMember[] = [
  { userId: 7, name: "Ana", email: "ana@x.com", role: "OWNER" },
  { userId: 8, name: "Bruno", email: "bruno@x.com", role: "EDITOR" },
];
const groceries: FinancialTransactionCategory = {
  id: 12,
  type: "DEBIT",
  description: "Groceries",
};

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

/** Members always resolve; the category request is answered by `category`. */
function setup(url: string, category: HttpHandler = financialTransactionCategoryHandlers.get(groceries)) {
  server.use(planHandlers.members(members), category);
  const requests = recordRequests();
  const hook = renderHookWithProviders(
    () => ({
      chips: useTransactionFilterChips(),
      home: useTransactionFilters(),
      location: useLocation(),
    }),
    {
      route: url,
      plan: planValue(),
      // The hook's own retry rule decides whether a failed category is retried; no delay between tries.
      seed: (queryClient) =>
        queryClient.setDefaultOptions({
          ...queryClient.getDefaultOptions(),
          queries: { ...queryClient.getDefaultOptions().queries, retryDelay: 0 },
        }),
    },
  );
  return { ...hook, requests };
}

type Rendered = ReturnType<typeof setup>;

function labels(result: Rendered["result"]) {
  return result.current.chips.chips.map((c) => c.label);
}

function params(result: Rendered["result"]) {
  return Object.fromEntries(new URLSearchParams(result.current.location.search));
}

function requestsTo(requests: Request[], path: string) {
  return requests.filter((request) => new URL(request.url).pathname === path).length;
}

afterEach(() => {
  cleanup();
});

describe("useTransactionFilterChips", () => {
  it("labels every active filter like the current chips, with category and member names", async () => {
    const { result } = setup(
      "/?plan=5&type=DEBIT&category=12&member=7&from=2026-10-01&to=2026-10-31&min=50&max=200",
    );

    await waitFor(() => expect(result.current.chips.chips).toHaveLength(5));
    expect(labels(result)).toEqual([
      "Debit",
      "Groceries",
      "Ana",
      "01/10/2026 – 31/10/2026",
      "R$ 50,00 – R$ 200,00",
    ]);
    expect(result.current.chips.category).toEqual(groceries);
    expect(result.current.chips.member).toEqual({ id: 7, name: "Ana" });
  });

  it("labels open-ended date and amount ranges and the credit type", () => {
    const { result, unmount } = setup("/?plan=5&type=CREDIT&from=2026-10-01&min=50");
    expect(labels(result)).toEqual(["Credit", "From 01/10/2026", "≥ R$ 50,00"]);
    unmount();

    const { result: upper } = setup("/?plan=5&to=2026-10-31&max=200");
    expect(labels(upper)).toEqual(["Until 31/10/2026", "≤ R$ 200,00"]);
  });

  it("removing a chip removes only its params from the URL", () => {
    const { result } = setup("/?plan=5&type=DEBIT&from=2026-10-01&to=2026-10-31");

    const dateChip = result.current.chips.chips.find((c) => c.key === "date")!;
    act(() => dateChip.onRemove());

    expect(params(result)).toEqual({ plan: "5", type: "DEBIT" });
    expect(labels(result)).toEqual(["Debit"]);
  });

  it("shows a seeded (picked) category with zero category requests", async () => {
    const { result, requests } = setup("/?plan=5");

    act(() => {
      result.current.chips.seedCategory(groceries);
      result.current.home.updateTransactions((t) => ({
        ...t,
        filter: { ...t.filter, categoryId: 12 },
      }));
    });

    expect(labels(result)).toEqual(["Groceries"]);
    await waitFor(() => expect(requestsTo(requests, MEMBERS_PATH)).toBe(1));
    expect(requestsTo(requests, CATEGORY_PATH)).toBe(0);
  });

  it("drops a category that no longer exists (404) from the URL", async () => {
    const { result, requests } = setup(
      "/?plan=5&category=12&type=DEBIT",
      financialTransactionCategoryHandlers.getNotFound(),
    );

    await waitFor(() => expect(params(result)).toEqual({ plan: "5", type: "DEBIT" }));
    expect(result.current.home.transactions.filter.categoryId).toBeUndefined();
    expect(labels(result)).toEqual(["Debit"]);
    expect(requestsTo(requests, CATEGORY_PATH)).toBe(1);
  });

  it.each([
    ["a server error (500)", financialTransactionCategoryHandlers.getServerError],
    ["a network error", financialTransactionCategoryHandlers.getNetworkError],
  ])("keeps the category filter when fetching it fails with %s", async (_, failure) => {
    const { result, queryClient } = setup("/?plan=5&category=12&type=DEBIT", failure());

    await waitFor(() =>
      expect(
        queryClient.getQueryState(["financialTransactionCategory", 5, 12])
          ?.status,
      ).toBe("error"),
    );
    await act(async () => {});

    expect(params(result)).toEqual({ plan: "5", category: "12", type: "DEBIT" });
    expect(result.current.home.transactions.filter.categoryId).toBe(12);
  });

  it("drops a member who is not in the plan once members are loaded", async () => {
    const { result } = setup("/?plan=5&member=99&category=12");

    await waitFor(() => expect(params(result)).toEqual({ plan: "5", category: "12" }));
    expect(result.current.home.transactions.filter.memberId).toBeUndefined();
    await waitFor(() => expect(labels(result)).toEqual(["Groceries"]));
  });
});
