import type { PagedResponse, Plan, TransactionTrashEntry } from "@/api/dtos";
import { transactionHandlers } from "@/api/services/transaction.handlers";
import { useGetTransactions } from "@/api/services/useTransactionService";
import type { AuthContextValue } from "@/app/providers/useAuth";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlanTrashSection } from "./PlanTrashSection";

const PLAN_ID = 5;
const API = `/api/findraco/plan/${PLAN_ID}/transaction`;

const gym: TransactionTrashEntry = {
  id: 9,
  kind: "SERIES",
  scope: "ALL",
  description: "Gym",
  count: 6,
  amount: 1800,
  type: "DEBIT",
  deletedAt: "2026-11-10T12:00:00Z",
  deletedBy: { id: 1, name: "Ana" },
  expiresAt: "2026-12-10T12:00:00Z",
};
const rent: TransactionTrashEntry = {
  ...gym,
  id: 8,
  kind: "TRANSACTION",
  scope: null,
  description: "Rent",
  count: 1,
  amount: 150.5,
};

function pageOf<T>(content: T[]): PagedResponse<T> {
  return { content, page: 0, size: 50, totalElements: content.length, totalPages: 1, last: true };
}

const auth: AuthContextValue = {
  user: { id: 1, name: "Ana", email: "ana@example.com", timeZone: "UTC", timeZoneMode: "AUTOMATIC", language: null },
  setUser: vi.fn(),
  status: "authenticated",
  signIn: vi.fn(),
  signOut: vi.fn(),
  retry: vi.fn(),
  announceSessionExpiry: vi.fn(),
};

function planValue(myRole: Plan["myRole"]): PlanContextValue {
  const plan: Plan = {
    id: PLAN_ID,
    name: "Home",
    isDefault: true,
    myRole,
    permissions: { createTransactions: myRole !== "VIEWER", attributeToOthers: true, manageCategories: true, managePlan: true },
  };
  return { activePlanId: PLAN_ID, setActivePlanId: vi.fn(), activePlan: plan, plans: [plan], isLoading: false };
}

/** Keeps a transactions query active, as the Transactions tab does while it is open. */
function TransactionsProbe() {
  useGetTransactions();
  return null;
}

function renderSection(myRole: Plan["myRole"] = "OWNER") {
  const requests = recordRequests();
  renderWithProviders(
    <>
      <TransactionsProbe />
      <PlanTrashSection />
    </>,
    { auth, plan: planValue(myRole) },
  );
  return requests;
}

function transactionLists(requests: Request[]) {
  return requests.filter((request) => request.method === "GET" && new URL(request.url).pathname === API);
}

beforeEach(() => {
  vi.spyOn(toast, "success");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("PlanTrashSection", () => {
  it("hides the trash from a viewer", async () => {
    server.use(transactionHandlers.list(pageOf([])));
    const requests = renderSection("VIEWER");

    await waitFor(() => expect(transactionLists(requests)).toHaveLength(1));
    expect(screen.queryByText("Trash")).toBeNull();
    expect(requests.some((request) => new URL(request.url).pathname === `${API}/trash`)).toBe(false);
  });

  it("restoring an entry removes it and refreshes transactions", async () => {
    const user = userEvent.setup();
    server.use(transactionHandlers.list(pageOf([])), transactionHandlers.trash(pageOf([gym, rent])));
    const requests = renderSection();
    const restore = await screen.findByRole("button", { name: "Restore Gym" });
    await waitFor(() => expect(transactionLists(requests)).toHaveLength(1));
    // What the server answers once the deletion is restored.
    server.use(transactionHandlers.restore(6), transactionHandlers.trash(pageOf([rent])));

    await user.click(restore);

    await waitFor(() =>
      expect(
        requests.some((request) => request.method === "POST" && request.url.endsWith(`${API}/trash/9/restore`)),
      ).toBe(true),
    );
    await waitFor(() => expect(screen.queryByText("Gym")).toBeNull());
    expect(screen.getByText("Rent")).toBeTruthy();
    await waitFor(() => expect(transactionLists(requests)).toHaveLength(2));
    expect(toast.success).toHaveBeenCalledWith("Transaction restored.");
  });
});
