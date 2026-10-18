import type { Invitation } from "@/api/dtos";
import { invitationHandlers } from "@/api/services/invitation.handlers";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InvitePlanDialog } from "./InvitePlanDialog";

const PLAN_ID = 7;

const emailInvitation: Invitation = {
  id: 1,
  token: "invite-token",
  role: "VIEWER",
  type: "EMAIL",
  email: "ana@example.com",
  status: "PENDING",
};

const linkInvitation: Invitation = {
  id: 2,
  token: "link-token",
  role: "VIEWER",
  type: "LINK",
  status: "PENDING",
  expiresAt: "2026-12-31T18:00",
};

function renderDialog() {
  renderWithProviders(<InvitePlanDialog open onOpenChange={vi.fn()} planId={PLAN_ID} />);
}

async function sentInvitation(requests: Request[]) {
  await waitFor(() => expect(requests.some((request) => request.method === "POST")).toBe(true));
  return requests.find((request) => request.method === "POST");
}

afterEach(cleanup);

describe("InvitePlanDialog", () => {
  it("sends an email invitation to the typed address (STD-06 AC 9)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(invitationHandlers.create(emailInvitation));
    renderDialog();

    await user.type(screen.getByLabelText("Email"), "  ana@example.com ");
    await user.click(screen.getByRole("button", { name: "Send invitation" }));

    const request = await sentInvitation(requests);
    expect(request?.url).toMatch(/\/plan\/7\/invitation$/);
    expect(await request?.json()).toEqual({ role: "VIEWER", type: "EMAIL", email: "ana@example.com" });
    expect((await screen.findByText(/Invitation sent to/)).textContent).toBe(
      "Invitation sent to ana@example.com.",
    );
  });

  it("asks for an email address and sends nothing without one (STD-06 AC 9)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Send invitation" }));

    expect(await screen.findByText("Enter an email address")).toBeTruthy();
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe("true");
    expect(requests).toEqual([]);
  });

  it("generates a link invitation with the chosen expiry (STD-06 AC 9)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    server.use(invitationHandlers.create(linkInvitation));
    renderDialog();

    await user.click(screen.getAllByRole("combobox")[0]);
    await user.click(await screen.findByRole("option", { name: "Link" }));
    await user.type(screen.getByLabelText("Expires at (optional)"), "2026-12-31T18:00");
    await user.click(screen.getByRole("button", { name: "Generate link" }));

    const request = await sentInvitation(requests);
    expect(await request?.json()).toEqual({
      role: "VIEWER",
      type: "LINK",
      expiresAt: "2026-12-31T18:00",
    });
    expect(screen.getByDisplayValue(`${window.location.origin}/invitation/link-token`)).toBeTruthy();
  });
});
