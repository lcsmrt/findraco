import type { User } from "@/api/dtos";
import { authHandlers } from "@/api/services/auth.handlers";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TimeZoneDialog } from "./TimeZoneDialog";

const automatic: User = {
  id: 1,
  name: "Ana",
  email: "ana@example.com",
  timeZone: "America/Sao_Paulo",
  timeZoneMode: "AUTOMATIC",
};

afterEach(cleanup);

describe("TimeZoneDialog", () => {
  it("pins the chosen zone and closes (BST-11 AC 7)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const requests = recordRequests();
    server.use(
      authHandlers.me(automatic),
      authHandlers.updateTimeZone({
        ...automatic,
        timeZone: "Europe/Lisbon",
        timeZoneMode: "PINNED",
      }),
    );
    renderWithProviders(<TimeZoneDialog open onOpenChange={onOpenChange} />);

    await user.click(await screen.findByLabelText("Time zone source"));
    await user.click(await screen.findByRole("option", { name: "Pinned" }));
    await user.click(screen.getByLabelText("Time zone", { selector: "button" }));
    await user.click(
      await screen.findByRole("option", { name: "Europe/Lisbon" }),
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    const patch = requests.find((request) => request.method === "PATCH");
    expect(new URL(patch?.url ?? "").pathname).toBe(
      "/api/findraco/user/me/time-zone",
    );
    expect(await patch?.json()).toEqual({
      mode: "PINNED",
      zone: "Europe/Lisbon",
    });
  });

  it("hands the zone back to the device without sending a zone (BST-11 AC 7)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const pinned: User = {
      ...automatic,
      timeZone: "Europe/Lisbon",
      timeZoneMode: "PINNED",
    };
    server.use(authHandlers.me(pinned), authHandlers.updateTimeZone(automatic));
    renderWithProviders(<TimeZoneDialog open onOpenChange={vi.fn()} />);

    await user.click(await screen.findByLabelText("Time zone source"));
    await user.click(
      await screen.findByRole("option", { name: "Automatic (this device)" }),
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(requests.some((request) => request.method === "PATCH")).toBe(true),
    );
    const patch = requests.find((request) => request.method === "PATCH");
    expect(await patch?.json()).toEqual({ mode: "AUTOMATIC" });
  });
});
