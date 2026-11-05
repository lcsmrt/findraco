import type { ArchivedPlan, Plan } from "@/api/dtos";
import { planHandlers } from "@/api/services/plan.handlers";
import { PlanProvider } from "@/app/providers/PlanProvider";
import type { AuthContextValue } from "@/app/providers/useAuth";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { http, HttpResponse } from "msw";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ArchivedPlansSection } from "./ArchivedPlansSection";
import { PlanSwitcher } from "./PlanSwitcher";

const ownerRights = { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true };
const personal: Plan = { id: 1, name: "Personal", isDefault: true, myRole: "OWNER", permissions: ownerRights };
const oldHome: Plan = { id: 8, name: "Old home", isDefault: false, myRole: "OWNER", permissions: ownerRights };

const archivedOldHome: ArchivedPlan = {
  id: 8,
  name: "Old home",
  archivedAt: "2026-10-20T12:00:00Z",
  deletesAt: "2026-11-19T12:00:00Z",
};
const archivedTrip: ArchivedPlan = {
  id: 9,
  name: "Trip to Lisbon",
  archivedAt: "2026-10-28T12:00:00Z",
  deletesAt: "2026-11-27T12:00:00Z",
};

function noop() {}

/** A promise held open until `release` is called. */
function deferred() {
  let release = noop;
  const promise = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { promise, release };
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

function renderSection() {
  return renderWithProviders(
    <PlanProvider>
      <PlanSwitcher />
      <ArchivedPlansSection />
    </PlanProvider>,
    { auth },
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(toast, "success");
  vi.spyOn(toast, "error");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ArchivedPlansSection", () => {
  it("shows no Archived plans heading when the user owns no archived plan (PDEL-01 AC 2)", async () => {
    const requests = recordRequests();
    const { promise: held, release } = deferred();
    server.use(
      planHandlers.list([personal]),
      http.get("*/plan/archived", async () => {
        await held;
        return HttpResponse.json([]);
      }),
    );

    const { queryClient } = renderSection();

    await waitFor(() => expect(requests.some((request) => request.url.endsWith("/plan/archived"))).toBe(true));
    expect(await screen.findByRole("button", { name: /Personal/ })).toBeTruthy();
    expect(screen.queryByText("Archived plans")).toBeNull();

    release();
    await waitFor(() => expect(queryClient.getQueryState(["plans", "archived"])?.status).toBe("success"));
    expect(screen.queryByText("Archived plans")).toBeNull();
  });

  it("lists each archived plan with its archive and deletion dates (PDEL-01 AC 1)", async () => {
    server.use(planHandlers.list([personal]), planHandlers.archived([archivedOldHome, archivedTrip]));

    renderSection();

    expect(await screen.findByText("Old home")).toBeTruthy();
    expect(screen.getByText("Archived plans")).toBeTruthy();
    expect(screen.getByText("Archived on 20/10/2026")).toBeTruthy();
    expect(screen.getByText("Deleted permanently on 19/11/2026")).toBeTruthy();
    expect(screen.getByText("Trip to Lisbon")).toBeTruthy();
    expect(screen.getByText("Archived on 28/10/2026")).toBeTruthy();
    expect(screen.getByText("Deleted permanently on 27/11/2026")).toBeTruthy();
  });

  it("shows an error in its own section while the active plans still render (spec edge case: archived request fails)", async () => {
    server.use(planHandlers.list([personal]), planHandlers.archivedError());

    renderSection();

    expect((await screen.findByRole("alert")).textContent).toMatch(/Could not load your archived plans/);
    expect(screen.getByText("Archived plans")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Personal/ })).toBeTruthy();
  });

  it("restores a plan: sends the POST, the row leaves the list and the plan joins the switcher (PDEL-02 AC 3)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(planHandlers.list([personal]), planHandlers.archived([archivedOldHome, archivedTrip]));
    renderSection();
    const restore = await screen.findByRole("button", { name: "Restore Old home" });
    // What the server answers once the plan is active again.
    server.use(
      planHandlers.restore(oldHome),
      planHandlers.list([personal, oldHome]),
      planHandlers.archived([archivedTrip]),
    );
    await user.click(restore);

    await waitFor(() =>
      expect(requests.some((request) => request.method === "POST" && request.url.endsWith("/plan/8/restore"))).toBe(true),
    );
    await waitFor(() => expect(screen.queryByText("Old home")).toBeNull());
    expect(screen.getByText("Trip to Lisbon")).toBeTruthy();
    expect(toast.success).toHaveBeenCalledWith("Plan restored.");

    await user.click(screen.getByRole("button", { name: /Personal/ }));
    expect(await screen.findByRole("menuitemradio", { name: "Old home" })).toBeTruthy();
  });

  async function openDeleteDialog(user: ReturnType<typeof userEvent.setup>) {
    await user.click(await screen.findByRole("button", { name: "Delete Old home now" }));
    return screen.findByRole("dialog", { name: "Delete plan now" });
  }

  it("deletes a plan only after its exact name is typed: sends the DELETE, closes the dialog and drops the row (PDEL-04 AC 1, 3; PDEL-05)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(planHandlers.list([personal]), planHandlers.archived([archivedOldHome, archivedTrip]));
    renderSection();
    await openDeleteDialog(user);
    const confirm = screen.getByRole<HTMLButtonElement>("button", { name: "Delete now" });
    expect(confirm.disabled).toBe(true);
    await user.type(screen.getByLabelText('Type "Old home" to confirm'), "old home");
    expect(confirm.disabled).toBe(true);
    await user.clear(screen.getByLabelText('Type "Old home" to confirm'));
    await user.type(screen.getByLabelText('Type "Old home" to confirm'), "Old home");
    expect(confirm.disabled).toBe(false);
    server.use(planHandlers.deletePermanently(), planHandlers.archived([archivedTrip]));

    await user.click(confirm);

    await waitFor(() =>
      expect(requests.some((request) => request.method === "DELETE" && request.url.endsWith("/plan/8/permanent"))).toBe(true),
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(screen.queryByText("Old home")).toBeNull());
    expect(screen.getByText("Trip to Lisbon")).toBeTruthy();
    expect(toast.success).toHaveBeenCalledWith("Plan deleted.");
  });

  it("sends nothing when the dialog is cancelled (PDEL-04 AC 1)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(planHandlers.list([personal]), planHandlers.archived([archivedOldHome]));
    renderSection();
    await openDeleteDialog(user);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(requests.some((request) => request.method === "DELETE")).toBe(false);
  });

  it("tells that the plan is no longer archived when the API answers 409, and refreshes the lists (PDEL-05 AC 4)", async () => {
    const user = userEvent.setup();
    server.use(planHandlers.list([personal]), planHandlers.archived([archivedOldHome, archivedTrip]));
    renderSection();
    await openDeleteDialog(user);
    await user.type(screen.getByLabelText('Type "Old home" to confirm'), "Old home");
    // The plan was restored elsewhere meanwhile, so the refreshed lists no longer hold it as archived.
    server.use(
      planHandlers.deletePermanentlyConflict(),
      planHandlers.list([personal, oldHome]),
      planHandlers.archived([archivedTrip]),
    );

    await user.click(screen.getByRole("button", { name: "Delete now" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("This plan is no longer archived.", expect.anything()));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.queryByText("Old home")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
