import type { Contact, Plan } from "@/api/dtos";
import { contactHandlers } from "@/api/services/contact.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { ConfirmDialogProvider } from "@/components/dialog/ConfirmDialogProvider";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, useNavigationType } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactsSection } from "./ContactsSection";

const PLAN_ID = 5;
const CONTACTS = `/api/findraco/plan/${PLAN_ID}/contacts`;

const mae: Contact = { id: 7, name: "Mãe", archived: false, owed: 0, credit: 0, version: 0 };
const ana: Contact = { id: 8, name: "Ana", archived: false, owed: 50, credit: 0, version: 0 };
const caio: Contact = { id: 9, name: "Caio", archived: false, owed: 0, credit: 0, version: 0 };

function planValue(myRole: Plan["myRole"]): PlanContextValue {
  const plan: Plan = {
    id: PLAN_ID,
    name: "Home",
    isDefault: true,
    myRole,
    permissions: {
      createTransactions: true,
      attributeToOthers: myRole === "OWNER" || myRole === "EDITOR",
      manageCategories: true,
      managePlan: myRole === "OWNER",
    },
  };
  return { activePlanId: PLAN_ID, setActivePlanId: vi.fn(), activePlan: plan, plans: [plan], isLoading: false };
}

let pathname: string;
let navigationType: string;
function RouteProbe() {
  pathname = useLocation().pathname;
  navigationType = useNavigationType();
  return null;
}

function renderSection(myRole: Plan["myRole"] = "OWNER") {
  renderWithProviders(
    <ConfirmDialogProvider>
      <ContactsSection />
      <RouteProbe />
    </ConfirmDialogProvider>,
    { plan: planValue(myRole), route: "/plans" },
  );
}

async function openMenu(user: ReturnType<typeof userEvent.setup>, name: string, item: string) {
  await user.click(await screen.findByRole("button", { name: `Actions for ${name}` }));
  await user.click(await screen.findByRole("menuitem", { name: item }));
}

function sent(requests: Request[], method: string) {
  return requests.filter((request) => request.method === method).map((request) => new URL(request.url).pathname);
}

afterEach(cleanup);

describe("ContactsSection", () => {
  it("creates a contact and lists it", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(contactHandlers.list([]));
    renderSection();
    expect(await screen.findByText("No contacts yet")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "New contact" }));
    await user.type(screen.getByLabelText("Name"), "  Mãe  ");
    // The list the section reloads after the save already has her.
    server.use(contactHandlers.list([mae]), contactHandlers.create(mae));
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("Mãe")).toBeTruthy();
    const post = requests.find((request) => request.method === "POST");
    expect(post && new URL(post.url).pathname).toBe(CONTACTS);
    expect(await post?.json()).toEqual({ name: "Mãe" });
    expect(screen.getByText("Settled")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the taken-name error on the field", async () => {
    const user = userEvent.setup();
    server.use(contactHandlers.list([mae]), contactHandlers.createRejected(422, "contact-name-taken"));
    renderSection();

    await user.click(await screen.findByRole("button", { name: "New contact" }));
    await user.type(screen.getByLabelText("Name"), "mãe");
    await user.click(screen.getByRole("button", { name: "Create" }));

    const dialog = await screen.findByRole("dialog", { name: "New contact" });
    const error = await within(dialog).findByText("A contact with that name already exists");
    expect(error.closest("[data-slot=field-error]")).toBeTruthy();
    expect(within(dialog).getByLabelText<HTMLInputElement>("Name").value).toBe("mãe");
  });

  it("refuses to archive a contact with a balance", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(contactHandlers.list([ana]), contactHandlers.archiveRejected(409, "contact-balance-not-zero"));
    renderSection();

    await openMenu(user, "Ana", "Archive");

    expect(await screen.findByText("Settle the balance before archiving")).toBeTruthy();
    expect(screen.getByText("Ana: Owes R$ 50,00")).toBeTruthy();
    expect(sent(requests, "POST")).toEqual([`${CONTACTS}/8/archive`]);
    // The contact stays where it was: active, with no archived group.
    expect(screen.queryByText("Archived")).toBeNull();
    expect(screen.getByText("Owes R$ 50,00")).toBeTruthy();
  });

  it("refuses to archive a contact with planned purchases", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(contactHandlers.list([caio]), contactHandlers.archiveRejected(409, "contact-has-planned-shares"));
    renderSection();

    await openMenu(user, "Caio", "Archive");

    expect(await screen.findByText("End or remove the planned purchases before archiving")).toBeTruthy();
    expect(screen.getByText("Caio has planned purchases or a series still running.")).toBeTruthy();
    expect(sent(requests, "POST")).toEqual([`${CONTACTS}/9/archive`]);
    // The contact stays active, with no archived group.
    expect(screen.queryByText("Archived")).toBeNull();
  });

  it("archives a settled contact", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(contactHandlers.list([caio]));
    renderSection();
    await screen.findByText("Caio");
    expect(screen.queryByText("Archived")).toBeNull();

    server.use(contactHandlers.list([{ ...caio, archived: true }]), contactHandlers.archive({ ...caio, archived: true }));
    await openMenu(user, "Caio", "Archive");

    expect(await screen.findByText("Archived")).toBeTruthy();
    expect(sent(requests, "POST")).toEqual([`${CONTACTS}/9/archive`]);
    // Archived rows offer to bring the contact back.
    await user.click(screen.getByRole("button", { name: "Actions for Caio" }));
    expect(await screen.findByRole("menuitem", { name: "Unarchive" })).toBeTruthy();
  });

  it("offers archive when delete is refused", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(contactHandlers.list([mae]), contactHandlers.removeRejected(409, "contact-in-use"));
    renderSection();

    await openMenu(user, "Mãe", "Delete");
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    expect(await screen.findByText(/cannot be deleted\. Archive it instead\./)).toBeTruthy();
    expect(sent(requests, "DELETE")).toEqual([`${CONTACTS}/7`]);
    server.use(contactHandlers.archive({ ...mae, archived: true }));
    await user.click(screen.getByRole("button", { name: "Archive" }));
    await waitFor(() => expect(sent(requests, "POST")).toEqual([`${CONTACTS}/7/archive`]));
  });

  it("opens the statement route", async () => {
    const user = userEvent.setup();
    server.use(contactHandlers.list([ana]));
    renderSection();

    await user.click(await screen.findByRole("link", { name: /Ana/ }));

    expect(pathname).toBe("/plans/contacts/8");
    // A push, so the browser back returns to the Plans page.
    expect(navigationType).toBe("PUSH");
  });

  it("gives a viewer the list with no way to change it", async () => {
    server.use(contactHandlers.list([ana]));
    renderSection("VIEWER");

    expect(await screen.findByText("Ana")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "New contact" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Actions for/ })).toBeNull();
  });
});
