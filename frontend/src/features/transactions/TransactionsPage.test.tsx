import type {
  FinancialTransaction,
  FinancialTransactionCategory,
  PagedResponse,
  Plan,
  PlanMember,
} from "@/api/dtos";
import { financialTransactionHandlers } from "@/api/services/financialTransaction.handlers";
import { financialTransactionCategoryHandlers } from "@/api/services/financialTransactionCategory.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import type { AuthContextValue } from "@/app/providers/useAuth";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { ConfirmDialogProvider } from "@/components/dialog/ConfirmDialogProvider";
import {
  CategoryFormSheetContext,
  type CategoryFormSheetContextValue,
} from "@/hooks/useCategoryFormSheet";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SeriesScopeDialogProvider } from "./components/SeriesScopeDialogProvider";
import { TransactionsPage } from "./TransactionsPage";

const PLAN_ID = 5;
const API = `/api/findraco/plan/${PLAN_ID}/financial-transaction`;

const lucas: PlanMember = { userId: 1, name: "Lucas", email: "lucas@example.com", role: "OWNER" };
const livia: PlanMember = { userId: 2, name: "Livia", email: "livia@example.com", role: "EDITOR" };

const rent: FinancialTransaction = {
  id: 42,
  type: "DEBIT",
  amount: 150.5,
  description: "Rent",
  startDate: "2026-07-01",
  endDate: "2026-07-01",
  splitMode: "EQUAL",
  participants: [],
  items: [],
};

const noCategories: PagedResponse<FinancialTransactionCategory> = {
  content: [],
  page: 0,
  size: 1000,
  totalElements: 0,
  totalPages: 0,
  last: true,
};

function pageOf(content: FinancialTransaction[], page = 0): PagedResponse<FinancialTransaction> {
  return { content, page, size: 10, totalElements: 25, totalPages: 3, last: page === 2 };
}

function authValue(): AuthContextValue {
  return {
    user: { id: lucas.userId, name: lucas.name, email: lucas.email },
    setUser: vi.fn(),
    status: "authenticated",
    signIn: vi.fn(),
    signOut: vi.fn(),
    retry: vi.fn(),
    announceSessionExpiry: vi.fn(),
  };
}

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

const categorySheet: CategoryFormSheetContextValue = { openCreate: vi.fn(), openEdit: vi.fn() };

function renderTab() {
  server.use(
    financialTransactionHandlers.list(pageOf([rent])),
    planHandlers.members([lucas, livia]),
    financialTransactionCategoryHandlers.list(noCategories),
  );
  const requests = recordRequests();
  renderWithProviders(
    <CategoryFormSheetContext.Provider value={categorySheet}>
      <ConfirmDialogProvider>
        <SeriesScopeDialogProvider>
          <TransactionsPage />
        </SeriesScopeDialogProvider>
      </ConfirmDialogProvider>
      {/* The real Toaster shows the outcome the user reads. */}
      <Toaster />
    </CategoryFormSheetContext.Provider>,
    { auth: authValue(), plan: planValue() },
  );
  return { requests, user: userEvent.setup() };
}

/** Query params of every transaction-list request, in order. */
function listQueries(requests: Request[]) {
  return requests
    .filter((request) => request.method === "GET" && new URL(request.url).pathname === API)
    .map((request) => Object.fromEntries(new URL(request.url).searchParams));
}

async function tableRow(description: string) {
  const table = await screen.findByRole("table");
  const cell = await within(table).findByText(description);
  const row = cell.closest("tr");
  if (!row) throw new Error(`No table row for ${description}`);
  return within(row);
}

afterEach(cleanup);

describe("TransactionsPage toolbar", () => {
  it("shows search, filters and import, and neither New Transaction nor Manage Categories (NAV-02 AC 8; NAV-04 AC 1, 2)", async () => {
    renderTab();
    await tableRow("Rent");

    expect(screen.getByRole("textbox", { name: "Search transactions" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Filters" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Import CSV" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "New Transaction" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Manage Categories" })).toBeNull();
  });
});

describe("TransactionsPage (STD-12 AC 1, 2)", () => {
  it("loads the first page of transactions", async () => {
    const { requests } = renderTab();

    await tableRow("Rent");
    expect(listQueries(requests)).toEqual([{ page: "0", size: "10" }]);
  });

  it("searches by description once typing settles", async () => {
    const { requests, user } = renderTab();
    await tableRow("Rent");

    await user.type(screen.getByRole("textbox", { name: "Search transactions" }), "rent");

    await waitFor(
      () =>
        expect(listQueries(requests).at(-1)).toEqual({ page: "0", size: "10", description: "rent" }),
      { timeout: 2000 },
    );
    expect(listQueries(requests).some((query) => query.description === "r")).toBe(false);
  });

  it("requests the next page from the pagination built from the response", async () => {
    const { requests, user } = renderTab();
    await tableRow("Rent");

    expect(screen.getAllByText("Page 1 of 3").length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole("button", { name: "Next page" })[0]);

    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({ page: "1", size: "10" }),
    );
  });

  it("opens the drawer on the transaction to edit it", async () => {
    const { user } = renderTab();
    const row = await tableRow("Rent");

    await user.click(row.getByRole("button", { name: "Edit" }));

    const drawer = await screen.findByRole("dialog", { name: "Edit Transaction" });
    expect(within(drawer).getByRole("textbox", { name: "Description" })).toHaveProperty(
      "value",
      "Rent",
    );
  });

  it("opens the drawer prefilled to duplicate the transaction", async () => {
    const { user } = renderTab();
    const row = await tableRow("Rent");

    await user.click(row.getByRole("button", { name: "Duplicate" }));

    const drawer = await screen.findByRole("dialog", { name: "Duplicate Transaction" });
    expect(within(drawer).getByRole("textbox", { name: "Description" })).toHaveProperty(
      "value",
      "Rent",
    );
  });

  it("deletes the transaction once confirmed", async () => {
    const { requests, user } = renderTab();
    const row = await tableRow("Rent");
    server.use(financialTransactionHandlers.remove());

    await user.click(row.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog", { name: "Confirm Deletion" });
    await user.click(within(dialog).getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(requests.some((r) => r.method === "DELETE" && new URL(r.url).pathname === `${API}/42`)).toBe(true),
    );
  });
});

describe("TransactionsPage CSV import (STD-12 AC 1)", () => {
  const csv = new File(["date,amount,id,title\n01/07/2026,10.00,a1,Coffee"], "nubank.csv", {
    type: "text/csv",
  });

  function fileInput() {
    const input = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) throw new Error("No file input");
    return input;
  }

  function importRequests(requests: Request[]) {
    return requests.filter(
      (request) => request.method === "POST" && new URL(request.url).pathname === `${API}/import`,
    );
  }

  it("uploads the chosen file, shows the result and refreshes the list", async () => {
    const { requests, user } = renderTab();
    await tableRow("Rent");
    server.use(financialTransactionHandlers.importCsv({ imported: 1 }));

    await user.upload(fileInput(), csv);

    expect(await screen.findByText("Transactions imported.")).toBeTruthy();
    // jsdom's FormData reaches MSW unserialised, so the request is asserted by method and URL.
    expect(importRequests(requests)).toHaveLength(1);
    await waitFor(() => expect(listQueries(requests)).toHaveLength(2));
  });

  it("shows the API's message and leaves the list alone when the file is rejected", async () => {
    const { requests, user } = renderTab();
    await tableRow("Rent");
    server.use(
      financialTransactionHandlers.importCsvRejected("Line 3 of the CSV is invalid: bad date"),
    );

    await user.upload(fileInput(), csv);

    expect(await screen.findByText("Line 3 of the CSV is invalid: bad date")).toBeTruthy();
    expect(importRequests(requests)).toHaveLength(1);
    expect(screen.queryByText("Transactions imported.")).toBeNull();
    expect(listQueries(requests)).toHaveLength(1);
  });
});
