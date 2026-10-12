import { cleanup, render } from "@testing-library/react";
import { MemoryRouter, useLocation, type Location } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeFiltersGate } from "./HomeFiltersGate";

let mockedUser: { id: number } | null = { id: 1 };
let mockedActivePlanId: number | null = 5;

vi.mock("@/app/providers/AuthProvider", () => ({
  useAuth: () => ({ user: mockedUser }),
}));
vi.mock("@/app/providers/PlanProvider", () => ({
  usePlanContext: () => ({ activePlanId: mockedActivePlanId }),
}));

let location: Location;
/** Query strings the gated children were rendered with, in order. */
let childRenders: string[];

const LocationProbe = () => {
  location = useLocation();
  return null;
};

const Child = () => {
  childRenders.push(useLocation().search);
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
  mockedActivePlanId = 5;
  childRenders = [];
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

  it("loads each plan's own saved state on plan switch and back", () => {
    mockedActivePlanId = 4;
    const { rerender } = renderAt("/?plan=4&category=12");
    expect(localStorage.getItem("homeFilters:1:4")).toBe("plan=4&category=12");

    localStorage.setItem("homeFilters:1:5", "plan=5&member=3");
    mockedActivePlanId = 5;
    childRenders = [];
    rerender(<MemoryRouter>{tree()}</MemoryRouter>);
    expect(params()).toEqual({ plan: "5", member: "3" });
    expect(childRenders.every((s) => s === "?plan=5&member=3")).toBe(true);

    mockedActivePlanId = 4;
    childRenders = [];
    rerender(<MemoryRouter>{tree()}</MemoryRouter>);
    expect(params()).toEqual({ plan: "4", category: "12" });
    expect(childRenders.every((s) => s === "?plan=4&category=12")).toBe(true);
  });

  it("restores the active plan's state for a URL of another plan, never applying its ids", () => {
    localStorage.setItem("homeFilters:1:5", "plan=5&tab=transactions");

    renderAt("/?plan=4&category=12&member=3");

    expect(params()).toEqual({ plan: "5", tab: "transactions" });
    expect(childRenders.some((s) => s.includes("category"))).toBe(false);
  });

  it("does not redirect or render children while the user or active plan is loading", () => {
    mockedActivePlanId = null;
    const { rerender } = renderAt("/");
    expect(location.search).toBe("");
    expect(childRenders).toEqual([]);

    mockedActivePlanId = 5;
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
