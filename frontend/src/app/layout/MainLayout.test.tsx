import type {
  DashboardSummaryResponse,
  Transaction,
  Category,
  PagedResponse,
  Plan,
  PlanMember,
} from "@/api/dtos";
import { dashboardHandlers } from "@/api/services/dashboard.handlers";
import { transactionHandlers } from "@/api/services/transaction.handlers";
import { categoryHandlers } from "@/api/services/category.handlers";
import { invitationHandlers } from "@/api/services/invitation.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import type { AuthContextValue } from "@/app/providers/useAuth";
import { PlanContext, type PlanContextValue } from "@/app/providers/usePlanContext";
import type { ThemeContextValue } from "@/app/providers/useTheme";
import { AppRouter } from "@/app/routing/AppRouter";
import { ConfirmDialogProvider } from "@/components/dialog/ConfirmDialogProvider";
import { SeriesScopeDialogProvider } from "@/features/transactions/components/SeriesScopeDialogProvider";
import {
  CategoryFormSheetContext,
  type CategoryFormSheetContextValue,
} from "@/hooks/useCategoryFormSheet";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ana: PlanMember = { userId: 1, name: "Ana", email: "ana@example.com", role: "EDITOR" };
const editorPlan: Plan = { id: 5, name: "Home", isDefault: true, myRole: "EDITOR", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: false, managePlan: false } };
const viewerPlan: Plan = { id: 6, name: "Parents", isDefault: false, myRole: "VIEWER", permissions: { createTransactions: false, attributeToOthers: false, manageCategories: false, managePlan: false } };

const emptySummary: DashboardSummaryResponse = {
  totalIncome: 0,
  totalExpenses: 0,
  netBalance: 0,
  personBreakdown: [],
};

const created: Transaction = {
  id: 42,
  permissions: { edit: true, delete: true },
  version: 0,
  type: "DEBIT",
  amount: 12.34,
  description: "Groceries",
  startDate: "2026-10-19",
  endDate: "2026-10-19",
  splitMode: "EQUAL",
  participants: [],
  items: [],
};

function emptyPage<T>(): PagedResponse<T> {
  return { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true };
}

function authValue(): AuthContextValue {
  return {
    user: {
      id: ana.userId,
      name: ana.name,
      email: ana.email,
      timeZone: "America/Sao_Paulo",
      timeZoneMode: "AUTOMATIC",
    },
    setUser: vi.fn(),
    status: "authenticated",
    signIn: vi.fn(),
    signOut: vi.fn(),
    retry: vi.fn(),
    announceSessionExpiry: vi.fn(),
  };
}

const theme: ThemeContextValue = { theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() };
const categorySheet: CategoryFormSheetContextValue = { openCreate: vi.fn(), openEdit: vi.fn() };

type PlanState = { plans: Plan[]; activePlanId: number | null; isLoading: boolean };

/** The real plan context with state, so choosing a plan in the switcher switches it as the app does. */
function StatefulPlan({ initial, children }: { initial: PlanState; children: ReactNode }) {
  const [activePlanId, setActivePlanId] = useState(initial.activePlanId);
  const value: PlanContextValue = {
    plans: initial.plans,
    activePlanId,
    activePlan: initial.plans.find((plan) => plan.id === activePlanId),
    setActivePlanId,
    isLoading: initial.isLoading,
  };
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

let pathname: string;
function LocationProbe() {
  pathname = useLocation().pathname;
  return null;
}

function renderAt(route: string, plan: PlanState = { plans: [editorPlan], activePlanId: 5, isLoading: false }) {
  return renderWithProviders(
    <StatefulPlan initial={plan}>
      <CategoryFormSheetContext.Provider value={categorySheet}>
        <ConfirmDialogProvider>
          <SeriesScopeDialogProvider>
            <AppRouter />
            <LocationProbe />
          </SeriesScopeDialogProvider>
        </ConfirmDialogProvider>
      </CategoryFormSheetContext.Provider>
    </StatefulPlan>,
    { route, auth: authValue(), theme },
  );
}

function bottomBar() {
  return screen.getByRole("navigation", { name: "Bottom bar" });
}

function tabRow() {
  return screen.getByRole("navigation", { name: "Destinations" });
}

function summaryRequests(requests: Request[]) {
  return requests.filter(
    (request) => request.method === "GET" && new URL(request.url).pathname.endsWith("/dashboard"),
  );
}

async function fillAndCreate(user: ReturnType<typeof userEvent.setup>) {
  const form = await screen.findByRole("dialog", { name: "New Transaction" });
  await user.type(within(form).getByLabelText("Description"), "Groceries");
  await user.type(within(form).getByLabelText("Amount"), "1234");
  await user.click(within(form).getByRole("button", { name: "Create" }));
}

// jsdom has no ResizeObserver; the Overview's chart container needs one to mount.
class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", NoopResizeObserver);
  // The toast is the user-visible outcome of a save; sonner is a third-party module.
  vi.spyOn(toast, "success");
  localStorage.clear();
  server.use(
    planHandlers.members([ana]),
    dashboardHandlers.summary(emptySummary),
    dashboardHandlers.trend([]),
    categoryHandlers.spending([]),
    categoryHandlers.list(emptyPage<Category>()),
    transactionHandlers.list(emptyPage<Transaction>()),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("MainLayout navigation", () => {
  it("tapping a destination in the bottom bar navigates to it and marks it active (NAV-01 AC 5, 6)", async () => {
    const user = userEvent.setup();
    renderAt("/plans");

    await user.click(within(bottomBar()).getByRole("link", { name: "Categories" }));

    await waitFor(() => expect(pathname).toBe("/categories"));
    expect(within(bottomBar()).getByRole("link", { name: "Categories" }).getAttribute("aria-current")).toBe("page");
  });

  it("tapping Transactions restores that screen's saved filters for the active plan (NAV-01 AC 5)", async () => {
    const user = userEvent.setup();
    localStorage.setItem(`filters:transactions:${ana.userId}:5`, "?plan=5&q=mercado");
    renderAt("/plans");

    await user.click(within(bottomBar()).getByRole("link", { name: "Transactions" }));

    expect(
      (await screen.findByRole<HTMLInputElement>("textbox", { name: "Search transactions" })).value,
    ).toBe("mercado");
  });

  it("the Plans tab in the tab row navigates to /plans and is marked active (NAV-03 AC 3; NAV-03 AC 2)", async () => {
    const user = userEvent.setup();
    renderAt("/overview");
    expect(within(tabRow()).getByRole("link", { name: "Overview" }).getAttribute("aria-current")).toBe("page");

    await user.click(within(tabRow()).getByRole("link", { name: "Plans" }));

    await waitFor(() => expect(pathname).toBe("/plans"));
    expect(within(tabRow()).getByRole("link", { name: "Plans" }).getAttribute("aria-current")).toBe("page");
  });

  it("the accept-invitation page shows neither the tab row nor the bottom bar (NAV-03 edge)", async () => {
    server.use(invitationHandlers.preview({ planName: "Parents", role: "VIEWER", invitedByName: "Bia" }));
    renderAt("/invitation/abc");

    expect(await screen.findByText(/Parents/)).toBeTruthy();
    expect(screen.queryByRole("navigation", { name: "Bottom bar" })).toBeNull();
    expect(screen.queryByRole("navigation", { name: "Destinations" })).toBeNull();
    expect(screen.queryByRole("button", { name: "New Transaction" })).toBeNull();
  });
});

describe("MainLayout global add", () => {
  it("the bottom-bar add opens New Transaction with Expense selected (NAV-02 AC 2)", async () => {
    const user = userEvent.setup();
    renderAt("/overview");

    await user.click(within(bottomBar()).getByRole("button", { name: "New Transaction" }));

    const form = await screen.findByRole("dialog", { name: "New Transaction" });
    expect(within(form).getByRole("button", { name: "Debit" }).getAttribute("aria-pressed")).toBe("true");
    expect(within(form).getByRole("button", { name: "Credit" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("saving from the Overview closes the form, stays there, shows \"Transaction added.\" and refetches the summary (NAV-02 AC 1, 3, 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(transactionHandlers.create(created));
    renderAt("/overview");
    await waitFor(() => expect(summaryRequests(requests)).toHaveLength(1));

    await user.click(within(tabRow()).getByRole("button", { name: "New Transaction" }));
    await fillAndCreate(user);

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "New Transaction" })).toBeNull());
    expect(pathname).toBe("/overview");
    expect(toast.success).toHaveBeenCalledWith("Transaction added.");
    await waitFor(() => expect(summaryRequests(requests)).toHaveLength(2));
  });

  it("saving from the Plans page stays on the Plans page (NAV-02 edge)", async () => {
    const user = userEvent.setup();
    server.use(transactionHandlers.create(created));
    renderAt("/plans");

    await user.click(within(bottomBar()).getByRole("button", { name: "New Transaction" }));
    await fillAndCreate(user);

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "New Transaction" })).toBeNull());
    expect(pathname).toBe("/plans");
    expect(toast.success).toHaveBeenCalledWith("Transaction added.");
  });

  it("a failed create keeps the form open with its values and shows no success toast (NAV-02 AC 7)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(transactionHandlers.createRejected(422, "items-exceed-amount"));
    renderAt("/overview");

    await user.click(within(bottomBar()).getByRole("button", { name: "New Transaction" }));
    await fillAndCreate(user);

    await waitFor(() => expect(requests.some((request) => request.method === "POST")).toBe(true));
    const form = screen.getByRole("dialog", { name: "New Transaction" });
    expect(within(form).getByLabelText<HTMLInputElement>("Description").value).toBe("Groceries");
    expect(within(form).getByLabelText<HTMLInputElement>("Amount").value).toBe("R$ 12,34");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("a VIEWER sees neither the bottom-bar add nor New Transaction, and the bar keeps its four destinations (NAV-02 AC 5, 6)", async () => {
    renderAt("/overview", { plans: [viewerPlan], activePlanId: 6, isLoading: false });

    expect(await screen.findByRole("button", { name: "Previous period" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "New Transaction" })).toBeNull();
    expect(within(bottomBar()).getAllByRole("link")).toHaveLength(4);
  });

  it("switching from an EDITOR plan to a VIEWER plan hides the add without a reload (NAV-02 edge)", async () => {
    const user = userEvent.setup();
    renderAt("/overview", { plans: [editorPlan, viewerPlan], activePlanId: 5, isLoading: false });
    expect(within(bottomBar()).getByRole("button", { name: "New Transaction" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /Home/ }));
    await user.click(await screen.findByRole("menuitemradio", { name: "Parents" }));

    await waitFor(() => expect(screen.queryByRole("button", { name: "New Transaction" })).toBeNull());
    expect(pathname).toBe("/overview");
  });

  it("while plans load, neither add shows (NAV-02 edge)", () => {
    renderAt("/overview", { plans: [], activePlanId: null, isLoading: true });

    expect(bottomBar()).toBeTruthy();
    expect(screen.queryByRole("button", { name: "New Transaction" })).toBeNull();
  });
});
