import type { Plan } from "@/api/dtos";
import { financialTransactionHandlers } from "@/api/services/financialTransaction.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { act, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCsvImport } from "./useCsvImport";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const PLAN_ID = 5;
const LIST_KEY = ["financialTransactions", PLAN_ID];

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

const csv = new File(["date,amount,id,title\n01/07/2026,10.00,a1,Coffee"], "nubank.csv", {
  type: "text/csv",
});

function setup() {
  const requests = recordRequests();
  const { result, queryClient } = renderHookWithProviders(() => useCsvImport(), {
    plan: planValue(),
    seed: (client) => client.setQueryData(LIST_KEY, []),
  });
  return { result, queryClient, requests };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("useCsvImport (STD-12 AC 1)", () => {
  it("uploads the file, reports success and refreshes the list", async () => {
    server.use(financialTransactionHandlers.importCsv({ imported: 1 }));
    const { result, queryClient, requests } = setup();

    act(() => result.current.importCsv(csv));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Transactions imported."),
    );
    expect(requests).toHaveLength(1);
    expect(requests[0].method).toBe("POST");
    expect(new URL(requests[0].url).pathname).toBe(
      `/api/findraco/plan/${PLAN_ID}/financial-transaction/import`,
    );
    expect(queryClient.getQueryState(LIST_KEY)?.isInvalidated).toBe(true);
    expect(result.current.isImporting).toBe(false);
  });

  it("still reports success when the API skips rows the plan already has", async () => {
    server.use(financialTransactionHandlers.importCsv({ imported: 0 }));
    const { result, queryClient } = setup();

    act(() => result.current.importCsv(csv));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Transactions imported."),
    );
    expect(toast.error).not.toHaveBeenCalled();
    expect(queryClient.getQueryState(LIST_KEY)?.isInvalidated).toBe(true);
  });

  it("shows the API's message and leaves the list alone when the file is rejected", async () => {
    server.use(
      financialTransactionHandlers.importCsvRejected("Line 3 of the CSV is invalid: bad date"),
    );
    const { result, queryClient } = setup();

    act(() => result.current.importCsv(csv));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Line 3 of the CSV is invalid: bad date"),
    );
    expect(toast.success).not.toHaveBeenCalled();
    expect(queryClient.getQueryState(LIST_KEY)?.isInvalidated).toBe(false);
    expect(result.current.isImporting).toBe(false);
  });
});
