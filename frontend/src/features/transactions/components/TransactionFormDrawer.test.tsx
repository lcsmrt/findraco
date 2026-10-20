import type {
  FinancialTransaction,
  FinancialTransactionCategory,
  Plan,
  PlanMember,
  RecurrenceDefinitionResponse,
  SeriesEditScope,
} from "@/api/dtos";
import { financialTransactionHandlers } from "@/api/services/financialTransaction.handlers";
import { financialTransactionCategoryHandlers } from "@/api/services/financialTransactionCategory.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import type { AuthContextValue } from "@/app/providers/useAuth";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import {
  CategoryFormSheetContext,
  type CategoryFormSheetContextValue,
} from "@/hooks/useCategoryFormSheet";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SeriesScopeDialogProvider } from "./SeriesScopeDialogProvider";
import { TransactionFormDrawer } from "./TransactionFormDrawer";
import type { TransactionFormMode } from "./transactionForm";

const PLAN_ID = 5;
const lucas: PlanMember = {
  userId: 1,
  name: "Lucas",
  email: "lucas@example.com",
  role: "OWNER",
};
const livia: PlanMember = {
  userId: 2,
  name: "Livia",
  email: "livia@example.com",
  role: "EDITOR",
};

const savedTransaction: FinancialTransaction = {
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
  const plan: Plan = {
    id: PLAN_ID,
    name: "Home",
    isDefault: true,
    myRole: "OWNER",
  };
  return {
    activePlanId: PLAN_ID,
    setActivePlanId: vi.fn(),
    activePlan: plan,
    plans: [plan],
    isLoading: false,
  };
}

const categorySheet: CategoryFormSheetContextValue = {
  openCreate: vi.fn(),
  openEdit: vi.fn(),
};

type RenderDrawerOptions = {
  mode?: TransactionFormMode;
  transaction?: FinancialTransaction;
  /** Two or more members show the attribution fields to an owner. */
  members: PlanMember[];
  categories?: FinancialTransactionCategory[];
  onDelete?: (transaction: FinancialTransaction) => void;
  onDuplicate?: (transaction: FinancialTransaction) => void;
};

function renderDrawer({
  mode = "create",
  transaction,
  members,
  categories = [],
  onDelete,
  onDuplicate,
}: RenderDrawerOptions) {
  server.use(
    planHandlers.members(members),
    financialTransactionCategoryHandlers.list({
      content: categories,
      page: 0,
      size: 1000,
      totalElements: categories.length,
      totalPages: 0,
      last: true,
    }),
  );
  const onOpenChange = vi.fn();
  renderWithProviders(
    <CategoryFormSheetContext.Provider value={categorySheet}>
      <SeriesScopeDialogProvider>
        <TransactionFormDrawer
          open
          onOpenChange={onOpenChange}
          mode={mode}
          transaction={transaction}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      </SeriesScopeDialogProvider>
    </CategoryFormSheetContext.Provider>,
    { auth: authValue(), plan: planValue() },
  );
  return { onOpenChange };
}

async function sentBody(requests: Request[], method: string) {
  await waitFor(() =>
    expect(requests.some((request) => request.method === method)).toBe(true),
  );
  const request = requests.find((candidate) => candidate.method === method);
  return request?.json();
}

describe("TransactionFormDrawer money fields", () => {
  afterEach(cleanup);

  it("submits the typed amount 1234 as 12.34 (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.create(savedTransaction));
    const { onOpenChange } = renderDrawer({ members: [lucas] });

    await user.type(screen.getByLabelText("Description"), "Groceries");
    await user.type(screen.getByLabelText("Amount"), "1234");
    expect(screen.getByLabelText<HTMLInputElement>("Amount").value).toBe(
      "R$\u00a012,34",
    );
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await sentBody(requests, "POST")).toEqual({
      type: "DEBIT",
      description: "Groceries",
      amount: 12.34,
      startDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      items: [],
    });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("shows a saved amount formatted and sends it back as a number (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.update(savedTransaction));
    const { onOpenChange } = renderDrawer({
      mode: "edit",
      transaction: savedTransaction,
      members: [lucas],
    });

    expect(screen.getByLabelText<HTMLInputElement>("Amount").value).toBe(
      "R$\u00a0150,50",
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    const body = await sentBody(requests, "PUT");
    expect(body.amount).toBe(150.5);
    expect(requests.find((request) => request.method === "PUT")?.url).toMatch(
      /\/plan\/5\/financial-transaction\/42$/,
    );
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("creates a new transaction when duplicating, leaving the original untouched (STD-07 AC 2)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.create(savedTransaction));
    const { onOpenChange } = renderDrawer({
      mode: "duplicate",
      transaction: savedTransaction,
      members: [lucas],
    });

    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(body).toMatchObject({ description: "Rent", amount: 150.5 });
    expect(
      requests
        .filter((request) => request.method !== "GET")
        .map((request) => [request.method, new URL(request.url).pathname]),
    ).toEqual([["POST", "/api/findraco/plan/5/financial-transaction"]]);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });
});

describe("TransactionFormDrawer skeleton", () => {
  afterEach(cleanup);

  it("closes on Cancel without sending anything (STD-06 AC 8)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const { onOpenChange } = renderDrawer({ members: [lucas] });

    await user.type(screen.getByLabelText("Description"), "Rent");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(requests.filter((request) => request.method !== "GET")).toEqual([]);
  });

  it("offers Delete and Duplicate for the edited transaction (STD-06 AC 8)", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onDuplicate = vi.fn();
    renderDrawer({
      mode: "edit",
      transaction: savedTransaction,
      members: [lucas],
      onDelete,
      onDuplicate,
    });

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith(savedTransaction);
    await user.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(onDuplicate).toHaveBeenCalledWith(savedTransaction);
  });

  it("offers no Delete or Duplicate when creating (STD-06 AC 8)", () => {
    renderDrawer({ members: [lucas], onDelete: vi.fn(), onDuplicate: vi.fn() });

    expect(screen.queryByRole("button", { name: "Delete" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Duplicate" })).toBeNull();
  });
});

describe("TransactionFormDrawer toggles", () => {
  afterEach(cleanup);

  const savedSeries = {
    seriesId: "s-1",
    count: 1,
    occurrences: [savedTransaction],
  };

  async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Description"), "Gym");
    await user.type(screen.getByLabelText("Amount"), "9990");
  }

  it("creates a monthly series when the Recurring mode is chosen (STD-06 AC 1, 2)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.createSeries(savedSeries));
    renderDrawer({ members: [lucas] });

    await fillRequired(user);
    await user.click(
      screen.getByRole("checkbox", {
        name: "Repeat or split into installments?",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Recurring" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(requests.find((request) => request.method === "POST")?.url).toMatch(
      /\/plan\/5\/financial-transaction\/series$/,
    );
    expect(body).toMatchObject({
      mode: "RECURRING",
      interval: "MONTHLY",
      amount: 99.9,
    });
    expect(body.parcelsNumber).toBeUndefined();
  });
});

describe("TransactionFormDrawer owned-category attribution", () => {
  afterEach(cleanup);

  const liviasGym: FinancialTransactionCategory = {
    id: 9,
    type: "DEBIT",
    description: "Livia's gym",
    ownerId: livia.userId,
    ownerName: livia.name,
    ownerActive: true,
  };

  async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Description"), "Gym");
    await user.type(screen.getByLabelText("Amount"), "9990");
  }

  async function chooseCategory(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByLabelText("Category"));
    await user.click(await screen.findByRole("option", { name: "Livia's gym" }));
  }

  it("attributes the transaction to the owner of the chosen category (CAT-17)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.create(savedTransaction));
    renderDrawer({ members: [lucas, livia], categories: [liviasGym] });

    await fillRequired(user);
    await screen.findByRole("button", { name: "Someone else" });
    await chooseCategory(user);
    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(body.categoryId).toBe(9);
    expect(body.participants).toEqual([{ memberId: 2 }]);
  });

  it("keeps hand-edited participants when an owned category is chosen afterwards (CAT-17)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.create(savedTransaction));
    renderDrawer({ members: [lucas, livia], categories: [liviasGym] });

    await fillRequired(user);
    await user.click(await screen.findByRole("button", { name: "Split" }));
    await chooseCategory(user);
    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(body.categoryId).toBe(9);
    expect(body.splitMode).toBe("EQUAL");
    expect(body.participants).toEqual([{ memberId: 1 }, { memberId: 2 }]);
  });
});

describe("TransactionFormDrawer series edit (STD-07 AC 2)", () => {
  afterEach(cleanup);

  const occurrence: FinancialTransaction = {
    ...savedTransaction,
    id: 55,
    seriesId: "s-1",
    description: "Gym (3/12)",
  };
  const installments: RecurrenceDefinitionResponse = {
    id: 9,
    seriesId: "s-1",
    type: "DEBIT",
    amount: 150.5,
    description: "Gym",
    mode: "INSTALLMENT",
    parcelsNumber: 12,
    firstParcel: 3,
    startDate: "2026-05-01",
    splitMode: "EQUAL",
    participants: [],
  };
  const updatedSeries = { seriesId: "s-1", count: 12, occurrences: [occurrence] };

  function writes(requests: Request[]) {
    return requests
      .filter((request) => request.method !== "GET")
      .map((request) => [request.method, new URL(request.url).pathname]);
  }

  /** Renders the drawer on a series occurrence and waits for the series definition. */
  async function renderSeriesEdit() {
    server.use(
      financialTransactionHandlers.series(installments),
      financialTransactionHandlers.updateSeries(updatedSeries),
    );
    const rendered = renderDrawer({ mode: "edit", transaction: occurrence, members: [lucas] });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Save" })).toHaveProperty("disabled", false),
    );
    return rendered;
  }

  async function scopeDialog() {
    const radio = await screen.findByRole("radio", { name: /^This one/ });
    const dialog = radio.closest<HTMLElement>("[role='dialog']");
    if (!dialog) throw new Error("No scope dialog");
    return within(dialog);
  }

  it("offers no save while the series definition is loading", async () => {
    server.use(financialTransactionHandlers.series(installments));
    renderDrawer({ mode: "edit", transaction: occurrence, members: [lucas] });

    expect(screen.getByRole("button", { name: "Save" })).toHaveProperty("disabled", true);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Save" })).toHaveProperty("disabled", false),
    );
  });

  it.each<[string, SeriesEditScope]>([
    ["This one", "THIS_ONE"],
    ["This and following", "THIS_AND_FOLLOWING"],
    ["All", "ALL"],
  ])("edits %s of the series from the occurrence", async (label, scope) => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const { onOpenChange } = await renderSeriesEdit();

    await user.click(screen.getByRole("button", { name: "Save" }));
    const dialog = await scopeDialog();
    await user.click(dialog.getByRole("radio", { name: new RegExp(`^${label}`) }));
    await user.click(dialog.getByRole("button", { name: "Continue" }));

    const body = await sentBody(requests, "PUT");
    expect(writes(requests)).toEqual([
      ["PUT", "/api/findraco/plan/5/financial-transaction/series/s-1"],
    ]);
    expect(body).toMatchObject({
      scope,
      pivotOccurrenceId: 55,
      description: "Gym",
      parcelsNumber: 12,
    });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("edits the whole series without asking when the number of installments changed", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    await renderSeriesEdit();

    const parcels = screen.getByLabelText("Number of installments");
    await user.clear(parcels);
    await user.type(parcels, "10");
    await user.click(screen.getByRole("button", { name: "Save" }));

    const body = await sentBody(requests, "PUT");
    expect(body).toMatchObject({ scope: "ALL", parcelsNumber: 10 });
    expect(screen.queryByRole("radio", { name: /^This one/ })).toBeNull();
  });

  it("sends nothing and stays open when the scope is cancelled", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const { onOpenChange } = await renderSeriesEdit();

    await user.click(screen.getByRole("button", { name: "Save" }));
    const dialog = await scopeDialog();
    await user.click(dialog.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("radio", { name: /^This one/ })).toBeNull());
    expect(writes(requests)).toEqual([]);
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
