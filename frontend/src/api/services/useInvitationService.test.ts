import { waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Invitation } from "@/api/dtos";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { invitationHandlers } from "./invitation.handlers";
import { useAcceptInvitation, useCreateInvitation, useRevokeInvitation } from "./useInvitationService";

const invitation: Invitation = {
  id: 2,
  token: "link-token",
  role: "VIEWER",
  type: "LINK",
  status: "PENDING",
};

// The toast is the user-visible outcome of a mutation; sonner is a third-party module.
beforeEach(() => {
  vi.spyOn(toast, "success");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("invitation mutations show their short success message", () => {
  it(`create shows "Invitation created." (NAV-05 AC 1, 2)`, async () => {
    server.use(invitationHandlers.create(invitation));

    const { result } = renderHookWithProviders(() => useCreateInvitation());
    result.current.mutate({ params: { planId: 7 }, body: { role: "VIEWER", type: "LINK" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Invitation created.");
  });

  it(`revoke shows "Invitation revoked." (NAV-05 AC 1, 2)`, async () => {
    server.use(invitationHandlers.revoke());

    const { result } = renderHookWithProviders(() => useRevokeInvitation());
    result.current.mutate({ params: { planId: 7, invitationId: 2 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Invitation revoked.");
  });

  it(`accept shows "You joined the plan." (NAV-05 AC 1, 2)`, async () => {
    server.use(invitationHandlers.accept({ planId: 7, role: "VIEWER" }));

    const { result } = renderHookWithProviders(() => useAcceptInvitation());
    result.current.mutate("link-token");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("You joined the plan.");
  });
});
