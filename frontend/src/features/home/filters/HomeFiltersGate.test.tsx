import { act, cleanup, render } from "@testing-library/react";
import { useSyncExternalStore } from "react";
import { MemoryRouter, useLocation, type Location } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHomeFilters } from "../hooks/useHomeFilters";
import { HomeFiltersGate } from "./HomeFiltersGate";

let mockedUser: { id: number } | null = { id: 1 };

/** Minimal plan context store, so `setActivePlanId` re-renders like the real provider. */
type PlanState = {
  activePlanId: number | null;
  plans: { id: number }[];
  isLoading: boolean;
};
let planState: PlanState;
const planListeners = new Set<() => void>();
const setPlanState = (patch: Partial<PlanState>) => {
  planState = { ...planState, ...patch };
  planListeners.forEach((listener) => listener());
};
const subscribePlan = (listener: () => void) => {
  planListeners.add(listener);
  return () => planListeners.delete(listener);
};

vi.mock("@/app/providers/AuthProvider", () => ({
  useAuth: () => ({ user: mockedUser }),
}));
vi.mock("@/app/providers/PlanProvider", () => ({
  usePlanContext: () => ({
    ...useSyncExternalStore(subscribePlan, () => planState),
    setActivePlanId: (planId: number) => setPlanState({ activePlanId: planId }),
  }),
}));

let location: Location;
/** Query strings the gated children were rendered with, in order. */
let childRenders: string[];
/** `plan` param vs active plan for every child render. */
let childPlans: { urlPlan: string | null; activePlanId: number | null }[];
let filters: ReturnType<typeof useHomeFilters>;

const LocationProbe = () => {
  location = useLocation();
  return null;
};

const Child = () => {
  const { search } = useLocation();
  childRenders.push(search);
  childPlans.push({
    urlPlan: new URLSearchParams(search).get("plan"),
    activePlanId: planState.activePlanId,
  });
  filters = useHomeFilters();
  return null;
};

const tree = () => (
  <>
    <HomeFiltersGate>
      <Child />
    </HomeFiltersGate>
    <LocationProbe />
  </>
);

const renderAt = (url: string) =>
  render(<MemoryRouter initialEntries={[url]}>{tree()}</MemoryRouter>);

const params = () => Object.fromEntries(new URLSearchParams(location.search));

beforeEach(() => {
  localStorage.clear();
  mockedUser = { id: 1 };
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
      "homeFilters:1:5",
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
      "homeFilters:1:5",
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
    localStorage.setItem("homeFilters:1:5", "plan=5&member=3");

    renderAt("/?categoriesPeriod=last-3m");

    expect(params()).toEqual({ plan: "5", member: "3" });
  });

  it("applies URL params for the active plan and saves them as the new state", () => {
    localStorage.setItem("homeFilters:1:5", "plan=5&member=3");

    renderAt("/?plan=5&tab=transactions&q=market");

    expect(location.search).toBe("?plan=5&tab=transactions&q=market");
    expect(childRenders.every((s) => s === "?plan=5&tab=transactions&q=market")).toBe(true);
    expect(localStorage.getItem("homeFilters:1:5")).toBe(
      "plan=5&tab=transactions&q=market",
    );
  });

  it("applies URL params that have no plan to the active plan", () => {
    localStorage.setItem("homeFilters:1:5", "plan=5&member=3");

    renderAt("/?tab=transactions&category=12");

    expect(params()).toEqual({ tab: "transactions", category: "12", plan: "5" });
    expect(localStorage.getItem("homeFilters:1:5")).toBe(
      "tab=transactions&category=12&plan=5",
    );
  });

  it("loads each plan's own saved state on plan switch and back, without bouncing to the URL's plan", () => {
    planState.activePlanId = 4;
    renderAt("/?plan=4&category=12");
    expect(localStorage.getItem("homeFilters:1:4")).toBe("plan=4&category=12");

    localStorage.setItem("homeFilters:1:5", "plan=5&member=3");
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
    expect(localStorage.getItem("homeFilters:1:5")).toBe(
      "plan=5&category=12&q=market&sort=amount.desc",
    );

    act(() => filters.setTab("transactions"));
    expect(localStorage.getItem("homeFilters:1:5")).toBe(
      "plan=5&category=12&q=market&sort=amount.desc&tab=transactions",
    );

    act(() => filters.clearTransactions());
    expect(localStorage.getItem("homeFilters:1:5")).toBe(
      "plan=5&sort=amount.desc&tab=transactions",
    );
  });

  it("switches the active plan for a link to another plan the user belongs to and keeps its filters", () => {
    const consoleError = vi.spyOn(console, "error");
    localStorage.setItem("homeFilters:1:4", "plan=4&member=3");
    localStorage.setItem("homeFilters:1:5", "plan=5&tab=transactions");

    renderAt("/?plan=4&tab=transactions&category=12");

    expect(planState.activePlanId).toBe(4);
    expect(params()).toEqual({ plan: "4", tab: "transactions", category: "12" });
    expect(childRenders.length).toBeGreaterThan(0);
    expect(
      childPlans.every((c) => c.urlPlan === String(c.activePlanId)),
    ).toBe(true);
    expect(localStorage.getItem("homeFilters:1:4")).toBe(
      "plan=4&tab=transactions&category=12",
    );
    expect(localStorage.getItem("homeFilters:1:5")).toBe(
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
    localStorage.setItem("homeFilters:1:5", "plan=5&tab=transactions");

    renderAt("/?plan=9&category=12&member=3");

    expect(planState.activePlanId).toBe(5);
    expect(params()).toEqual({ plan: "5", tab: "transactions" });
    expect(childRenders.some((s) => s.includes("category"))).toBe(false);
  });

  it("does not redirect or render children while the user or active plan is loading", () => {
    planState.activePlanId = null;
    const { rerender } = renderAt("/");
    expect(location.search).toBe("");
    expect(childRenders).toEqual([]);

    planState.activePlanId = 5;
    mockedUser = null;
    rerender(<MemoryRouter initialEntries={["/"]}>{tree()}</MemoryRouter>);
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
