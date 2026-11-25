import type { Contact, ContactStatement, Plan, PlanMember, Transaction } from "@/api/dtos";
import { categoryHandlers } from "@/api/services/category.handlers";
import { contactHandlers } from "@/api/services/contact.handlers";
import { planHandlers } from "@/api/services/plan.handlers";
import { transactionHandlers } from "@/api/services/transaction.handlers";
import { AddTransactionProvider } from "@/app/providers/AddTransactionProvider";
import type { AuthContextValue } from "@/app/providers/useAuth";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { ConfirmDialogProvider } from "@/components/dialog/ConfirmDialogProvider";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactStatementPage } from "./ContactStatementPage";

const PLAN_ID = 5;
const lucas: PlanMember = { userId: 1, name: "Lucas", email: "lucas@example.com", role: "OWNER" };
const mae: Contact = { id: 7, name: "Mãe", archived: false, owed: 500, credit: 0, version: 2 };

// October's R$ 200 and November's R$ 300 are both open, as the contact's statement lists them.
const statement: ContactStatement = {
  contact: mae,
  owed: 500,
  credit: 0,
  months: [
    {
      month: "2026-11",
      repayments: [],
      shares: [
        { participantId: 21, transactionId: 2, date: "2026-11-10", description: "Dinner", share: 300, allocated: 0, status: "OPEN" },
      ],
    },
    {
      month: "2026-10",
      repayments: [],
      shares: [
        { participantId: 20, transactionId: 1, date: "2026-10-05", description: "Market", share: 200, allocated: 0, status: "OPEN" },
      ],
    },
  ],
};

const saved: Transaction = {
  id: 90,
  permissions: { edit: true, delete: true },
  version: 0,
  type: "CREDIT",
  kind: "REPAYMENT",
  amount: 300,
  description: "Payment from Mãe",
  startDate: "2026-11-25",
  endDate: "2026-11-25",
  splitMode: "EQUAL",
  participants: [{ id: 1, name: "Lucas", shareAmount: 300 }],
  items: [],
  status: "ACTUAL",
  requiresConfirmation: false,
};

const auth: AuthContextValue = {
  user: { id: lucas.userId, name: lucas.name, email: lucas.email, timeZone: "UTC", timeZoneMode: "AUTOMATIC", language: null },
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
    permissions: {
      createTransactions: myRole !== "VIEWER",
      attributeToOthers: myRole === "OWNER" || myRole === "EDITOR",
      manageCategories: true,
      managePlan: myRole === "OWNER",
    },
  };
  return { activePlanId: PLAN_ID, setActivePlanId: vi.fn(), activePlan: plan, plans: [plan], isLoading: false };
}

let pathname: string;
function LocationProbe() {
  pathname = useLocation().pathname;
  return null;
}

function renderPage(myRole: Plan["myRole"] = "OWNER") {
  server.use(
    planHandlers.members([lucas]),
    contactHandlers.list([mae]),
    contactHandlers.statement(statement),
    categoryHandlers.list({ content: [], page: 0, size: 1000, totalElements: 0, totalPages: 0, last: true }),
  );
  renderWithProviders(
    <ConfirmDialogProvider>
      <AddTransactionProvider>
        <Routes>
          <Route path="/plans/contacts/:contactId" element={<ContactStatementPage />} />
          <Route path="/plans" element={<LocationProbe />} />
        </Routes>
      </AddTransactionProvider>
    </ConfirmDialogProvider>,
    { auth, plan: planValue(myRole), route: "/plans/contacts/7" },
  );
}

function isChecked(name: string) {
  return screen.getByRole("checkbox", { name }).getAttribute("aria-checked") === "true";
}

// The amount field writes a no-break space after the currency symbol.
function fieldAmount(label: string) {
  return screen.getByLabelText<HTMLInputElement>(label).value.replace(/\s/g, " ");
}

async function openPayment(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: "Record payment" }));
  return screen.findByRole("dialog", { name: "New Transaction" });
}

afterEach(cleanup);

describe("ContactStatementPage", () => {
  it("records a payment with the suggested allocation", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(transactionHandlers.create(saved));
    renderPage();

    const form = await openPayment(user);

    // Opened as an income of kind "Contact payment", with the contact chosen.
    expect(within(form).getByRole("combobox", { name: "Movement kind" }).textContent).toContain("Contact payment");
    expect(within(form).getByRole("button", { name: "Credit" }).getAttribute("aria-pressed")).toBe("true");
    expect(within(form).getByLabelText("Paid by").textContent).toContain("Mãe");
    expect(within(form).getByLabelText<HTMLInputElement>("Description").value).toBe("Payment from Mãe");
    await within(form).findByRole("checkbox", { name: "Market" });

    await user.type(within(form).getByLabelText("Amount"), "30000");

    expect(isChecked("Market")).toBe(true);
    expect(isChecked("Dinner")).toBe(true);
    expect(fieldAmount("Amount for Market")).toBe("R$ 200,00");
    expect(fieldAmount("Amount for Dinner")).toBe("R$ 100,00");
    await user.click(within(form).getByRole("button", { name: "Create" }));

    await waitFor(() => expect(requests.some((request) => request.method === "POST")).toBe(true));
    const post = requests.find((request) => request.method === "POST");
    expect(await post?.json()).toMatchObject({
      type: "CREDIT",
      kind: "REPAYMENT",
      amount: 300,
      contactId: 7,
      allocations: [
        { participantId: 20, amount: 200 },
        { participantId: 21, amount: 100 },
      ],
    });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "New Transaction" })).toBeNull());
  });

  it("sends only the ticked allocations", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(transactionHandlers.create(saved));
    renderPage();

    const form = await openPayment(user);
    await within(form).findByRole("checkbox", { name: "Market" });
    await user.type(within(form).getByLabelText("Amount"), "30000");
    await user.click(within(form).getByRole("checkbox", { name: "Market" }));
    await user.click(within(form).getByRole("button", { name: "Create" }));

    await waitFor(() => expect(requests.some((request) => request.method === "POST")).toBe(true));
    const post = requests.find((request) => request.method === "POST");
    const body = await post?.json();
    expect(body.allocations).toEqual([{ participantId: 21, amount: 100 }]);
    // R$ 200 of the R$ 300 settles no purchase: the whole payment is still sent.
    expect(body.amount).toBe(300);
  });

  it("gives a viewer the statement with no way to record a payment or change the contact", async () => {
    renderPage("VIEWER");

    expect(await screen.findByText("Owes R$ 500,00")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Record payment" })).toBeNull();
    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
  });

  it("leaves for the Plans page after deleting the contact", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    renderPage();
    server.use(contactHandlers.remove());

    await user.click(await screen.findByRole("button", { name: "More actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() => expect(pathname).toBe("/plans"));
    expect(requests.filter((request) => request.method === "DELETE")).toHaveLength(1);
  });
});
