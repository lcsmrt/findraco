import type {
  Transaction,
  Category,
  PagedResponse,
  Plan,
  PlanMember,
  SeriesEditScope,
} from "@/api/dtos";
import { transactionHandlers } from "@/api/services/transaction.handlers";
import { categoryHandlers } from "@/api/services/category.handlers";
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
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SeriesScopeDialogProvider } from "./components/SeriesScopeDialogProvider";
import { TransactionsPage } from "./TransactionsPage";

const PLAN_ID = 5;
const API = `/api/findraco/plan/${PLAN_ID}/transaction`;

const lucas: PlanMember = { userId: 1, name: "Lucas", email: "lucas@example.com", role: "OWNER" };
const livia: PlanMember = { userId: 2, name: "Livia", email: "livia@example.com", role: "EDITOR" };

const rent: Transaction = {
  id: 42,
  permissions: { edit: true, delete: true },
  version: 0,
  type: "DEBIT",
  amount: 150.5,
  description: "Rent",
  startDate: "2026-07-01",
  endDate: "2026-07-01",
  splitMode: "EQUAL",
  participants: [],
  items: [],
};
const gym: Transaction = { ...rent, id: 55, seriesId: "s-1", description: "Gym (3/12)" };

const groceries: Category = { id: 12, version: 0, type: "DEBIT", description: "Groceries" };

function categoryPage(
  content: Category[],
): PagedResponse<Category> {
  return { content, page: 0, size: 1000, totalElements: content.length, totalPages: 1, last: true };
}

function pageOf(content: Transaction[], page = 0): PagedResponse<Transaction> {
  return { content, page, size: 10, totalElements: 25, totalPages: 3, last: page === 2 };
}

function authValue(): AuthContextValue {
  return {
    user: { id: lucas.userId, name: lucas.name, email: lucas.email, timeZone: "America/Sao_Paulo", timeZoneMode: "AUTOMATIC" },
    setUser: vi.fn(),
    status: "authenticated",
    signIn: vi.fn(),
    signOut: vi.fn(),
    retry: vi.fn(),
    announceSessionExpiry: vi.fn(),
  };
}

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

const categorySheet: CategoryFormSheetContextValue = { openCreate: vi.fn(), openEdit: vi.fn() };

type TabOptions = {
  transactions?: Transaction[];
  /** The starting URL; its query string holds the filters. */
  route?: string;
  categories?: Category[];
};

function renderTab({ transactions = [rent], route = "/", categories = [] }: TabOptions = {}) {
  server.use(
    transactionHandlers.list(pageOf(transactions)),
    planHandlers.members([lucas, livia]),
    categoryHandlers.list(categoryPage(categories)),
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
    { auth: authValue(), plan: planValue(), route },
  );
  return { requests, user: userEvent.setup() };
}

/** Query params of every transaction-list request, in order. */
function listQueries(requests: Request[]) {
  return requests
    .filter((request) => request.method === "GET" && new URL(request.url).pathname === API)
    .map((request) => Object.fromEntries(new URL(request.url).searchParams));
}

/** The dates every list request carries on the fixed current month (October 2026). */
const OCTOBER = { startDateFrom: "2026-10-01", startDateTo: "2026-10-31" };

/** Method and path with query of every write request, in order. */
function writes(requests: Request[]) {
  return requests
    .filter((request) => request.method !== "GET")
    .map((request) => {
      const url = new URL(request.url);
      return [request.method, url.pathname + url.search];
    });
}

function searchBox() {
  return screen.getByRole("textbox", { name: "Search transactions" });
}

/** The labels of the active-filter chips, in order. */
function chipLabels() {
  return screen
    .queryAllByRole("button", { name: /^Remove / })
    // Money is formatted with a non-breaking space; the labels compare with plain spaces.
    .map((button) => button.getAttribute("aria-label")?.replace(/^Remove /, "").replace(/\s/g, " "));
}

/** How many times the category behind a filter was fetched by id. */
function categoryFetches(requests: Request[], id: number) {
  return requests.filter(
    (request) =>
      new URL(request.url).pathname ===
      `/api/findraco/plan/${PLAN_ID}/category/${id}`,
  ).length;
}

async function tableRow(description: string) {
  const table = await screen.findByRole("table");
  const cell = await within(table).findByText(description);
  const row = cell.closest("tr");
  if (!row) throw new Error(`No table row for ${description}`);
  return within(row);
}

// Only the clock is faked: the screen opens on the current month, so the requests depend on "today".
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 9, 15));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

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
    expect(listQueries(requests)).toEqual([{ ...OCTOBER, page: "0", size: "10" }]);
    expect(searchBox()).toHaveProperty("value", "");
  });

  it("starts the search box and the request from the URL's search", async () => {
    const { requests } = renderTab({ route: "/?q=rent" });

    await tableRow("Rent");
    expect(searchBox()).toHaveProperty("value", "rent");
    expect(listQueries(requests)).toEqual([{ ...OCTOBER, page: "0", size: "10", description: "rent" }]);
  });

  it("searches by description once typing settles, keeping the other filters", async () => {
    const { requests, user } = renderTab({ route: "/?type=DEBIT" });
    await tableRow("Rent");

    await user.type(searchBox(), "rent");

    await waitFor(
      () =>
        expect(listQueries(requests).at(-1)).toEqual({
          ...OCTOBER,
          page: "0",
          size: "10",
          type: "DEBIT",
          description: "rent",
        }),
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
      expect(listQueries(requests).at(-1)).toEqual({ ...OCTOBER, page: "1", size: "10" }),
    );
  });

  it("opens the drawer on the transaction to edit it", async () => {
    const { user } = renderTab();
    const row = await tableRow("Rent");
    expect(screen.queryByRole("dialog")).toBeNull();

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
    server.use(transactionHandlers.remove());

    await user.click(row.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog", { name: "Confirm Deletion" });
    await user.click(within(dialog).getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(requests.some((r) => r.method === "DELETE" && new URL(r.url).pathname === `${API}/42`)).toBe(true),
    );
  });
});

describe("TransactionsPage row permissions (BST-10 AC 10, 11)", () => {
  // A contributor's view: the server marks their own row editable and another member's row not.
  const dinnerByLivia: Transaction = {
    ...rent,
    id: 60,
    description: "Dinner",
    createdBy: { id: livia.userId, name: livia.name },
    permissions: { edit: false, delete: false },
  };

  it("offers no edit or delete on another member's row, only on the rows the server allows", async () => {
    const { user } = renderTab({ transactions: [rent, dinnerByLivia] });
    const others = await tableRow("Dinner");
    const own = await tableRow("Rent");

    expect(others.queryByRole("button", { name: "Edit" })).toBeNull();
    expect(others.queryByRole("button", { name: "Delete" })).toBeNull();
    expect(own.getByRole("button", { name: "Edit" })).toBeTruthy();
    expect(own.getByRole("button", { name: "Delete" })).toBeTruthy();

    await user.click(others.getByText("Dinner"));
    expect(others.queryByRole("textbox", { name: "Description" })).toBeNull();
  });
});

describe("TransactionsPage stale edit (BST-06 AC 11)", () => {
  it("tells the user someone else changed the transaction, closes the drawer and reloads the list", async () => {
    const { requests, user } = renderTab({ transactions: [{ ...rent, version: 7 }] });
    const row = await tableRow("Rent");
    server.use(transactionHandlers.updateRejected(409, "stale-version"));

    await user.click(row.getByRole("button", { name: "Edit" }));
    const drawer = await screen.findByRole("dialog", { name: "Edit Transaction" });
    await user.click(within(drawer).getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Someone else changed this in the meantime. Reload it and try again."),
    ).toBeTruthy();
    const put = requests.find((request) => request.method === "PUT");
    expect(await put?.json()).toMatchObject({ version: 7 });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Edit Transaction" })).toBeNull());
    await waitFor(() => expect(listQueries(requests)).toHaveLength(2));
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
    server.use(transactionHandlers.importCsv({ imported: 1, skippedDuplicates: 2 }));

    await user.upload(fileInput(), csv);

    expect(
      await screen.findByText("Imported 1 transaction; 2 already in the plan were skipped."),
    ).toBeTruthy();
    // jsdom's FormData reaches MSW unserialised, so the request is asserted by method and URL.
    expect(importRequests(requests)).toHaveLength(1);
    await waitFor(() => expect(listQueries(requests)).toHaveLength(2));
  });

  it("lists the invalid lines and leaves the list alone when the file is rejected (BST-08 AC 11; BST-16 AC 5)", async () => {
    const { requests, user } = renderTab();
    await tableRow("Rent");
    server.use(
      transactionHandlers.importCsvRejected(422, "import-line-invalid", [
        { line: 3, field: "date", code: "date-invalid" },
        { line: 8, field: "amount", code: "amount-zero" },
      ]),
    );

    await user.upload(fileInput(), csv);

    expect(
      await screen.findByText("The file has invalid lines, so nothing was imported. Fix them and try again."),
    ).toBeTruthy();
    expect(screen.getByText(/Line 3: date must be a real date as dd\/mm\/yyyy/)).toBeTruthy();
    expect(screen.getByText(/Line 8: amount cannot be zero/)).toBeTruthy();
    expect(importRequests(requests)).toHaveLength(1);
    expect(screen.queryByText(/^Imported/)).toBeNull();
    expect(listQueries(requests)).toHaveLength(1);
  });
});

describe("TransactionsPage drawer and delete (STD-12 AC 1)", () => {
  it("closes the drawer when it is cancelled", async () => {
    const { user } = renderTab();
    const row = await tableRow("Rent");
    await user.click(row.getByRole("button", { name: "Edit" }));
    const drawer = await screen.findByRole("dialog", { name: "Edit Transaction" });

    await user.click(within(drawer).getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("closes the drawer before asking to delete from it", async () => {
    const { requests, user } = renderTab();
    const row = await tableRow("Rent");
    server.use(transactionHandlers.remove());
    await user.click(row.getByRole("button", { name: "Edit" }));
    const drawer = await screen.findByRole("dialog", { name: "Edit Transaction" });

    await user.click(within(drawer).getByRole("button", { name: "Delete" }));

    const dialog = await screen.findByRole("dialog", { name: "Confirm Deletion" });
    expect(screen.queryByRole("dialog", { name: "Edit Transaction", hidden: true })).toBeNull();
    await user.click(within(dialog).getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(writes(requests)).toEqual([["DELETE", `${API}/42`]]));
  });

  it("deletes nothing when the confirmation is cancelled", async () => {
    const { requests, user } = renderTab();
    const row = await tableRow("Rent");

    await user.click(row.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog", { name: "Confirm Deletion" });
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(writes(requests)).toEqual([]);
  });

  it.each<[string, SeriesEditScope]>([
    ["This one", "THIS_ONE"],
    ["This and following", "THIS_AND_FOLLOWING"],
    ["All", "ALL"],
  ])("deletes %s of a series from the chosen occurrence", async (label, scope) => {
    const { requests, user } = renderTab({ transactions: [gym] });
    const row = await tableRow("Gym (3/12)");
    server.use(transactionHandlers.removeSeries());

    await user.click(row.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog", { name: "Delete series" });
    await user.click(within(dialog).getByRole("radio", { name: new RegExp(`^${label}`) }));
    await user.click(within(dialog).getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(writes(requests)).toEqual([
        ["DELETE", `${API}/series/s-1?scope=${scope}&pivotOccurrenceId=55`],
      ]),
    );
  });

  it("deletes nothing when the series scope is cancelled", async () => {
    const { requests, user } = renderTab({ transactions: [gym] });
    const row = await tableRow("Gym (3/12)");

    await user.click(row.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog", { name: "Delete series" });
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(writes(requests)).toEqual([]);
  });
});

describe("TransactionsPage filters (STD-12 AC 1, 2)", () => {
  it("shows every active filter as a chip, with the category and member names, and requests it", async () => {
    server.use(categoryHandlers.get(groceries));
    const { requests } = renderTab({
      route: "/?type=DEBIT&category=12&member=2&min=50&max=200",
    });

    await waitFor(() => expect(chipLabels()).toHaveLength(4));
    // The period is shown by the navigator, never as a chip (PNAV-02 AC 2).
    expect(chipLabels()).toEqual(["Debit", "Groceries", "Livia", "R$ 50,00 – R$ 200,00"]);
    expect(listQueries(requests)).toEqual([
      {
        ...OCTOBER,
        page: "0",
        size: "10",
        type: "DEBIT",
        categoryId: "12",
        memberId: "2",
        amountMin: "50",
        amountMax: "200",
      },
    ]);
  });

  it.each([
    ["/?type=CREDIT&min=50", ["Credit", "≥ R$ 50,00"]],
    ["/?max=200", ["≤ R$ 200,00"]],
  ])("labels open-ended ranges and the type (%s)", async (route, labels) => {
    renderTab({ route });

    await tableRow("Rent");
    expect(chipLabels()).toEqual(labels);
  });

  it("removing a chip clears only its filter and goes back to the first page", async () => {
    const { requests, user } = renderTab({ route: "/?type=DEBIT&min=50&max=200" });
    await tableRow("Rent");
    await user.click(screen.getAllByRole("button", { name: "Next page" })[0]);
    await waitFor(() => expect(listQueries(requests).at(-1)?.page).toBe("1"));

    await user.click(screen.getByRole("button", { name: /^Remove R\$.*50,00.*200,00$/ }));

    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({ ...OCTOBER, page: "0", size: "10", type: "DEBIT" }),
    );
    expect(chipLabels()).toEqual(["Debit"]);
  });

  it("goes back to the first page when the sort changes", async () => {
    const { requests, user } = renderTab();
    await tableRow("Rent");
    await user.click(screen.getAllByRole("button", { name: "Next page" })[0]);
    await waitFor(() => expect(listQueries(requests).at(-1)?.page).toBe("1"));

    const header = screen.getByRole("columnheader", { name: /Amount/ });
    await user.click(within(header).getByRole("button"));

    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({
        ...OCTOBER,
        page: "0",
        size: "10",
        sortBy: "amount",
        sortDirection: "asc",
      }),
    );
  });

  it("goes back to the first page when the page size changes", async () => {
    const { requests, user } = renderTab();
    await tableRow("Rent");
    await user.click(screen.getAllByRole("button", { name: "Next page" })[0]);
    await waitFor(() => expect(listQueries(requests).at(-1)?.page).toBe("1"));

    await user.click(screen.getAllByRole("combobox", { name: "Lines per page" })[0]);
    await user.click(await screen.findByRole("option", { name: "20" }));

    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({ ...OCTOBER, page: "0", size: "20" }),
    );
  });

  it("clear all empties the search at once and drops filters and search, keeping sort and page size", async () => {
    const { requests, user } = renderTab({
      route: "/?q=rent&type=DEBIT&sort=amount.asc&size=25",
    });
    await tableRow("Rent");
    await user.click(screen.getAllByRole("button", { name: "Next page" })[0]);
    await waitFor(() => expect(listQueries(requests).at(-1)?.page).toBe("1"));

    const sentBeforeClear = listQueries(requests).length;

    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(searchBox()).toHaveProperty("value", "");
    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({
        ...OCTOBER,
        page: "0",
        size: "25",
        sortBy: "amount",
        sortDirection: "asc",
      }),
    );
    expect(chipLabels()).toEqual([]);
    // Past the search debounce: the cleared search is never written back.
    await new Promise((resolve) => setTimeout(resolve, 500));
    const sentAfterClear = listQueries(requests).slice(sentBeforeClear);
    expect(sentAfterClear.some((query) => query.description !== undefined)).toBe(false);
  });

  it("drops a category that no longer exists (404) from the filters", async () => {
    server.use(categoryHandlers.getNotFound());
    const { requests } = renderTab({ route: "/?category=12&type=DEBIT" });

    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({ ...OCTOBER, page: "0", size: "10", type: "DEBIT" }),
    );
    expect(chipLabels()).toEqual(["Debit"]);
    expect(categoryFetches(requests, 12)).toBe(1);
  });

  it.each([
    ["a server error (500)", categoryHandlers.getServerError],
    ["a network error", categoryHandlers.getNetworkError],
  ])("keeps the category filter when fetching it fails with %s", async (_, failure) => {
    server.use(failure());
    const { requests } = renderTab({ route: "/?category=12&type=DEBIT" });

    // The first try and its single retry.
    await waitFor(() => expect(categoryFetches(requests, 12)).toBe(2), { timeout: 3000 });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(listQueries(requests)).toEqual([
      { ...OCTOBER, page: "0", size: "10", type: "DEBIT", categoryId: "12" },
    ]);
  });

  it("drops a member who is not in the plan once the members are loaded", async () => {
    server.use(categoryHandlers.get(groceries));
    const { requests } = renderTab({ route: "/?member=99&category=12" });

    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({ ...OCTOBER, page: "0", size: "10", categoryId: "12" }),
    );
    await waitFor(() => expect(chipLabels()).toEqual(["Groceries"]));
  });

  it("shows a category picked in the filters without fetching it again", async () => {
    const { requests, user } = renderTab({ categories: [groceries] });
    await tableRow("Rent");

    await user.click(screen.getByRole("button", { name: "Filters" }));
    const filters = await screen.findByRole("dialog", { name: "Filters" });
    await user.click(within(filters).getByLabelText("Category"));
    await user.click(await screen.findByRole("option", { name: "Groceries" }));
    await user.click(within(filters).getByRole("button", { name: "Apply" }));

    await waitFor(() => expect(chipLabels()).toEqual(["Groceries"]));
    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({ ...OCTOBER, page: "0", size: "10", categoryId: "12" }),
    );
    expect(categoryFetches(requests, 12)).toBe(0);
  });
});

describe("TransactionsPage period navigator (PNAV-01, PNAV-02)", () => {
  function label(name: string) {
    return screen.findByRole("button", { name: `Choose period, ${name}` });
  }

  it("opens on the current month and requests only its dates (PNAV-01 AC 1)", async () => {
    const { requests } = renderTab();

    await label("October 2026");
    await tableRow("Rent");
    expect(listQueries(requests)).toEqual([{ ...OCTOBER, page: "0", size: "10" }]);
  });

  it("steps back across a year boundary and forward again (PNAV-01 AC 2, 3)", async () => {
    vi.setSystemTime(new Date(2026, 0, 20));
    const { requests, user } = renderTab();
    await label("January 2026");

    await user.click(screen.getByRole("button", { name: "Previous period" }));
    await label("December 2025");
    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({
        startDateFrom: "2025-12-01",
        startDateTo: "2025-12-31",
        page: "0",
        size: "10",
      }),
    );

    await user.click(screen.getByRole("button", { name: "Next period" }));
    await label("January 2026");
    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({
        startDateFrom: "2026-01-01",
        startDateTo: "2026-01-31",
        page: "0",
        size: "10",
      }),
    );
  });

  it("moves a multi-month period by its own length (PNAV-01 AC 5)", async () => {
    const { requests, user } = renderTab({ route: "/?period=last-3m" });
    await label("Aug – Oct 2026");

    await user.click(screen.getByRole("button", { name: "Previous period" }));

    await label("May – Jul 2026");
    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({
        startDateFrom: "2026-05-01",
        startDateTo: "2026-07-31",
        page: "0",
        size: "10",
      }),
    );
  });

  it("requests the range a Range menu option resolves to (PNAV-01 AC 4)", async () => {
    const { requests, user } = renderTab();
    await label("October 2026");

    await user.click(screen.getByRole("button", { name: "Range" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "Last 6 months" }));

    await label("May – Oct 2026");
    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({
        startDateFrom: "2026-05-01",
        startDateTo: "2026-10-31",
        page: "0",
        size: "10",
      }),
    );
  });

  it("goes back to the first page and keeps the other filters when the period changes (PNAV-01 AC 6, 9)", async () => {
    const { requests, user } = renderTab({ route: "/?q=rent&type=DEBIT&sort=amount.asc&size=25" });
    await tableRow("Rent");
    await user.click(screen.getAllByRole("button", { name: "Next page" })[0]);
    await waitFor(() => expect(listQueries(requests).at(-1)?.page).toBe("1"));

    await user.click(screen.getByRole("button", { name: "Previous period" }));

    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({
        startDateFrom: "2026-09-01",
        startDateTo: "2026-09-30",
        page: "0",
        size: "25",
        description: "rent",
        type: "DEBIT",
        sortBy: "amount",
        sortDirection: "asc",
      }),
    );
  });

  it("replaces a custom range with the This month preset (PNAV-03 AC 1)", async () => {
    const { requests, user } = renderTab({
      route: "/?period=custom&periodFrom=2026-09-01&periodTo=2026-09-30",
    });
    await label("September 2026");

    await user.click(screen.getByRole("button", { name: "Range" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "This month" }));

    await label("October 2026");
    await waitFor(() =>
      expect(listQueries(requests).at(-1)).toEqual({ ...OCTOBER, page: "0", size: "10" }),
    );
  });

  it("keeps the period when all filters are cleared (PNAV-02 AC 4)", async () => {
    const { requests, user } = renderTab({
      route: "/?period=custom&periodFrom=2026-09-01&periodTo=2026-09-30&type=DEBIT",
    });
    await label("September 2026");
    await waitFor(() => expect(chipLabels()).toEqual(["Debit"]));

    await user.click(screen.getByRole("button", { name: "Clear all" }));

    await waitFor(() => expect(chipLabels()).toEqual([]));
    await label("September 2026");
    expect(listQueries(requests).at(-1)).toEqual({
      startDateFrom: "2026-09-01",
      startDateTo: "2026-09-30",
      page: "0",
      size: "10",
    });
  });

  it("ignores the pre-feature from and to params and opens on the current month (PNAV-05)", async () => {
    const { requests } = renderTab({ route: "/?from=2026-03-01&to=2026-03-31" });

    await label("October 2026");
    expect(listQueries(requests)).toEqual([{ ...OCTOBER, page: "0", size: "10" }]);
  });
});
