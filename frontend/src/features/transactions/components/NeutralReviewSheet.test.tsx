import type { NeutralCandidate, PagedResponse, Plan, Transaction } from "@/api/dtos";
import { transactionHandlers } from "@/api/services/transaction.handlers";
import { useGetTransactions } from "@/api/services/useTransactionService";
import type { AuthContextValue } from "@/app/providers/useAuth";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NeutralReviewSheet } from "./NeutralReviewSheet";

const PLAN_ID = 5;
const API = `/api/findraco/plan/${PLAN_ID}/transaction`;

function row(id: number, description: string, version: number): Transaction {
  return {
    id,
    permissions: { edit: true, delete: true },
    version,
    type: "DEBIT",
    amount: 500,
    description,
    startDate: "2026-11-09",
    endDate: "2026-11-09",
    splitMode: "EQUAL",
    participants: [],
    items: [],
    status: "ACTUAL",
    requiresConfirmation: false,
  };
}

const pix: NeutralCandidate = {
  transaction: row(31, "Pix to Marina Souza Lima", 4),
  proposedKind: "TRANSFER",
};
const bill: NeutralCandidate = {
  transaction: row(32, "Pagamento de fatura", 7),
  proposedKind: "CARD_BILL_PAYMENT",
};

function pageOf(content: NeutralCandidate[]): PagedResponse<NeutralCandidate> {
  return { content, page: 0, size: 50, totalElements: content.length, totalPages: 1, last: true };
}

function emptyTransactions(): PagedResponse<Transaction> {
  return { content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true };
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

const plan: Plan = {
  id: PLAN_ID,
  name: "Home",
  isDefault: true,
  myRole: "OWNER",
  permissions: { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true },
};
const planValue: PlanContextValue = {
  activePlanId: PLAN_ID,
  setActivePlanId: vi.fn(),
  activePlan: plan,
  plans: [plan],
  isLoading: false,
};

/** Keeps a transactions query active, as the Transactions screen does while the sheet is open. */
function TransactionsProbe() {
  useGetTransactions();
  return null;
}

function renderSheet() {
  const requests = recordRequests();
  renderWithProviders(
    <>
      <TransactionsProbe />
      <NeutralReviewSheet open onOpenChange={vi.fn()} />
    </>,
    { auth, plan: planValue },
  );
  return requests;
}

function transactionLists(requests: Request[]) {
  return requests.filter((request) => request.method === "GET" && new URL(request.url).pathname === API);
}

beforeEach(() => {
  vi.spyOn(toast, "success");
  vi.spyOn(toast, "error");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("NeutralReviewSheet", () => {
  it("applies a candidate and removes it from the list", async () => {
    const user = userEvent.setup();
    server.use(transactionHandlers.list(emptyTransactions()), transactionHandlers.neutralCandidates(pageOf([pix, bill])));
    const requests = renderSheet();
    const apply = await screen.findByRole("button", { name: "Apply to Pix to Marina Souza Lima" });
    await waitFor(() => expect(transactionLists(requests)).toHaveLength(1));
    // What the server answers once the kind is set: the row has left the review.
    server.use(
      transactionHandlers.setKind({ ...pix.transaction, kind: "TRANSFER", version: 5 }),
      transactionHandlers.neutralCandidates(pageOf([bill])),
    );

    await user.click(apply);

    await waitFor(() =>
      expect(requests.some((request) => request.method === "POST" && request.url.endsWith(`${API}/31/kind`))).toBe(true),
    );
    const post = requests.find((request) => request.method === "POST");
    expect(await post?.json()).toEqual({ kind: "TRANSFER", version: 4 });
    await waitFor(() => expect(screen.queryByText("Pix to Marina Souza Lima")).toBeNull());
    expect(screen.getByText("Pagamento de fatura")).toBeTruthy();
    await waitFor(() => expect(transactionLists(requests)).toHaveLength(2));
    expect(toast.success).toHaveBeenCalledWith("Movement marked.");
  });

  it("applies the kind each candidate proposes", async () => {
    const user = userEvent.setup();
    server.use(transactionHandlers.list(emptyTransactions()), transactionHandlers.neutralCandidates(pageOf([pix, bill])));
    const requests = renderSheet();
    server.use(transactionHandlers.setKind({ ...bill.transaction, kind: "CARD_BILL_PAYMENT", version: 8 }));

    await user.click(await screen.findByRole("button", { name: "Apply to Pagamento de fatura" }));

    await waitFor(() => expect(requests.some((request) => request.method === "POST")).toBe(true));
    expect(await requests.find((request) => request.method === "POST")?.json()).toEqual({
      kind: "CARD_BILL_PAYMENT",
      version: 7,
    });
  });

  it("keeps the candidate and tells why when the server refuses the kind", async () => {
    const user = userEvent.setup();
    server.use(transactionHandlers.list(emptyTransactions()), transactionHandlers.neutralCandidates(pageOf([pix])));
    renderSheet();
    server.use(transactionHandlers.setKindRejected(422, "neutral-kind-invalid"));

    await user.click(await screen.findByRole("button", { name: "Apply to Pix to Marina Souza Lima" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(toast.success).not.toHaveBeenCalled();
    expect(screen.getByText("Pix to Marina Souza Lima")).toBeTruthy();
  });

  it("shows the empty state when nothing is left to review", async () => {
    server.use(transactionHandlers.list(emptyTransactions()), transactionHandlers.neutralCandidates(pageOf([])));
    renderSheet();

    const sheet = await screen.findByRole("dialog", { name: "Review movements" });
    expect(await within(sheet).findByText("Nothing to review.")).toBeTruthy();
  });
});
