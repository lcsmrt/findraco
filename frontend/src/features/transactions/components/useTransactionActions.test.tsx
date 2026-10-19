import type { FinancialTransaction, Plan, SeriesEditScope } from "@/api/dtos";
import { financialTransactionHandlers } from "@/api/services/financialTransaction.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { ConfirmDialogProvider } from "@/components/dialog/ConfirmDialogProvider";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SeriesScopeDialogProvider } from "./SeriesScopeDialogProvider";
import { useTransactionActions } from "./useTransactionActions";

const PLAN_ID = 5;
const API = `/api/findraco/plan/${PLAN_ID}/financial-transaction`;

const rent: FinancialTransaction = {
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
const gym: FinancialTransaction = { ...rent, id: 55, seriesId: "s-1", description: "Gym (3/12)" };

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

let actions: ReturnType<typeof useTransactionActions>;

function Probe() {
  actions = useTransactionActions();
  return null;
}

function setup() {
  const requests = recordRequests();
  renderWithProviders(
    <ConfirmDialogProvider>
      <SeriesScopeDialogProvider>
        <Probe />
      </SeriesScopeDialogProvider>
    </ConfirmDialogProvider>,
    { plan: planValue() },
  );
  return { requests, user: userEvent.setup() };
}

function sent(requests: Request[]) {
  return requests.map((request) => {
    const url = new URL(request.url);
    return [request.method, url.pathname + url.search];
  });
}

afterEach(cleanup);

describe("useTransactionActions — drawer (STD-12 AC 1)", () => {
  it("starts with the drawer closed", () => {
    setup();

    expect(actions.drawer).toEqual({ open: false, mode: "create" });
  });

  it("opens the drawer empty to create", () => {
    setup();

    act(() => actions.openCreate());

    expect(actions.drawer).toEqual({ open: true, mode: "create" });
  });

  it("opens the drawer on the transaction to edit it", () => {
    setup();

    act(() => actions.edit(rent));

    expect(actions.drawer).toEqual({ open: true, mode: "edit", transaction: rent });
  });

  it("opens the drawer prefilled with the transaction to duplicate it", () => {
    setup();

    act(() => actions.duplicate(rent));

    expect(actions.drawer).toEqual({ open: true, mode: "duplicate", transaction: rent });
  });

  it("closes the drawer when it asks to close, and ignores a request to open", () => {
    setup();
    act(() => actions.edit(rent));

    act(() => actions.onDrawerOpenChange(true));
    expect(actions.drawer.open).toBe(true);

    act(() => actions.onDrawerOpenChange(false));
    expect(actions.drawer).toEqual({ open: false, mode: "create" });
  });
});

describe("useTransactionActions — delete (STD-12 AC 1)", () => {
  it("deletes a single transaction once confirmed", async () => {
    server.use(financialTransactionHandlers.remove());
    const { requests, user } = setup();

    act(() => void actions.remove(rent));
    await screen.findByRole("dialog", { name: "Confirm Deletion" });
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(sent(requests)).toEqual([["DELETE", `${API}/42`]]));
  });

  it("deletes nothing when the confirmation is cancelled", async () => {
    const { requests, user } = setup();

    act(() => void actions.remove(rent));
    await screen.findByRole("dialog", { name: "Confirm Deletion" });
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(requests).toEqual([]);
  });

  it.each<[string, SeriesEditScope]>([
    ["This one", "THIS_ONE"],
    ["This and following", "THIS_AND_FOLLOWING"],
    ["All", "ALL"],
  ])("deletes %s of a series from the chosen occurrence", async (label, scope) => {
    server.use(financialTransactionHandlers.removeSeries());
    const { requests, user } = setup();

    act(() => void actions.remove(gym));
    await screen.findByRole("dialog", { name: "Delete series" });
    await user.click(screen.getByRole("radio", { name: new RegExp(`^${label}`) }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(sent(requests)).toEqual([
        ["DELETE", `${API}/series/s-1?scope=${scope}&pivotOccurrenceId=55`],
      ]),
    );
  });

  it("deletes nothing when the series scope is cancelled", async () => {
    const { requests, user } = setup();

    act(() => void actions.remove(gym));
    await screen.findByRole("dialog", { name: "Delete series" });
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(requests).toEqual([]);
  });

  it("closes the drawer before asking to delete from it", async () => {
    server.use(financialTransactionHandlers.remove());
    const { requests, user } = setup();
    act(() => actions.edit(rent));

    act(() => actions.removeFromDrawer(rent));
    expect(actions.drawer.open).toBe(false);
    await screen.findByRole("dialog", { name: "Confirm Deletion" });
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(sent(requests)).toEqual([["DELETE", `${API}/42`]]));
  });
});
