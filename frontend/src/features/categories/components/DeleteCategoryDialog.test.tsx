import type { Category, Plan, ProblemType } from "@/api/dtos";
import { categoryHandlers } from "@/api/services/category.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

const PLAN_ID = 5;

const groceries: Category = {
  id: 9,
  version: 0,
  type: "DEBIT",
  description: "Groceries",
  parentId: null,
  spendingLimit: null,
};

function planValue(): PlanContextValue {
  const plan: Plan = { id: PLAN_ID, name: "Home", isDefault: true, myRole: "OWNER" };
  return { activePlanId: PLAN_ID, setActivePlanId: vi.fn(), activePlan: plan, plans: [plan], isLoading: false };
}

function usageFetches(requests: Request[]) {
  return requests.filter((request) => request.method === "GET" && request.url.endsWith("/usage")).length;
}

async function deleteRejectedWith(type: ProblemType) {
  const user = userEvent.setup();
  const requests = recordRequests();
  const onOpenChange = vi.fn();
  server.use(
    categoryHandlers.usage({ transactions: 0, items: 0, recurrenceDefinitions: 0 }),
    categoryHandlers.deleteConflict(type),
  );
  renderWithProviders(
    <DeleteCategoryDialog open onOpenChange={onOpenChange} category={groceries} categories={[groceries]} />,
    { plan: planValue() },
  );

  await user.click(await screen.findByRole("button", { name: "Delete" }));

  await waitFor(() => expect(requests.some((request) => request.method === "DELETE")).toBe(true));
  return { requests, onOpenChange };
}

beforeEach(() => {
  // The toast is the user-visible outcome of a failure; sonner is a third-party module.
  vi.spyOn(toast, "error");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DeleteCategoryDialog conflicts", () => {
  it("tells a category that gained subcategories by the problem type (BST-08 AC 12)", async () => {
    const { requests, onOpenChange } = await deleteRejectedWith("category-has-subcategories");

    expect(
      await screen.findByText("This category now has subcategories. Move or delete them before deleting it."),
    ).toBeTruthy();
    expect(screen.queryByText(/is now in use/)).toBeNull();
    await waitFor(() => expect(usageFetches(requests)).toBe(2));
    expect(toast.error).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("tells a category that came into use by the problem type (BST-08 AC 12)", async () => {
    const { requests, onOpenChange } = await deleteRejectedWith("category-in-use");

    expect(
      await screen.findByText("This category is now in use. Choose a category to receive its transactions."),
    ).toBeTruthy();
    expect(screen.queryByText(/now has subcategories/)).toBeNull();
    await waitFor(() => expect(usageFetches(requests)).toBe(2));
    expect(toast.error).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("shows any other failure as a toast with the request id, never the detail", async () => {
    await deleteRejectedWith("stale-version");

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Someone else changed this in the meantime. Reload it and try again.", {
        description: "Request id: req-delete",
      }),
    );
  });
});
