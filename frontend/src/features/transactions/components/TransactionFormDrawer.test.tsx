import type { FinancialTransaction, Plan, PlanMember } from "@/api/dtos";
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
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SeriesScopeDialogProvider } from "./SeriesScopeDialogProvider";
import { TransactionFormDrawer } from "./TransactionFormDrawer";
import type { TransactionFormMode } from "./transactionForm";

const PLAN_ID = 5;
const lucas: PlanMember = { userId: 1, name: "Lucas", email: "lucas@example.com", role: "OWNER" };
const livia: PlanMember = { userId: 2, name: "Livia", email: "livia@example.com", role: "EDITOR" };

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
  const plan: Plan = { id: PLAN_ID, name: "Home", isDefault: true, myRole: "OWNER" };
  return { activePlanId: PLAN_ID, setActivePlanId: vi.fn(), activePlan: plan, plans: [plan], isLoading: false };
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
};

function renderDrawer({ mode = "create", transaction, members }: RenderDrawerOptions) {
  server.use(
    planHandlers.members(members),
    financialTransactionCategoryHandlers.list({
      content: [],
      page: 0,
      size: 1000,
      totalElements: 0,
      totalPages: 0,
      last: true,
    }),
  );
  const onOpenChange = vi.fn();
  renderWithProviders(
    <CategoryFormSheetContext.Provider value={categorySheet}>
      <SeriesScopeDialogProvider>
        <TransactionFormDrawer open onOpenChange={onOpenChange} mode={mode} transaction={transaction} />
      </SeriesScopeDialogProvider>
    </CategoryFormSheetContext.Provider>,
    { auth: authValue(), plan: planValue() },
  );
  return { onOpenChange };
}

async function sentBody(requests: Request[], method: string) {
  await waitFor(() => expect(requests.some((request) => request.method === method)).toBe(true));
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
    expect(screen.getByLabelText<HTMLInputElement>("Amount").value).toBe("R$\u00a012,34");
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

  it("rejects an empty amount without sending anything (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    renderDrawer({ members: [lucas] });

    await user.type(screen.getByLabelText("Description"), "Groceries");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("Amount must be positive")).toBeTruthy();
    expect(screen.getByLabelText("Amount").getAttribute("aria-invalid")).toBe("true");
    expect(requests.filter((request) => request.method === "POST")).toEqual([]);
  });

  it("shows the items error when the items exceed the total, and sends nothing (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    renderDrawer({ members: [lucas] });

    await user.type(screen.getByLabelText("Description"), "Market");
    await user.type(screen.getByLabelText("Amount"), "1000");
    await user.click(screen.getByRole("button", { name: "Add item" }));
    await user.type(screen.getByPlaceholderText("Item description"), "Snacks");
    await user.type(screen.getByLabelText("Item 1 amount"), "2000");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("Items cannot exceed the transaction total")).toBeTruthy();
    // Testing Library collapses the non-breaking space pt-BR puts after "R$" into a plain space.
    expect(screen.getByText("Remainder: -R$ 10,00")).toBeTruthy();
    expect(requests.filter((request) => request.method === "POST")).toEqual([]);
  });

  it("sends item amounts as numbers (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.create(savedTransaction));
    renderDrawer({ members: [lucas] });

    await user.type(screen.getByLabelText("Description"), "Market");
    await user.type(screen.getByLabelText("Amount"), "1000");
    await user.click(screen.getByRole("button", { name: "Add item" }));
    await user.type(screen.getByPlaceholderText("Item description"), "Snacks");
    await user.type(screen.getByLabelText("Item 1 amount"), "250");
    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(body.amount).toBe(10);
    expect(body.items).toEqual([{ description: "Snacks", amount: 2.5 }]);
  });

  it("sends exact split shares as numbers (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.create(savedTransaction));
    renderDrawer({ members: [lucas, livia] });

    await user.type(screen.getByLabelText("Description"), "Dinner");
    await user.type(screen.getByLabelText("Amount"), "10000");
    await user.click(await screen.findByRole("button", { name: "Split" }));
    await user.click(screen.getByRole("button", { name: "Exact" }));
    await user.type(screen.getByLabelText("Lucas's share"), "3025");
    await user.type(screen.getByLabelText("Livia's share"), "6975");
    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(body.splitMode).toBe("EXACT");
    expect(body.participants).toEqual([
      { memberId: 1, shareAmount: 30.25 },
      { memberId: 2, shareAmount: 69.75 },
    ]);
  });

  it("shows a saved amount formatted and sends it back as a number (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionHandlers.update(savedTransaction));
    renderDrawer({ mode: "edit", transaction: savedTransaction, members: [lucas] });

    expect(screen.getByLabelText<HTMLInputElement>("Amount").value).toBe("R$\u00a0150,50");
    await user.click(screen.getByRole("button", { name: "Save" }));

    const body = await sentBody(requests, "PUT");
    expect(body.amount).toBe(150.5);
    expect(requests.find((request) => request.method === "PUT")?.url).toMatch(
      /\/plan\/5\/financial-transaction\/42$/,
    );
  });
});
