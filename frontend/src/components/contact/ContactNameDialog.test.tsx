import type { Contact } from "@/api/dtos";
import { contactHandlers } from "@/api/services/contact.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactNameDialog } from "./ContactNameDialog";

const plan: PlanContextValue = { activePlanId: 5, setActivePlanId: vi.fn(), plans: [], isLoading: false };
const mae: Contact = { id: 7, name: "Mãe", archived: false, owed: 0, credit: 0, version: 3 };

afterEach(cleanup);

describe("ContactNameDialog", () => {
  it("renames the contact from its current name, sending the version it was read at", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onOpenChange = vi.fn();
    server.use(contactHandlers.rename({ ...mae, name: "Mamãe", version: 4 }));
    renderWithProviders(<ContactNameDialog mode="rename" contact={mae} open onOpenChange={onOpenChange} />, { plan });

    const name = screen.getByLabelText<HTMLInputElement>("Name");
    expect(name.value).toBe("Mãe");
    await user.clear(name);
    await user.type(name, "Mamãe");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(requests.some((request) => request.method === "PUT")).toBe(true));
    const put = requests.find((request) => request.method === "PUT");
    expect(put && new URL(put.url).pathname).toBe("/api/findraco/plan/5/contacts/7");
    expect(await put?.json()).toEqual({ name: "Mamãe", version: 3 });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("closes on Cancel without sending anything", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onOpenChange = vi.fn();
    renderWithProviders(<ContactNameDialog mode="create" open onOpenChange={onOpenChange} />, { plan });

    await user.type(screen.getByLabelText("Name"), "Mãe");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(requests).toEqual([]);
  });

  it("sends nothing for an empty name and shows why", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    renderWithProviders(<ContactNameDialog mode="create" open onOpenChange={vi.fn()} />, { plan });

    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("Enter a name")).toBeTruthy();
    expect(requests).toEqual([]);
  });
});
