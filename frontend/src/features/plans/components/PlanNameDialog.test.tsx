import type { Plan } from "@/api/dtos";
import { planHandlers } from "@/api/services/plan.handlers";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlanNameDialog } from "./PlanNameDialog";

const home: Plan = { id: 7, name: "Home", isDefault: false, myRole: "OWNER", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true } };
const homeResponse: Plan = { id: 7, name: "Household", isDefault: false, myRole: "OWNER", permissions: { createTransactions: true, attributeToOthers: true, manageCategories: true, managePlan: true } };

async function sentBody(requests: Request[], method: string) {
  await waitFor(() => expect(requests.some((request) => request.method === method)).toBe(true));
  return requests.find((request) => request.method === method);
}

afterEach(cleanup);

describe("PlanNameDialog", () => {
  it("creates a plan with the typed name and hands it back (STD-06 AC 10)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const onOpenChange = vi.fn();
    server.use(planHandlers.create(homeResponse));
    renderWithProviders(
      <PlanNameDialog mode="create" open onOpenChange={onOpenChange} onSuccess={onSuccess} />,
    );

    expect(screen.getByRole("dialog", { name: "New plan" })).toBeTruthy();
    await user.type(screen.getByLabelText("Name"), "Household");
    await user.click(screen.getByRole("button", { name: "Create" }));

    const request = await sentBody(requests, "POST");
    expect(request?.url).toMatch(/\/plan$/);
    expect(await request?.json()).toEqual({ name: "Household" });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ id: 7, name: "Household", isDefault: false }),
    );
  });

  it("renames the given plan, starting from its current name (STD-06 AC 10)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onOpenChange = vi.fn();
    server.use(planHandlers.rename(homeResponse));
    renderWithProviders(<PlanNameDialog mode="rename" plan={home} open onOpenChange={onOpenChange} />);

    expect(screen.getByRole("dialog", { name: "Rename plan" })).toBeTruthy();
    const name = screen.getByLabelText<HTMLInputElement>("Name");
    expect(name.value).toBe("Home");
    await user.clear(name);
    await user.type(name, "Household");
    await user.click(screen.getByRole("button", { name: "Save" }));

    const request = await sentBody(requests, "PUT");
    expect(request?.url).toMatch(/\/plan\/7$/);
    expect(await request?.json()).toEqual({ name: "Household" });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("closes on Cancel without sending anything (STD-06 AC 10)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onOpenChange = vi.fn();
    renderWithProviders(<PlanNameDialog mode="create" open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText("Name"), "Household");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(requests).toEqual([]);
  });

  it("stays open with the typed name when creating fails, locked while it runs (STD-06 AC 10)", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    const onSuccess = vi.fn();
    const onOpenChange = vi.fn();
    let fail: (() => void) | undefined;
    const release = new Promise<void>((settle) => {
      fail = settle;
    });
    server.use(planHandlers.createNetworkError(release));
    renderWithProviders(
      <PlanNameDialog mode="create" open onOpenChange={onOpenChange} onSuccess={onSuccess} />,
    );

    await user.type(screen.getByLabelText("Name"), "Household");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await sentBody(requests, "POST");
    const cancel = screen.getByRole<HTMLButtonElement>("button", { name: "Cancel" });
    await waitFor(() => expect(cancel.disabled).toBe(true));
    fail?.();
    await waitFor(() => expect(cancel.disabled).toBe(false));
    expect(screen.getByRole("dialog", { name: "New plan" })).toBeTruthy();
    expect(screen.getByLabelText<HTMLInputElement>("Name").value).toBe("Household");
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
