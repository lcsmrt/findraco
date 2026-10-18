import type { FinancialTransactionCategory, Plan } from "@/api/dtos";
import { financialTransactionCategoryHandlers } from "@/api/services/financialTransactionCategory.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CategoryFormOutput } from "./categoryForm";
import { useCategoryFormSubmit } from "./useCategoryFormSubmit";

const PLAN_ID = 5;
const API = `/api/findraco/plan/${PLAN_ID}/financial-transaction-category`;

const groceries: FinancialTransactionCategory = {
  id: 9,
  type: "DEBIT",
  description: "Groceries",
  parentId: null,
  spendingLimit: 250.5,
};

const values: CategoryFormOutput = {
  type: "DEBIT",
  description: "Groceries",
  parentId: null,
  ownerId: null,
  spendingLimit: 250.5,
  limitMode: "single",
  memberLimits: [],
};

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

function setup(editing: FinancialTransactionCategory | null) {
  const requests = recordRequests();
  const onSuccess = vi.fn();
  const onDone = vi.fn();
  const { result } = renderHookWithProviders(
    () => useCategoryFormSubmit({ editing, onSuccess, onDone }),
    { plan: planValue() },
  );
  return { result, requests, onSuccess, onDone };
}

function sent(requests: Request[]) {
  return requests.map((request) => [request.method, new URL(request.url).pathname]);
}

describe("useCategoryFormSubmit (STD-07 AC 2)", () => {
  it("creates a category, hands it back and finishes", async () => {
    server.use(financialTransactionCategoryHandlers.create(groceries));
    const { result, requests, onSuccess, onDone } = setup(null);

    act(() => result.current.submit(values));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(sent(requests)).toEqual([["POST", API]]);
    expect(await requests[0].json()).toEqual({
      type: "DEBIT",
      description: "Groceries",
      parentId: null,
      ownerId: null,
      spendingLimit: 250.5,
      memberLimits: [],
    });
    expect(onSuccess).toHaveBeenCalledWith(groceries);
  });

  it("updates the edited category, hands it back and finishes", async () => {
    const renamed = { ...groceries, description: "Market" };
    server.use(financialTransactionCategoryHandlers.update(renamed));
    const { result, requests, onSuccess, onDone } = setup(groceries);

    act(() => result.current.submit({ ...values, description: "Market" }));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(sent(requests)).toEqual([["PUT", `${API}/9`]]);
    expect(await requests[0].json()).toMatchObject({ description: "Market" });
    expect(onSuccess).toHaveBeenCalledWith(renamed);
  });

  it("keeps the form open when the request fails", async () => {
    server.use(financialTransactionCategoryHandlers.createRejected("Name already in use"));
    const { result, requests, onSuccess, onDone } = setup(null);

    act(() => result.current.submit(values));

    await waitFor(() => expect(requests).toHaveLength(1));
    await waitFor(() => expect(result.current.isSubmitting).toBe(false));
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });
});
