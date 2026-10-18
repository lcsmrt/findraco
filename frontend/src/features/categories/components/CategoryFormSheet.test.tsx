import type { FinancialTransactionCategory, Plan, PlanMember } from "@/api/dtos";
import { financialTransactionCategoryHandlers } from "@/api/services/financialTransactionCategory.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CategoryFormSheet } from "./CategoryFormSheet";

const PLAN_ID = 5;
const lucas: PlanMember = { userId: 1, name: "Lucas", email: "lucas@example.com", role: "OWNER" };
const livia: PlanMember = { userId: 2, name: "Livia", email: "livia@example.com", role: "EDITOR" };

const groceries: FinancialTransactionCategory = {
  id: 9,
  type: "DEBIT",
  description: "Groceries",
  parentId: null,
  spendingLimit: 200,
};

function planValue(): PlanContextValue {
  const plan: Plan = { id: PLAN_ID, name: "Home", isDefault: true, myRole: "OWNER" };
  return { activePlanId: PLAN_ID, setActivePlanId: vi.fn(), activePlan: plan, plans: [plan], isLoading: false };
}

type RenderSheetOptions = {
  members: PlanMember[];
  /** Edits this category; creates one when left out. */
  editing?: FinancialTransactionCategory;
};

function renderSheet({ members, editing }: RenderSheetOptions) {
  server.use(
    planHandlers.members(members),
    financialTransactionCategoryHandlers.list({
      content: editing ? [editing] : [],
      page: 0,
      size: 1000,
      totalElements: editing ? 1 : 0,
      totalPages: 1,
      last: true,
    }),
  );
  const { queryClient } = renderWithProviders(
    <CategoryFormSheet
      open
      onOpenChange={vi.fn()}
      mode={editing ? "edit" : "create"}
      category={editing}
    />,
    { plan: planValue() },
  );
  return { queryClient };
}

// The sheet resets its values when the members and categories arrive, which would wipe anything
// typed before; typing starts once both have loaded.
async function renderLoadedSheet(options: RenderSheetOptions) {
  const { queryClient } = renderSheet(options);
  await waitFor(() => expect(queryClient.isFetching()).toBe(0));
}

async function sentBody(requests: Request[], method: string) {
  await waitFor(() => expect(requests.some((request) => request.method === method)).toBe(true));
  return requests.find((request) => request.method === method)?.json();
}

describe("CategoryFormSheet limits", () => {
  afterEach(cleanup);

  it("submits a typed limit as a number (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionCategoryHandlers.create(groceries));
    await renderLoadedSheet({ members: [lucas] });

    await user.type(screen.getByLabelText("Name"), "Groceries");
    await user.type(screen.getByLabelText("Amount (optional)"), "25050");
    expect(screen.getByLabelText<HTMLInputElement>("Amount (optional)").value).toBe("R$ 250,50");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await sentBody(requests, "POST")).toEqual({
      type: "DEBIT",
      description: "Groceries",
      parentId: null,
      ownerId: null,
      spendingLimit: 250.5,
      memberLimits: [],
    });
  });

  it("submits no limit when the limit is left empty (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionCategoryHandlers.create(groceries));
    await renderLoadedSheet({ members: [lucas] });

    await user.type(screen.getByLabelText("Name"), "Groceries");
    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(body).toEqual({
      type: "DEBIT",
      description: "Groceries",
      parentId: null,
      ownerId: null,
      memberLimits: [],
    });
    expect("spendingLimit" in body).toBe(false);
  });

  it("submits per-member limits as numbers and skips a member left empty (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionCategoryHandlers.create(groceries));
    await renderLoadedSheet({ members: [lucas, livia] });

    await user.type(screen.getByLabelText("Name"), "Groceries");
    await user.click(screen.getByRole("button", { name: "Per member" }));
    await user.type(await screen.findByLabelText("Limit for Lucas"), "26000");
    await user.click(screen.getByRole("button", { name: "Create" }));

    const body = await sentBody(requests, "POST");
    expect(body.memberLimits).toEqual([{ memberId: 1, amount: 260 }]);
    expect("spendingLimit" in body).toBe(false);
  });

  it("shows a saved limit formatted and sends it back as a number (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(financialTransactionCategoryHandlers.update(groceries));
    await renderLoadedSheet({ members: [lucas], editing: groceries });

    const limit = screen.getByLabelText<HTMLInputElement>("Amount (optional)");
    await waitFor(() => expect(limit.value).toBe("R$ 200,00"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    const body = await sentBody(requests, "PUT");
    expect(body.spendingLimit).toBe(200);
    expect(requests.find((request) => request.method === "PUT")?.url).toMatch(
      /\/plan\/5\/financial-transaction-category\/9$/,
    );
  });
});
