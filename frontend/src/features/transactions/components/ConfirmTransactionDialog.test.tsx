import type { Transaction } from "@/api/dtos/transaction";
import { transactionHandlers } from "@/api/services/transaction.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmTransactionDialog } from "./ConfirmTransactionDialog";

const plan: PlanContextValue = { activePlanId: 5, setActivePlanId: () => {}, plans: [], isLoading: false };

const pending: Transaction = {
  id: 40,
  permissions: { edit: true, delete: true },
  version: 3,
  type: "DEBIT",
  amount: 200,
  description: "Electricity",
  startDate: "2026-10-10",
  endDate: "2026-10-10",
  seriesId: "s1",
  splitMode: "EQUAL",
  participants: [],
  items: [],
  status: "PENDING",
  requiresConfirmation: true,
};

afterEach(cleanup);

describe("ConfirmTransactionDialog", () => {
  it("opens with the occurrence amount and date", async () => {
    renderWithProviders(<ConfirmTransactionDialog transaction={pending} onClose={vi.fn()} />, { plan });

    const amount = await screen.findByRole("textbox", { name: "Amount" });
    // The currency mask separates the symbol with a no-break space.
    expect((amount as HTMLInputElement).value).toMatch(/^R\$\s200,00$/);
    expect((screen.getByLabelText("Date") as HTMLInputElement).value).toBe("10/10/2026");
  });

  it("confirms with the edited amount", async () => {
    const user = userEvent.setup({ delay: null });
    const onClose = vi.fn();
    const requests = recordRequests();
    server.use(transactionHandlers.confirm({ ...pending, amount: 187.4, status: "ACTUAL" }));
    renderWithProviders(<ConfirmTransactionDialog transaction={pending} onClose={onClose} />, { plan });

    const amount = await screen.findByRole("textbox", { name: "Amount" });
    await user.clear(amount);
    await user.type(amount, "18740");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    const post = requests.find((request) => request.method === "POST");
    expect(new URL(post?.url ?? "").pathname).toBe("/api/findraco/plan/5/transaction/40/confirm");
    expect(await post?.json()).toEqual({ amount: 187.4, startDate: "2026-10-10", version: 3 });
  });
});
