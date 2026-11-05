import type {
  Transaction,
  Category,
  Plan,
  PlanMember,
  RecurrenceDefinitionResponse,
  SeriesEditScope,
} from "@/api/dtos";
import { transactionHandlers } from "@/api/services/transaction.handlers";
import { categoryHandlers } from "@/api/services/category.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import type { AuthContextValue } from "@/app/providers/useAuth";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { i18n } from "@/i18n/i18n";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { stubScreenWidth } from "@/test/screenWidth";
import { server } from "@/test/server";
import { act, cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

const savedTransaction: Transaction = {
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
  status: "ACTUAL", requiresConfirmation: false,
};

function authValue(): AuthContextValue {
  return {
    user: { id: lucas.userId, name: lucas.name, email: lucas.email, timeZone: "America/Sao_Paulo", timeZoneMode: "AUTOMATIC", language: null },
    setUser: vi.fn(),
    status: "authenticated",
    signIn: vi.fn(),
    signOut: vi.fn(),
    retry: vi.fn(),
    announceSessionExpiry: vi.fn(),
  };
}

function planValue(manageCategories: boolean): PlanContextValue {
  const plan: Plan = {
    id: PLAN_ID,
    name: "Home",
    isDefault: true,
    myRole: "OWNER",
    permissions: { createTransactions: true, attributeToOthers: true, manageCategories, managePlan: true },
  };
  return {
    activePlanId: PLAN_ID,
    setActivePlanId: vi.fn(),
    activePlan: plan,
    plans: [plan],
    isLoading: false,
  };
}

type RenderDrawerOptions = {
  mode?: TransactionFormMode;
  transaction?: Transaction;
  /** Two or more members show the attribution fields to an owner. */
  members: PlanMember[];
  categories?: Category[];
  onDelete?: (transaction: Transaction) => void;
  onDuplicate?: (transaction: Transaction) => void;
  manageCategories?: boolean;
};

function renderDrawer({
  mode = "create",
  transaction,
  members,
  categories = [],
  onDelete,
  onDuplicate,
  manageCategories = true,
}: RenderDrawerOptions) {
  server.use(
    planHandlers.members(members),
    categoryHandlers.list({
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
    <SeriesScopeDialogProvider>
      <TransactionFormDrawer
        open
        onOpenChange={onOpenChange}
        mode={mode}
        transaction={transaction}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    </SeriesScopeDialogProvider>,
    { auth: authValue(), plan: planValue(manageCategories) },
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
    server.use(transactionHandlers.create(savedTransaction));
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
    server.use(transactionHandlers.update(savedTransaction));
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
      /\/plan\/5\/transaction\/42$/,
    );
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("creates a new transaction when duplicating, leaving the original untouched (STD-07 AC 2)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(transactionHandlers.create(savedTransaction));
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
    ).toEqual([["POST", "/api/findraco/plan/5/transaction"]]);
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

describe("TransactionFormDrawer container", () => {
  afterEach(cleanup);

  it("opens as a bottom sheet on a narrow screen", () => {
    stubScreenWidth(390);
    renderDrawer({ members: [lucas] });

    expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("bottom");
  });

  it("opens on the right on a wide screen", () => {
    stubScreenWidth(1024);
    renderDrawer({ members: [lucas] });

    expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("right");
  });

  it("closes without saving on Escape or a backdrop tap", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    stubScreenWidth(390);
    const { onOpenChange } = renderDrawer({ members: [lucas] });

    await user.type(screen.getByLabelText("Description"), "Rent");
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    const backdrop = document.querySelector("[data-slot='drawer-overlay']");
    if (!backdrop) throw new Error("No backdrop");
    await user.click(backdrop);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledTimes(2));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(requests.filter((request) => request.method !== "GET")).toEqual([]);
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
    server.use(transactionHandlers.createSeries(savedSeries));
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
      /\/plan\/5\/transaction\/series$/,
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

  const liviasGym: Category = {
    id: 9,
    version: 0,
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
    server.use(transactionHandlers.create(savedTransaction));
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
    server.use(transactionHandlers.create(savedTransaction));
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

describe("TransactionFormDrawer category quick-create", () => {
  const food: Category = { id: 1, version: 0, type: "DEBIT", description: "Food" };
  const pet: Category = { id: 77, version: 0, type: "DEBIT", description: "Pet" };

  function page(content: Category[]) {
    return { content, page: 0, size: 1000, totalElements: content.length, totalPages: 0, last: true };
  }

  function createRow() {
    return screen.findByRole("button", { name: 'Create expense category "Pet"' });
  }

  async function searchFor(user: ReturnType<typeof userEvent.setup>, text: string) {
    await user.click(screen.getByLabelText("Category"));
    await user.type(await screen.findByLabelText("Search categories"), text);
  }

  beforeEach(() => {
    vi.spyOn(toast, "success");
    vi.spyOn(toast, "error");
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("creates the typed category with the transaction type and nothing else", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(categoryHandlers.create(pet));
    renderDrawer({ members: [lucas], categories: [food] });

    await searchFor(user, "  Pet ");
    await user.click(await createRow());

    expect(await sentBody(requests, "POST")).toEqual({ type: "DEBIT", description: "Pet" });
  });

  it("selects the created category, keeps the other values and opens no other sheet", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(categoryHandlers.create(pet), transactionHandlers.create(savedTransaction));
    renderDrawer({ members: [lucas], categories: [food] });

    await user.type(screen.getByLabelText("Description"), "Vet visit");
    await user.type(screen.getByLabelText("Amount"), "9990");
    await searchFor(user, "Pet");
    await user.click(await createRow());

    await waitFor(() => expect(screen.getByLabelText("Category").textContent).toBe("Pet"));
    expect(screen.getByLabelText<HTMLInputElement>("Description").value).toBe("Vet visit");
    expect(screen.getByLabelText<HTMLInputElement>("Amount").value).toBe("R$\u00a099,90");
    expect(screen.getAllByRole("dialog")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Create" }));
    await waitFor(() =>
      expect(requests.filter((request) => request.method === "POST")).toHaveLength(2),
    );
    const transaction = requests.filter((request) => request.method === "POST")[1];
    expect(await transaction.json()).toMatchObject({ categoryId: 77, description: "Vet visit" });
  });

  it("hides the create row without the manage-categories permission", async () => {
    const user = userEvent.setup();
    renderDrawer({ members: [lucas], categories: [food], manageCategories: false });

    await searchFor(user, "Pet");

    expect(await screen.findByText("No results")).toBeTruthy();
    expect(screen.queryByRole("button", { name: 'Create expense category "Pet"' })).toBeNull();
  });

  it("shows the created toast", async () => {
    const user = userEvent.setup();
    server.use(categoryHandlers.create(pet));
    renderDrawer({ members: [lucas], categories: [food] });

    await searchFor(user, "Pet");
    await user.click(await createRow());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Category "Pet" created'));
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("disables the create row while the request is pending", async () => {
    const user = userEvent.setup();
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(categoryHandlers.createAfter(pet, gate));
    renderDrawer({ members: [lucas], categories: [food] });

    await searchFor(user, "Pet");
    await user.click(await createRow());

    await waitFor(() => expect(screen.getByRole("button", { name: 'Create expense category "Pet"' })).toHaveProperty("disabled", true));
    release?.();
    await waitFor(() => expect(screen.getByLabelText("Category").textContent).toBe("Pet"));
  });

  it("shows the problem copy and keeps the search when creation fails", async () => {
    const user = userEvent.setup();
    server.use(categoryHandlers.createRejected(422, "validation-failed"));
    renderDrawer({ members: [lucas], categories: [food] });

    await user.type(screen.getByLabelText("Description"), "Vet visit");
    await searchFor(user, "Pet");
    await user.click(await createRow());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Some fields are invalid.", undefined));
    expect(toast.success).not.toHaveBeenCalled();
    expect(screen.getByLabelText<HTMLInputElement>("Search categories").value).toBe("Pet");
    expect(screen.getByLabelText("Category").textContent).toBe("Select a category...");
    expect(screen.getByLabelText<HTMLInputElement>("Description").value).toBe("Vet visit");
  });

  it("clears a quick-created category when the type changes", async () => {
    const user = userEvent.setup();
    server.use(categoryHandlers.create(pet));
    renderDrawer({ members: [lucas], categories: [food] });

    await searchFor(user, "Pet");
    await user.click(await createRow());
    await waitFor(() => expect(screen.getByLabelText("Category").textContent).toBe("Pet"));

    // The refetch after the creation now lists it, as the API would.
    server.use(categoryHandlers.list(page([food, pet])));
    await user.click(screen.getByRole("button", { name: "Credit" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Category").textContent).toBe("Select a category..."),
    );

    await user.click(screen.getByRole("button", { name: "Debit" }));
    await user.click(screen.getByLabelText("Category"));
    expect(await screen.findByRole("option", { name: "Pet" })).toBeTruthy();
  });
});

describe("TransactionFormDrawer series edit (STD-07 AC 2)", () => {
  afterEach(cleanup);

  const occurrence: Transaction = {
    ...savedTransaction,
    id: 55,
    seriesId: "s-1",
    description: "Gym (3/12)",
  };
  const installments: RecurrenceDefinitionResponse = {
    id: 9,
    version: 0,
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
    requiresConfirmation: false,
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
      transactionHandlers.series(installments),
      transactionHandlers.updateSeries(updatedSeries),
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
    server.use(transactionHandlers.series(installments));
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
      ["PUT", "/api/findraco/plan/5/transaction/series/s-1"],
    ]);
    expect(body).toMatchObject({
      scope,
      pivotOccurrenceId: 55,
      series: { description: "Gym", parcelsNumber: 12 },
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
    expect(body).toMatchObject({ scope: "ALL", series: { parcelsNumber: 10 } });
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

describe("TransactionFormDrawer language", () => {
  afterEach(cleanup);

  it("keeps typed values when the language changes", async () => {
    const user = userEvent.setup();
    renderDrawer({ members: [lucas] });
    await user.type(screen.getByLabelText("Description"), "Rent");
    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(await screen.findByText("Amount must be positive")).toBeDefined();

    await act(() => i18n.changeLanguage("pt-BR"));

    expect(screen.getByLabelText<HTMLInputElement>("Descrição").value).toBe("Rent");
    expect(screen.getByText("O valor deve ser positivo")).toBeDefined();
    expect(screen.getByRole("button", { name: "Criar" })).toBeDefined();
  });

  it("shows user data as typed in Portuguese", async () => {
    await i18n.changeLanguage("pt-BR");
    const groceries: Category = { id: 3, version: 0, type: "DEBIT", description: "Groceries" };
    renderDrawer({
      mode: "edit",
      transaction: { ...savedTransaction, description: "Monthly rent", category: groceries },
      members: [lucas],
      categories: [groceries],
    });

    expect(screen.getByText("Editar transação")).toBeDefined();
    expect(screen.getByLabelText<HTMLInputElement>("Descrição").value).toBe("Monthly rent");
    expect(screen.getByLabelText("Categoria").textContent).toContain("Groceries");
  });
});

describe("TransactionFormDrawer", () => {
  afterEach(cleanup);

  const confirmedOccurrence: Transaction = {
    ...savedTransaction,
    id: 55,
    seriesId: "s-1",
    description: "Electricity",
    status: "ACTUAL",
    requiresConfirmation: true,
  };
  const definition: RecurrenceDefinitionResponse = {
    id: 9,
    version: 2,
    seriesId: "s-1",
    type: "DEBIT",
    amount: 150.5,
    description: "Electricity",
    mode: "RECURRING",
    interval: "MONTHLY",
    startDate: "2026-05-01",
    splitMode: "EQUAL",
    participants: [],
    requiresConfirmation: true,
  };

  /** Edits one occurrence ("This one") and returns the PUT body. */
  async function saveThisOne(user: ReturnType<typeof userEvent.setup>, requests: Request[]) {
    await user.click(screen.getByRole("button", { name: "Save" }));
    const radio = await screen.findByRole("radio", { name: /^This one/ });
    const dialog = within(radio.closest<HTMLElement>("[role='dialog']")!);
    await user.click(dialog.getByRole("radio", { name: /^This one/ }));
    await user.click(dialog.getByRole("button", { name: "Continue" }));
    return sentBody(requests, "PUT");
  }

  async function renderOccurrence(transaction: Transaction) {
    server.use(
      transactionHandlers.series(definition),
      transactionHandlers.updateSeries({ seriesId: "s-1", count: 1, occurrences: [transaction] }),
    );
    renderDrawer({ mode: "edit", transaction, members: [lucas] });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Save" })).toHaveProperty("disabled", false),
    );
  }

  it("series starts requiring confirmation", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(
      transactionHandlers.createSeries({ seriesId: "s-1", count: 1, occurrences: [confirmedOccurrence] }),
    );
    renderDrawer({ members: [lucas] });

    await user.type(screen.getByLabelText("Description"), "Electricity");
    await user.type(screen.getByLabelText("Amount"), "20000");
    await user.click(screen.getByRole("checkbox", { name: "Repeat or split into installments?" }));
    await user.click(screen.getByRole("button", { name: "Recurring" }));

    expect(screen.getByRole("switch", { name: "Requires confirmation" }).getAttribute("aria-checked")).toBe("true");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await sentBody(requests, "POST")).toMatchObject({ mode: "RECURRING", requiresConfirmation: true });
  });

  it("status keeps its value when another field changes", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    await renderOccurrence({ ...confirmedOccurrence, status: "FORECAST" });

    expect(screen.getByRole("button", { name: "Forecast" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Actual" }).getAttribute("aria-pressed")).toBe("false");
    const amount = screen.getByLabelText("Amount");
    await user.clear(amount);
    await user.type(amount, "18740");
    expect(screen.getByRole("button", { name: "Forecast" }).getAttribute("aria-pressed")).toBe("true");

    expect(await saveThisOne(user, requests)).toMatchObject({
      scope: "THIS_ONE",
      series: { amount: 187.4 },
      pivotConfirmed: false,
    });
  });

  it("status forecast unconfirms", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    await renderOccurrence(confirmedOccurrence);

    await user.click(screen.getByRole("button", { name: "Forecast" }));

    expect(await saveThisOne(user, requests)).toMatchObject({ scope: "THIS_ONE", pivotConfirmed: false });
  });

  it("one-off shows no confirmation controls", () => {
    renderDrawer({ mode: "edit", transaction: savedTransaction, members: [lucas] });

    expect(screen.queryByRole("switch", { name: "Requires confirmation" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Forecast" })).toBeNull();
  });
});
