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
import { planHandlers } from "@/api/services/plan.handlers";
import type { AuthContextValue } from "@/app/providers/useAuth";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import type { ThemeContextValue } from "@/app/providers/useTheme";
import { ConfirmDialogProvider } from "@/components/dialog/ConfirmDialogProvider";
import { SeriesScopeDialogProvider } from "@/features/transactions/components/SeriesScopeDialogProvider";
import {
  CategoryFormSheetContext,
  type CategoryFormSheetContextValue,
} from "@/hooks/useCategoryFormSheet";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppRouter } from "./AppRouter";

const PLAN_ID = 5;
const ana: PlanMember = { userId: 1, name: "Ana", email: "ana@example.com", role: "EDITOR" };
const plan: Plan = { id: PLAN_ID, name: "Home", isDefault: true, myRole: "EDITOR", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: false, managePlan: false } };

const emptySummary: DashboardSummaryResponse = {
  totalIncome: 0,
  totalExpenses: 0,
  netBalance: 0,
  personBreakdown: [],
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

function planValue(): PlanContextValue {
  return {
    activePlanId: PLAN_ID,
    setActivePlanId: vi.fn(),
    activePlan: plan,
    plans: [plan],
    isLoading: false,
  };
}

const theme: ThemeContextValue = { theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() };
const categorySheet: CategoryFormSheetContextValue = { openCreate: vi.fn(), openEdit: vi.fn() };

let pathname: string;
function LocationProbe() {
  pathname = useLocation().pathname;
  return null;
}

function renderAt(route: string) {
  renderWithProviders(
    <CategoryFormSheetContext.Provider value={categorySheet}>
      <ConfirmDialogProvider>
        <SeriesScopeDialogProvider>
          <AppRouter />
          <LocationProbe />
        </SeriesScopeDialogProvider>
      </ConfirmDialogProvider>
    </CategoryFormSheetContext.Provider>,
    { route, auth: authValue(), plan: planValue(), theme },
  );
}

// jsdom has no ResizeObserver; the Overview's chart container needs one to mount.
class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", NoopResizeObserver);
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
  vi.unstubAllGlobals();
});

describe("AppRouter", () => {
  it("redirects / to /overview (NAV-06 AC 6)", async () => {
    renderAt("/");

    expect(await screen.findByRole("button", { name: "Previous period" })).toBeTruthy();
    // Both screens have a period navigator; the search box tells Transactions apart.
    expect(screen.queryByRole("textbox", { name: "Search transactions" })).toBeNull();
    expect(pathname).toBe("/overview");
  });

  it("serves Transactions at /transactions (NAV-06 AC 1)", async () => {
    renderAt("/transactions");

    expect(await screen.findByRole("textbox", { name: "Search transactions" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Previous period" })).toBeTruthy();
    expect(pathname).toBe("/transactions");
  });
});
