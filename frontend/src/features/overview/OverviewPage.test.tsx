import type { DashboardSummaryResponse, Plan, PlanMember } from "@/api/dtos";
import { dashboardHandlers } from "@/api/services/dashboard.handlers";
import { categoryHandlers } from "@/api/services/category.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, type Location } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OverviewPage } from "./OverviewPage";

const PLAN_ID = 5;
const API = `/api/findraco/plan/${PLAN_ID}/dashboard`;

const ana: PlanMember = { userId: 7, name: "Ana", email: "ana@x.com", role: "OWNER" };
const bruno: PlanMember = { userId: 8, name: "Bruno", email: "bruno@x.com", role: "EDITOR" };

// The plan's net balance and Ana's differ, so the balance shown names whose figures they are.
const summary: DashboardSummaryResponse = {
  totalIncome: 5000,
  totalExpenses: 3200,
  netBalance: 1800,
  personBreakdown: [
    { userId: 7, name: "Ana", income: 3000, expense: 2222.23, net: 777.77 },
    { userId: 8, name: "Bruno", income: 2000, expense: 977.77, net: 1022.23 },
  ],
};

function planValue(): PlanContextValue {
  const plan: Plan = { id: PLAN_ID, name: "Home", isDefault: true, myRole: "OWNER", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true } };
  return {
    activePlanId: PLAN_ID,
    setActivePlanId: vi.fn(),
    activePlan: plan,
    plans: [plan],
    isLoading: false,
  };
}

let location: Location;

function LocationProbe() {
  location = useLocation();
  return null;
}

function renderOverview(route: string, members: PlanMember[]) {
  server.use(
    planHandlers.members(members),
    dashboardHandlers.summary(summary),
    dashboardHandlers.trend([]),
    categoryHandlers.spending([]),
  );
  const requests = recordRequests();
  renderWithProviders(
    <>
      <OverviewPage />
      <LocationProbe />
    </>,
    { route, plan: planValue() },
  );
  return { requests, user: userEvent.setup() };
}

/** Query params of every request to `path`, in order. */
function queries(requests: Request[], path: string) {
  return requests
    .filter((request) => new URL(request.url).pathname === path)
    .map((request) => Object.fromEntries(new URL(request.url).searchParams));
}

function lastTrendQuery(requests: Request[]) {
  const last = queries(requests, `${API}/trend`).at(-1);
  if (!last) throw new Error("No trend request yet");
  return last;
}

function searchParams() {
  return Object.fromEntries(new URLSearchParams(location.search));
}

// jsdom has no ResizeObserver; the Overview's chart container needs one to mount.
class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", NoopResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("OverviewPage member filter", () => {
  it("applies the chosen member to the summary and asks for that member's trend", async () => {
    const { requests, user } = renderOverview("/?plan=5", [ana, bruno]);

    await user.click(await screen.findByRole("button", { name: "Ana" }));

    await waitFor(() => expect(lastTrendQuery(requests)).toHaveProperty("memberId", "7"));
    expect(searchParams()).toEqual({ plan: "5", overviewMember: "7" });
    expect((await screen.findAllByText(/777,77/)).length).toBeGreaterThan(0);
    // The summary stays unfiltered: the member is applied on screen, so the others can be dimmed.
    expect(queries(requests, API).every((query) => query.memberId === undefined)).toBe(true);
  });

  it("hides the filter and ignores a saved member on a single-member plan", async () => {
    const { requests } = renderOverview("/?plan=5&overviewMember=7", [ana]);

    expect((await screen.findAllByText(/1\.800,00/)).length).toBeGreaterThan(0);
    await waitFor(() => expect(lastTrendQuery(requests)).not.toHaveProperty("memberId"));
    expect(screen.queryByRole("button", { name: "All" })).toBeNull();
    expect(screen.queryAllByText(/777,77/)).toEqual([]);
  });

  it("drops a member who is no longer in the plan from the URL", async () => {
    const { requests } = renderOverview("/?plan=5&period=last-3m&overviewMember=99", [ana, bruno]);

    await waitFor(() => expect(searchParams()).toEqual({ plan: "5", period: "last-3m" }));
    await waitFor(() => expect(lastTrendQuery(requests)).not.toHaveProperty("memberId"));
    expect(screen.getByRole("button", { name: "All" }).getAttribute("aria-pressed")).toBe("true");
  });
});
