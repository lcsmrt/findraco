import { planHandlers } from "@/api/services/plan.handlers";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePlanNameSubmit } from "./usePlanNameSubmit";

function sent(requests: Request[]) {
  return requests.map((request) => [
    request.method,
    new URL(request.url).pathname,
  ]);
}

describe("usePlanNameSubmit", () => {
  it("stays open when the request fails, and reports submitting while it runs", async () => {
    let fail: (() => void) | undefined;
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
    fail?.();
    await waitFor(() => expect(result.current.isSubmitting).toBe(false));
    expect(onDone).not.toHaveBeenCalled();
    expect(onCreated).not.toHaveBeenCalled();
  });
});
