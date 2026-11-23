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

describe("TransactionFormDrawer series date", () => {
  beforeEach(async () => {
    vi.spyOn(toast, "error");
    await i18n.changeLanguage("pt-BR");
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // Monthly 16/03 to 16/06/2026, opened on April's occurrence.
  const monthly: RecurrenceDefinitionResponse = {
    id: 10,
    version: 3,
    seriesId: "s-2",
    type: "DEBIT",
    amount: 80,
    description: "Gym",
    mode: "RECURRING",
    interval: "MONTHLY",
    startDate: "2026-03-16",
    endDate: "2026-06-16",
    splitMode: "EQUAL",
    participants: [],
    requiresConfirmation: false,
  };
  const april: Transaction = {
    ...savedTransaction,
    id: 56,
    seriesId: "s-2",
    description: "Gym",
    amount: 80,
    startDate: "2026-04-16",
    endDate: "2026-04-16",
  };
  // Installments 3/12 from 01/05/2026; the opened occurrence is July's.
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
  const july: Transaction = {
    ...savedTransaction,
    id: 55,
    seriesId: "s-1",
    description: "Gym (5/12)",
  };
  const edited = { seriesId: "s-2", count: 4, occurrences: [april] };

  async function openSeries(definition: RecurrenceDefinitionResponse, occurrence: Transaction) {
    server.use(transactionHandlers.series(definition));
    renderDrawer({ mode: "edit", transaction: occurrence, members: [lucas] });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Salvar" })).toHaveProperty("disabled", false),
    );
  }

  async function typeDate(user: ReturnType<typeof userEvent.setup>, text: string, label = "Data") {
    const field = screen.getByLabelText(label);
    await user.clear(field);
    await user.type(field, text);
    await user.tab();
  }

  function writes(requests: Request[]) {
    return requests.filter((request) => request.method !== "GET");
  }

  it("shows the opened occurrence's date", async () => {
    await openSeries(monthly, april);

    expect(screen.getByLabelText<HTMLInputElement>("Data").value).toBe("16/04/2026");
  });

  it("offers only this and following when the date changed", async () => {
    const user = userEvent.setup();
    await openSeries(monthly, april);

    await typeDate(user, "18/04/2026");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("radio", { name: /^Só esta/ })).toBeDefined();
    expect(screen.getByRole("radio", { name: /^Esta e as seguintes/ })).toBeDefined();
    expect(screen.queryByRole("radio", { name: /^Todas/ })).toBeNull();
  });

  it("offers every scope when the date is unchanged", async () => {
    const user = userEvent.setup();
    await openSeries(monthly, april);

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("radio", { name: /^Só esta/ })).toBeDefined();
    expect(screen.getByRole("radio", { name: /^Esta e as seguintes/ })).toBeDefined();
    expect(screen.getByRole("radio", { name: /^Todas/ })).toBeDefined();
  });

  it("refuses a date and installments change in one edit", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    await openSeries(installments, july);

    await typeDate(user, "18/07/2026");
    const parcels = screen.getByLabelText("Número de parcelas");
    await user.clear(parcels);
    await user.type(parcels, "10");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(
      await screen.findByText(
        "Mude a data e o número de parcelas em edições separadas. Salve uma, depois a outra.",
      ),
    ).toBeDefined();
    expect(screen.queryByRole("radio", { name: /^Só esta/ })).toBeNull();
    expect(writes(requests)).toEqual([]);
  });

  it.each([
    {
      slug: "series-date-change-invalid",
      language: "en",
      message:
        'That date change is not possible: with "All" the date does not change, and the month only changes from the first occurrence.',
    },
    {
      slug: "series-date-change-invalid",
      language: "pt-BR",
      message:
        'Essa mudança de data não é possível: com "Todas" a data não muda, e o mês só muda a partir da primeira ocorrência.',
    },
    {
      slug: "series-month-change-confirmed",
      language: "en",
      message: "The start month only changes when no occurrence is confirmed. Nothing was changed.",
    },
    {
      slug: "series-month-change-confirmed",
      language: "pt-BR",
      message: "O mês de início só muda quando nenhuma ocorrência está confirmada. Nada foi alterado.",
    },
  ] as const)("shows the series date problems from the API", async ({ slug, language, message }) => {
    const user = userEvent.setup();
    await i18n.changeLanguage(language);
    server.use(transactionHandlers.series(monthly), transactionHandlers.updateSeriesRejected(422, slug));
    renderDrawer({ mode: "edit", transaction: april, members: [lucas] });
    const save = language === "en" ? "Save" : "Salvar";
    await waitFor(() => expect(screen.getByRole("button", { name: save })).toHaveProperty("disabled", false));

    await typeDate(user, "18/05/2026", language === "en" ? "Date" : "Data");
    await user.click(screen.getByRole("button", { name: save }));
    // "This one" is the scope the dialog starts on.
    await user.click(await screen.findByRole("button", { name: language === "en" ? "Continue" : "Continuar" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(message, undefined));
  });

  it("sends the series' new end date on the next edit", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(transactionHandlers.updateSeries(edited));
    await openSeries(monthly, april);

    // The first edit moves the series' end from 16/06 to 18/06.
    server.use(transactionHandlers.series({ ...monthly, version: 4, endDate: "2026-06-18" }));
    await typeDate(user, "18/04/2026");
    await user.click(screen.getByRole("button", { name: "Salvar" }));
    await user.click(await screen.findByRole("radio", { name: /^Esta e as seguintes/ }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await waitFor(() => expect(writes(requests)).toHaveLength(1));
    await waitFor(() => expect(screen.getByLabelText<HTMLInputElement>("Data de término").value).toBe("18/06/2026"));
    await waitFor(() => expect(screen.getByRole("button", { name: "Salvar" })).toHaveProperty("disabled", false));

    await user.click(screen.getByRole("button", { name: "Salvar" }));
    await user.click(await screen.findByRole("button", { name: "Continuar" }));
    await waitFor(() => expect(writes(requests)).toHaveLength(2));

    expect(await writes(requests)[0].json()).toMatchObject({
      scope: "THIS_AND_FOLLOWING",
      pivotDate: "2026-04-18",
      series: { endDate: "2026-06-16" },
      version: 3,
    });
    expect(await writes(requests)[1].json()).toMatchObject({
      pivotDate: null,
      series: { endDate: "2026-06-18" },
      version: 4,
    });
  });
  it("saves an occurrence moved past the series end", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(transactionHandlers.updateSeries(edited));
    // June's occurrence was moved alone to 02/07, past the series' end on 16/06.
    const movedJune: Transaction = { ...april, startDate: "2026-07-02", endDate: "2026-07-02" };
    await openSeries(monthly, movedJune);

    expect(screen.getByLabelText<HTMLInputElement>("Data").value).toBe("02/07/2026");
    const amount = screen.getByLabelText("Valor");
    await user.clear(amount);
    await user.type(amount, "9000");
    await user.click(screen.getByRole("button", { name: "Salvar" }));
    await user.click(await screen.findByRole("button", { name: "Continuar" }));

    await waitFor(() => expect(writes(requests)).toHaveLength(1));
    expect(await writes(requests)[0].json()).toMatchObject({
      scope: "THIS_ONE",
      series: { amount: 90, endDate: "2026-06-16" },
    });
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

  it("keeps a former member's share when saving", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const shared: Transaction = {
      ...savedTransaction,
      splitMode: "EXACT",
      participants: [
        { id: lucas.userId, name: "Lucas", shareAmount: 75.25 },
        { id: 9, name: "Ana Lima", shareAmount: 75.25 },
      ],
    };
    server.use(transactionHandlers.update(shared));
    renderDrawer({ mode: "edit", transaction: shared, members: [lucas, livia] });

    const former = await screen.findByRole("checkbox", { name: "Ana Lima (no longer in the plan)" });
    expect(former.getAttribute("aria-checked")).toBe("true");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await sentBody(requests, "PUT")).toMatchObject({
      participants: [
        { memberId: lucas.userId, shareAmount: 75.25 },
        { memberId: 9, shareAmount: 75.25 },
      ],
    });
  });

  it("shows the split of a row shared with a former member in a one-member plan", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const shared: Transaction = {
      ...savedTransaction,
      amount: 100,
      participants: [
        { id: lucas.userId, name: "Lucas", shareAmount: 50 },
        { id: 9, name: "Ana Lima", shareAmount: 50 },
      ],
    };
    server.use(transactionHandlers.update(shared));
    renderDrawer({ mode: "edit", transaction: shared, members: [lucas] });

    expect(await screen.findByRole("checkbox", { name: "Ana Lima (no longer in the plan)" })).toBeTruthy();
    const amount = screen.getByLabelText("Amount");
    await user.clear(amount);
    await user.type(amount, "12000");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await sentBody(requests, "PUT")).toMatchObject({
      amount: 120,
      participants: [{ memberId: lucas.userId }, { memberId: 9 }],
    });
  });

  it("the date field has no clear button", () => {
    renderDrawer({ members: [lucas] });

    // A new transaction opens on today's date, so a clear button would show if the field allowed it.
    expect((screen.getByLabelText("Date") as HTMLInputElement).value).not.toBe("");
    expect(screen.queryByRole("button", { name: "Clear date" })).toBeNull();
  });

  async function chooseKind(user: ReturnType<typeof userEvent.setup>, name: string) {
    await user.click(screen.getByRole("combobox", { name: "Movement kind" }));
    await user.click(await screen.findByRole("option", { name }));
  }

  it("saves a neutral kind without category or split", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const food: Category = { id: 1, version: 0, type: "DEBIT", description: "Food" };
    server.use(transactionHandlers.create({ ...savedTransaction, kind: "CARD_BILL_PAYMENT" }));
    renderDrawer({ members: [lucas, livia], categories: [food] });
    await user.type(screen.getByLabelText("Description"), "Card bill");
    await user.type(screen.getByLabelText("Amount"), "150000");
    await user.click(screen.getByLabelText("Category"));
    await user.click(await screen.findByRole("option", { name: "Food" }));
    await user.click(await screen.findByRole("button", { name: "Someone else" }));

    await chooseKind(user, "Card bill");

    expect(screen.queryByLabelText("Category")).toBeNull();
    expect(screen.queryByRole("button", { name: "Someone else" })).toBeNull();
    expect(screen.queryByText("Items")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(body).toMatchObject({
      kind: "CARD_BILL_PAYMENT",
      amount: 1500,
      splitMode: "EQUAL",
      participants: [{ memberId: lucas.userId }],
      items: [],
    });
    expect(body).not.toHaveProperty("categoryId");
  });

  it("keeps the payer of a neutral row when another member saves it", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const livias: Transaction = {
      ...savedTransaction,
      kind: "TRANSFER",
      amount: 500,
      participants: [{ id: livia.userId, name: "Livia", shareAmount: 500 }],
    };
    server.use(transactionHandlers.update(livias));
    renderDrawer({ mode: "edit", transaction: livias, members: [lucas, livia] });

    // The members load first: a form reset after them would drop what is typed.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Save" })).toHaveProperty("disabled", false),
    );
    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Pix to Lucas");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await sentBody(requests, "PUT")).toMatchObject({
      kind: "TRANSFER",
      description: "Pix to Lucas",
      splitMode: "EQUAL",
      participants: [{ memberId: livia.userId }],
    });
  });

  it("keeps the category of a refund, from the expense categories", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const food: Category = { id: 1, version: 0, type: "DEBIT", description: "Food" };
    server.use(transactionHandlers.create({ ...savedTransaction, type: "CREDIT", kind: "REFUND" }));
    renderDrawer({ members: [lucas], categories: [food] });
    await user.type(screen.getByLabelText("Description"), "Pizza back");
    await user.type(screen.getByLabelText("Amount"), "5000");
    await user.click(screen.getByRole("button", { name: "Credit" }));
    await user.click(screen.getByRole("combobox", { name: "Movement kind" }));
    await user.click(await screen.findByRole("option", { name: "Refund" }));

    expect(screen.queryByText("Items")).toBeNull();
    await user.click(screen.getByLabelText("Category"));
    await user.click(await screen.findByRole("option", { name: "Food" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await sentBody(requests, "POST")).toMatchObject({
      type: "CREDIT",
      kind: "REFUND",
      categoryId: 1,
      items: [],
    });
    const categoryTypes = requests
      .map((request) => new URL(request.url))
      .filter((url) => url.pathname.endsWith("/category"))
      .map((url) => url.searchParams.get("type"));
    // The picker of a refund lists expense categories although the row is a credit.
    expect(categoryTypes.at(-1)).toBe("DEBIT");
  });

  it("reopens a row with its movement kind", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const saved: Transaction = { ...savedTransaction, kind: "SAVINGS" };
    server.use(transactionHandlers.update(saved));
    renderDrawer({ mode: "edit", transaction: saved, members: [lucas, livia] });

    expect(screen.getByRole("combobox", { name: "Movement kind" }).textContent).toContain("Savings");
    expect(screen.queryByLabelText("Category")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Save" }));

    // The PUT replaces the whole row, so the kind has to travel back or it is cleared.
    expect(await sentBody(requests, "PUT")).toMatchObject({ kind: "SAVINGS" });
  });

  it("one-off shows no confirmation controls", () => {
    renderDrawer({ mode: "edit", transaction: savedTransaction, members: [lucas] });

    expect(screen.queryByRole("switch", { name: "Requires confirmation" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Forecast" })).toBeNull();
  });
});
