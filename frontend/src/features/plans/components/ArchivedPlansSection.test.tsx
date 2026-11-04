import type { ArchivedPlan, Plan } from "@/api/dtos";
import { planHandlers } from "@/api/services/plan.handlers";
import { PlanProvider } from "@/app/providers/PlanProvider";
import type { AuthContextValue } from "@/app/providers/useAuth";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
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

const auth: AuthContextValue = {
  user: { id: 1, name: "Ana", email: "ana@example.com", timeZone: "UTC", timeZoneMode: "AUTOMATIC" },
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
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ArchivedPlansSection", () => {
  it("shows no Archived plans heading when the user owns no archived plan (PDEL-01 AC 2)", async () => {
    const requests = recordRequests();
    server.use(planHandlers.list([personal]), planHandlers.archived([]));

    renderSection();

    await waitFor(() => expect(requests.some((request) => request.url.endsWith("/plan/archived"))).toBe(true));
    expect(await screen.findByRole("button", { name: /Personal/ })).toBeTruthy();
    await waitFor(() => expect(screen.queryByText("Archived plans")).toBeNull());
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
});
