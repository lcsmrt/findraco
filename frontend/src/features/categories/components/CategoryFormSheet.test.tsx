import type { Category, Plan, PlanMember } from "@/api/dtos";
import { categoryHandlers } from "@/api/services/category.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryFormSheet } from "./CategoryFormSheet";

const PLAN_ID = 5;
const lucas: PlanMember = { userId: 1, name: "Lucas", email: "lucas@example.com", role: "OWNER" };

const groceries: Category = {
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
  editing?: Category;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (category: Category) => void;
};

function renderSheet({ members, editing, onOpenChange = vi.fn(), onSuccess }: RenderSheetOptions) {
  server.use(
    planHandlers.members(members),
    categoryHandlers.list({
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
      onOpenChange={onOpenChange}
      mode={editing ? "edit" : "create"}
      category={editing}
      onSuccess={onSuccess}
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

beforeEach(() => {
  // The toast is the user-visible outcome of a save; sonner is a third-party module.
  vi.spyOn(toast, "success");
  vi.spyOn(toast, "error");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CategoryFormSheet edit", () => {
  afterEach(cleanup);

  it("shows a saved limit formatted and sends it back as a number (STD-06 AC 4)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onSuccess = vi.fn();
    server.use(categoryHandlers.update(groceries));
    await renderLoadedSheet({ members: [lucas], editing: groceries, onSuccess });

    const limit = screen.getByLabelText<HTMLInputElement>("Amount (optional)");
    await waitFor(() => expect(limit.value).toBe("R$ 200,00"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    const body = await sentBody(requests, "PUT");
    expect(body.spendingLimit).toBe(200);
    expect(requests.find((request) => request.method === "PUT")?.url).toMatch(
      /\/plan\/5\/category\/9$/,
    );
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(groceries));
  });
});

describe("CategoryFormSheet skeleton", () => {
  afterEach(cleanup);

  it("closes on Cancel without sending anything (STD-06 AC 8)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onOpenChange = vi.fn();
    await renderLoadedSheet({ members: [lucas], onOpenChange });

    await user.type(screen.getByLabelText("Name"), "Groceries");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(requests.filter((request) => request.method !== "GET")).toEqual([]);
  });

  it("sends the full form on Submit and closes once saved (STD-06 AC 4, 8)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    server.use(categoryHandlers.create(groceries));
    await renderLoadedSheet({ members: [lucas], onOpenChange, onSuccess });

    await user.type(screen.getByLabelText("Name"), "Groceries");
    await user.type(screen.getByLabelText("Amount (optional)"), "25050");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await sentBody(requests, "POST")).toEqual({
      type: "DEBIT",
      description: "Groceries",
      parentId: null,
      ownerId: null,
      spendingLimit: 250.5,
      memberLimits: [],
    });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(onSuccess).toHaveBeenCalledWith(groceries);
  });

  it("keeps the sheet open with the typed values when saving fails, with no success toast (STD-06 AC 8)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();
    server.use(categoryHandlers.createRejected(422, "category-parent-type-mismatch"));
    await renderLoadedSheet({ members: [lucas], onOpenChange, onSuccess });

    await user.type(screen.getByLabelText("Name"), "Groceries");
    await user.type(screen.getByLabelText("Amount (optional)"), "25050");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await sentBody(requests, "POST");
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(screen.getByLabelText<HTMLInputElement>("Name").value).toBe("Groceries");
    expect(screen.getByLabelText<HTMLInputElement>("Amount (optional)").value).toBe("R$ 250,50");
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
