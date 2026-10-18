import type { Plan, PlanResponse } from "@/api/dtos";
import { planHandlers } from "@/api/services/plan.handlers";
import { recordRequests } from "@/test/recordRequests";
import { renderWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlanNameDialog } from "./PlanNameDialog";

const home: Plan = { id: 7, name: "Home", isDefault: false, myRole: "OWNER" };
const homeResponse: PlanResponse = { id: 7, name: "Household", default: false, myRole: "OWNER" };

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

  it("asks for a name instead of sending an empty one", async () => {
    const user = userEvent.setup();
    const requests = recordRequests();
    renderWithProviders(<PlanNameDialog mode="create" open onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("Enter a name for the plan")).toBeTruthy();
    expect(requests).toEqual([]);
  });
});
