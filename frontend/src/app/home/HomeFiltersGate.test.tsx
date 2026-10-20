import { act, cleanup } from "@testing-library/react";
import { useSyncExternalStore, type ReactNode } from "react";
import { useLocation, type Location } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@/api/dtos/user";
import type { AuthContextValue } from "@/app/providers/useAuth";
import { PlanContext } from "@/app/providers/usePlanContext";
import { OVERVIEW_PARAM_KEYS } from "@/features/overview/filters/overviewParams";
import { TRANSACTION_PARAM_KEYS } from "@/features/transactions/filters/transactionParams";
import { useTransactionFilters } from "@/features/transactions/filters/useTransactionFilters";
import { renderWithProviders } from "@/test/renderWithProviders";
import { HomeFiltersGate } from "./HomeFiltersGate";
import { TAB_PARAM } from "./homeParams";
import { useHomeTab } from "./useHomeTab";

const signedInUser: User = { id: 1, name: "Ana", email: "ana@example.com" };

function authValue(user: User | null): AuthContextValue {
  return {
    user,
    setUser: () => {},
    status: user ? "authenticated" : "loading",
    signIn: async () => {},
    signOut: async () => {},
    retry: () => {},
    announceSessionExpiry: () => {},
  };
}

/** Plan context state; `setActivePlanId` re-renders consumers like the real provider. */
type PlanState = {
  activePlanId: number | null;
  plans: { id: number }[];
  isLoading: boolean;
};
let planState: PlanState;
const planListeners = new Set<() => void>();
function setPlanState(patch: Partial<PlanState>) {
  planState = { ...planState, ...patch };
  planListeners.forEach((listener) => listener());
}
function subscribePlan(listener: () => void) {
  planListeners.add(listener);
  return () => planListeners.delete(listener);
}

/** Provides the real plan context with the test's state, so plan switches re-render the gate. */
function TestPlanContext({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribePlan, () => planState);
  const value = {
    activePlanId: state.activePlanId,
    isLoading: state.isLoading,
    plans: state.plans.map((plan) => ({
      id: plan.id,
      name: `Plan ${plan.id}`,
      isDefault: false,
      myRole: "OWNER" as const,
    })),
    setActivePlanId: (planId: number) => setPlanState({ activePlanId: planId }),
  };
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

let location: Location;
/** Query strings the gated children were rendered with, in order. */
let childRenders: string[];
/** `plan` param vs active plan for every child render. */
let childPlans: { urlPlan: string | null; activePlanId: number | null }[];
let filters: ReturnType<typeof useHomeTab> &
  ReturnType<typeof useTransactionFilters>;

function LocationProbe() {
  location = useLocation();
  return null;
}

function Child() {
  const { search } = useLocation();
  childRenders.push(search);
  childPlans.push({
    urlPlan: new URLSearchParams(search).get("plan"),
    activePlanId: planState.activePlanId,
  });
  filters = { ...useHomeTab(), ...useTransactionFilters() };
  return null;
}

function renderAt(url: string, user: User | null = signedInUser) {
  return renderWithProviders(
    <TestPlanContext>
      <HomeFiltersGate>
        <Child />
      </HomeFiltersGate>
      <LocationProbe />
    </TestPlanContext>,
    { route: url, auth: authValue(user) },
  );
}

function params() {
  return Object.fromEntries(new URLSearchParams(location.search));
}

beforeEach(() => {
  localStorage.clear();
  planState = { activePlanId: 5, plans: [{ id: 4 }, { id: 5 }], isLoading: false };
  childRenders = [];
  childPlans = [];
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("HomeFiltersGate", () => {
  it("restores the saved state into the URL before the children render", () => {
    localStorage.setItem(
      "filters:overview:1:5",
      "plan=5&tab=transactions&category=12&period=last-3m",
    );

    renderAt("/");

    expect(params()).toEqual({
      plan: "5",
      tab: "transactions",
      category: "12",
      period: "last-3m",
    });
    expect(childRenders.length).toBeGreaterThan(0);
    expect(
      childRenders.every((s) => s === "?plan=5&tab=transactions&category=12&period=last-3m"),
    ).toBe(true);
  });

  it("falls back to defaults with only the active plan when nothing is saved", () => {
    renderAt("/");

    expect(location.search).toBe("?plan=5");
    expect(childRenders.length).toBeGreaterThan(0);
    expect(childRenders.every((s) => s === "?plan=5")).toBe(true);
  });

  it("restores a saved Categories tab whose state still carries a legacy period", () => {
    localStorage.setItem(
      "filters:overview:1:5",
      "plan=5&tab=categories&categoriesPeriod=last-6m",
    );

    renderAt("/");

    expect(params()).toEqual({
      plan: "5",
      tab: "categories",
      categoriesPeriod: "last-6m",
    });
    expect(filters.tab).toBe("categories");
    expect("categories" in filters).toBe(false);
  });

  it("treats a link with only a legacy Categories period as no home params", () => {
    localStorage.setItem("filters:overview:1:5", "plan=5&member=3");

    renderAt("/?categoriesPeriod=last-3m");

    expect(params()).toEqual({ plan: "5", member: "3" });
  });

  it.each([TAB_PARAM, ...OVERVIEW_PARAM_KEYS, ...TRANSACTION_PARAM_KEYS])(
    "treats the exported key %s as a home param: a link with only it applies to the active plan",
    (key) => {
      localStorage.setItem("filters:overview:1:5", "plan=5&tab=categories&overviewMember=3");

      renderAt(`/?${key}=x`);

      expect(params()).toEqual({ [key]: "x", plan: "5" });
      expect(localStorage.getItem("filters:overview:1:5")).toBe(`${key}=x&plan=5`);
    },
  );

  it("applies URL params for the active plan and saves them as the new state", () => {
    localStorage.setItem("filters:overview:1:5", "plan=5&member=3");

    renderAt("/?plan=5&tab=transactions&q=market");

    expect(location.search).toBe("?plan=5&tab=transactions&q=market");
    expect(childRenders.every((s) => s === "?plan=5&tab=transactions&q=market")).toBe(true);
    expect(localStorage.getItem("filters:overview:1:5")).toBe(
      "plan=5&tab=transactions&q=market",
    );
  });

  it("applies URL params that have no plan to the active plan", () => {
    localStorage.setItem("filters:overview:1:5", "plan=5&member=3");

    renderAt("/?tab=transactions&category=12");

    expect(params()).toEqual({ tab: "transactions", category: "12", plan: "5" });
    expect(localStorage.getItem("filters:overview:1:5")).toBe(
      "tab=transactions&category=12&plan=5",
    );
  });

  it("loads each plan's own saved state on plan switch and back, without bouncing to the URL's plan", () => {
    planState.activePlanId = 4;
    renderAt("/?plan=4&category=12");
    expect(localStorage.getItem("filters:overview:1:4")).toBe("plan=4&category=12");

    localStorage.setItem("filters:overview:1:5", "plan=5&member=3");
    childRenders = [];
    act(() => setPlanState({ activePlanId: 5 }));
    expect(planState.activePlanId).toBe(5);
    expect(params()).toEqual({ plan: "5", member: "3" });
    expect(childRenders.every((s) => s === "?plan=5&member=3")).toBe(true);

    childRenders = [];
    act(() => setPlanState({ activePlanId: 4 }));
    expect(planState.activePlanId).toBe(4);
    expect(params()).toEqual({ plan: "4", category: "12" });
    expect(childRenders.every((s) => s === "?plan=4&category=12")).toBe(true);
  });

  it("saves filter, tab and clear changes made after mount", () => {
    renderAt("/?plan=5");

    act(() =>
      filters.updateTransactions((t) => ({
        ...t,
        filter: { ...t.filter, categoryId: 12, description: "market" },
        sort: { by: "amount", direction: "desc" },
      })),
    );
    expect(localStorage.getItem("filters:overview:1:5")).toBe(
      "plan=5&category=12&q=market&sort=amount.desc",
    );

    act(() => filters.setTab("transactions"));
    expect(localStorage.getItem("filters:overview:1:5")).toBe(
      "plan=5&category=12&q=market&sort=amount.desc&tab=transactions",
    );

    act(() => filters.clearTransactions());
    expect(localStorage.getItem("filters:overview:1:5")).toBe(
      "plan=5&sort=amount.desc&tab=transactions",
    );
  });

  it("switches the active plan for a link to another plan the user belongs to and keeps its filters", () => {
    const consoleError = vi.spyOn(console, "error");
    localStorage.setItem("filters:overview:1:4", "plan=4&member=3");
    localStorage.setItem("filters:overview:1:5", "plan=5&tab=transactions");

    renderAt("/?plan=4&tab=transactions&category=12");

    expect(planState.activePlanId).toBe(4);
    expect(params()).toEqual({ plan: "4", tab: "transactions", category: "12" });
    expect(childRenders.length).toBeGreaterThan(0);
    expect(
      childPlans.every((c) => c.urlPlan === String(c.activePlanId)),
    ).toBe(true);
    expect(localStorage.getItem("filters:overview:1:4")).toBe(
      "plan=4&tab=transactions&category=12",
    );
    expect(localStorage.getItem("filters:overview:1:5")).toBe(
      "plan=5&tab=transactions",
    );
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("waits for the plan list before deciding on a link to another plan", () => {
    planState.plans = [];
    planState.isLoading = true;

    renderAt("/?plan=4&category=12");
    expect(location.search).toBe("?plan=4&category=12");
    expect(planState.activePlanId).toBe(5);
    expect(childRenders).toEqual([]);

    act(() => setPlanState({ plans: [{ id: 4 }, { id: 5 }], isLoading: false }));
    expect(planState.activePlanId).toBe(4);
    expect(params()).toEqual({ plan: "4", category: "12" });
    expect(
      childPlans.every((c) => c.urlPlan === String(c.activePlanId)),
    ).toBe(true);
  });

  it("restores the active plan's state for a link to a plan the user does not belong to, never applying its ids", () => {
    localStorage.setItem("filters:overview:1:5", "plan=5&tab=transactions");

    renderAt("/?plan=9&category=12&member=3");

    expect(planState.activePlanId).toBe(5);
    expect(params()).toEqual({ plan: "5", tab: "transactions" });
    expect(childRenders.some((s) => s.includes("category"))).toBe(false);
  });

  it("does not redirect or render children while the user or active plan is loading", () => {
    planState.activePlanId = null;
    renderAt("/");
    expect(location.search).toBe("");
    expect(childRenders).toEqual([]);

    cleanup();
    planState.activePlanId = 5;
    renderAt("/", null);
    expect(location.search).toBe("");
    expect(childRenders).toEqual([]);
  });

  it("keeps filtering through the URL when localStorage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    renderAt("/");

    expect(location.search).toBe("?plan=5");
    expect(childRenders.length).toBeGreaterThan(0);
  });
});
