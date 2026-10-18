import type {
  FinancialTransaction,
  Plan,
  RecurrenceDefinitionResponse,
  SeriesEditScope,
} from "@/api/dtos";
import { financialTransactionHandlers } from "@/api/services/financialTransaction.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TransactionFormMode, TransactionFormOutput } from "./transactionForm";
import { useTransactionFormSubmit } from "./useTransactionFormSubmit";

const PLAN_ID = 5;
const API = `/api/findraco/plan/${PLAN_ID}/financial-transaction`;

const values: TransactionFormOutput = {
  type: "DEBIT",
  description: "Rent",
  amount: 150.5,
  category: null,
  date: new Date(2026, 6, 1),
  recurring: false,
  seriesEdit: false,
  attributionMode: "ME",
  splitMode: "EQUAL",
  participants: [],
  items: [],
};

const saved: FinancialTransaction = {
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

const occurrence: FinancialTransaction = { ...saved, id: 55, seriesId: "s-1", description: "Gym (3/12)" };

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

const series = { seriesId: "s-1", count: 12, occurrences: [occurrence] };

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

type SetupOptions = {
  mode: TransactionFormMode;
  transaction?: FinancialTransaction;
  definition?: RecurrenceDefinitionResponse;
  scope?: SeriesEditScope | null;
};

function setup({ mode, transaction, definition, scope = "THIS_ONE" }: SetupOptions) {
  const requests = recordRequests();
  const onDone = vi.fn();
  const chooseScope = vi.fn().mockResolvedValue(scope);
  const { result } = renderHookWithProviders(
    () =>
      useTransactionFormSubmit({
        mode,
        transaction,
        definition,
        showAttribution: false,
        chooseScope,
        onDone,
      }),
    { plan: planValue() },
  );
  return { result, requests, onDone, chooseScope };
}

function sent(requests: Request[]) {
  return requests.map((request) => [request.method, new URL(request.url).pathname]);
}

describe("useTransactionFormSubmit — single transactions (STD-07 AC 2)", () => {
  it("creates a transaction and finishes", async () => {
    server.use(financialTransactionHandlers.create(saved));
    const { result, requests, onDone } = setup({ mode: "create" });

    await act(() => result.current.submit(values));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(sent(requests)).toEqual([["POST", API]]);
    expect(await requests[0].json()).toEqual({
      type: "DEBIT",
      description: "Rent",
      amount: 150.5,
      startDate: "2026-07-01",
      items: [],
    });
  });

  it("updates the edited transaction and finishes", async () => {
    server.use(financialTransactionHandlers.update(saved));
    const { result, requests, onDone } = setup({ mode: "edit", transaction: saved });

    await act(() => result.current.submit({ ...values, amount: 99 }));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(sent(requests)).toEqual([["PUT", `${API}/42`]]);
    expect(await requests[0].json()).toMatchObject({ amount: 99, description: "Rent" });
  });

  it("creates a new transaction when duplicating, leaving the original untouched", async () => {
    server.use(financialTransactionHandlers.create(saved));
    const { result, requests, onDone } = setup({ mode: "duplicate", transaction: saved });

    await act(() => result.current.submit(values));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(sent(requests)).toEqual([["POST", API]]);
  });

  it("creates a series when creating a recurring transaction", async () => {
    server.use(financialTransactionHandlers.createSeries(series));
    const { result, requests, onDone } = setup({ mode: "create" });

    await act(() =>
      result.current.submit({ ...values, recurring: true, recurrenceMode: "RECURRING" }),
    );

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(sent(requests)).toEqual([["POST", `${API}/series`]]);
    expect(await requests[0].json()).toMatchObject({ mode: "RECURRING", interval: "MONTHLY" });
  });

  it("keeps the form open when the request fails", async () => {
    server.use(financialTransactionHandlers.createRejected("Category not found"));
    const { result, requests, onDone } = setup({ mode: "create" });

    await act(() => result.current.submit(values));

    await waitFor(() => expect(requests).toHaveLength(1));
    await waitFor(() => expect(result.current.isSubmitting).toBe(false));
    expect(onDone).not.toHaveBeenCalled();
  });
});

describe("useTransactionFormSubmit — series edit (STD-07 AC 2)", () => {
  const seriesValues: TransactionFormOutput = {
    ...values,
    description: "Gym",
    seriesEdit: true,
    recurrenceMode: "INSTALLMENT",
    parcelsNumber: 12,
  };

  it.each<SeriesEditScope>(["THIS_ONE", "THIS_AND_FOLLOWING", "ALL"])(
    "asks for the scope and edits the series with %s",
    async (scope) => {
      server.use(financialTransactionHandlers.updateSeries(series));
      const { result, requests, onDone, chooseScope } = setup({
        mode: "edit",
        transaction: occurrence,
        definition: installments,
        scope,
      });

      await act(() => result.current.submit(seriesValues));

      await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
      expect(chooseScope).toHaveBeenCalledWith({ title: "Edit series" });
      expect(sent(requests)).toEqual([["PUT", `${API}/series/s-1`]]);
      expect(await requests[0].json()).toMatchObject({
        scope,
        pivotOccurrenceId: 55,
        description: "Gym",
        parcelsNumber: 12,
      });
    },
  );

  it("edits the whole series without asking when the number of installments changed", async () => {
    server.use(financialTransactionHandlers.updateSeries(series));
    const { result, requests, onDone, chooseScope } = setup({
      mode: "edit",
      transaction: occurrence,
      definition: installments,
    });

    await act(() => result.current.submit({ ...seriesValues, parcelsNumber: 10 }));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(chooseScope).not.toHaveBeenCalled();
    expect(await requests[0].json()).toMatchObject({ scope: "ALL", parcelsNumber: 10 });
  });

  it("sends nothing when the scope prompt is cancelled", async () => {
    const { result, requests, onDone } = setup({
      mode: "edit",
      transaction: occurrence,
      definition: installments,
      scope: null,
    });

    await act(() => result.current.submit(seriesValues));

    expect(requests).toEqual([]);
    expect(onDone).not.toHaveBeenCalled();
  });

  it("sends nothing while the series definition is still loading", async () => {
    const { result, requests, chooseScope } = setup({ mode: "edit", transaction: occurrence });

    await act(() => result.current.submit(seriesValues));

    expect(chooseScope).not.toHaveBeenCalled();
    expect(requests).toEqual([]);
  });
});
