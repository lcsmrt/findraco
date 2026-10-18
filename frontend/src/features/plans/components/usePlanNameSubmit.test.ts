import type { Plan, PlanResponse } from "@/api/dtos";
import { planHandlers } from "@/api/services/plan.handlers";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePlanNameSubmit } from "./usePlanNameSubmit";

const home: Plan = { id: 7, name: "Home", isDefault: false, myRole: "OWNER" };
const household: PlanResponse = {
  id: 7,
  name: "Household",
  default: false,
  myRole: "OWNER",
};

function sent(requests: Request[]) {
  return requests.map((request) => [
    request.method,
    new URL(request.url).pathname,
  ]);
}

describe("usePlanNameSubmit", () => {
  it("creates a plan, hands the new plan back and finishes (STD-06 AC 10)", async () => {
    server.use(planHandlers.create(household));
    const requests = recordRequests();
    const onCreated = vi.fn();
    const onDone = vi.fn();
    const { result } = renderHookWithProviders(() =>
      usePlanNameSubmit({ mode: "create", onCreated, onDone }),
    );

    act(() => result.current.submit({ name: "Household" }));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(sent(requests)).toEqual([["POST", "/api/findraco/plan"]]);
    expect(await requests[0].json()).toEqual({ name: "Household" });
    expect(onCreated).toHaveBeenCalledWith({
      id: 7,
      name: "Household",
      isDefault: false,
      myRole: "OWNER",
    });
  });

  it("renames the given plan and finishes (STD-06 AC 10)", async () => {
    server.use(planHandlers.rename(household));
    const requests = recordRequests();
    const onDone = vi.fn();
    const { result } = renderHookWithProviders(() =>
      usePlanNameSubmit({ mode: "rename", plan: home, onDone }),
    );

    act(() => result.current.submit({ name: "Household" }));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(sent(requests)).toEqual([["PUT", "/api/findraco/plan/7"]]);
    expect(await requests[0].json()).toEqual({ name: "Household" });
  });

  it("stays open when the request fails, and reports submitting while it runs", async () => {
    let fail: () => void = () => {};
    const release = new Promise<void>((settle) => {
      fail = settle;
    });
    server.use(planHandlers.createNetworkError(release));
    const requests = recordRequests();
    const onCreated = vi.fn();
    const onDone = vi.fn();
    const { result } = renderHookWithProviders(() =>
      usePlanNameSubmit({ mode: "create", onCreated, onDone }),
    );

    act(() => result.current.submit({ name: "Household" }));

    await waitFor(() => expect(result.current.isSubmitting).toBe(true));
    expect(sent(requests)).toEqual([["POST", "/api/findraco/plan"]]);
    fail();
    await waitFor(() => expect(result.current.isSubmitting).toBe(false));
    expect(onDone).not.toHaveBeenCalled();
    expect(onCreated).not.toHaveBeenCalled();
  });
});
