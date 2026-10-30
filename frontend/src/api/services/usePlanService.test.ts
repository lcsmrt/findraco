import { waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Plan, PlanMember } from "@/api/dtos";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { planHandlers } from "./plan.handlers";
import {
  useCreatePlan,
  useDeletePlan,
  useGetPlan,
  useGetPlanMembers,
  useGetPlans,
  useLeavePlan,
  useRemoveMember,
  useRenamePlan,
  useTransferOwnership,
  useUpdateMemberRole,
} from "./usePlanService";

// The toast is the user-visible outcome of a mutation; sonner is a third-party module.
beforeEach(() => {
  vi.spyOn(toast, "success");
});

afterEach(() => {
  vi.restoreAllMocks();
});

const plan: Plan = { id: 5, name: "Home", isDefault: true, myRole: "OWNER" };

function sent(requests: Request[]) {
  return requests.map((request) => [request.method, new URL(request.url).pathname]);
}

describe("plan queries read the plan as the API sends it", () => {
  it("useGetPlans GETs /plan and returns the plans", async () => {
    server.use(
      planHandlers.list([plan, { id: 6, name: "Trip", isDefault: false, myRole: "VIEWER" }]),
    );
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetPlans());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(sent(requests)).toEqual([["GET", "/api/findraco/plan"]]);
    expect(result.current.data).toEqual([
      plan,
      { id: 6, name: "Trip", isDefault: false, myRole: "VIEWER" },
    ]);
  });

  it("useGetPlan GETs /plan/{id} and returns the plan", async () => {
    server.use(planHandlers.get(plan));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetPlan(5));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(sent(requests)).toEqual([["GET", "/api/findraco/plan/5"]]);
    expect(result.current.data).toEqual(plan);
  });
});

describe("useGetPlanMembers", () => {
  it("GETs /plan/{planId}/members and returns the members", async () => {
    const members: PlanMember[] = [{ userId: 9, name: "Bob", email: "bob@example.com", role: "EDITOR" }];
    server.use(planHandlers.members(members));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useGetPlanMembers(5));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(sent(requests)).toEqual([["GET", "/api/findraco/plan/5/members"]]);
    expect(result.current.data).toEqual(members);
  });
});

describe("useCreatePlan", () => {
  it(`POSTs the name to /plan, returns the plan, invalidates the plans query and shows "Plan created." (NAV-05 AC 1, 2)`, async () => {
    server.use(planHandlers.create({ ...plan, isDefault: false }));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useCreatePlan(), {
      seed: (client) => client.setQueryData(["plans"], []),
    });
    result.current.mutate({ body: { name: "Home" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Plan created.");
    expect(sent(requests)).toEqual([["POST", "/api/findraco/plan"]]);
    expect(await requests[0].json()).toEqual({ name: "Home" });
    expect(result.current.data).toEqual({ ...plan, isDefault: false });
    expect(queryClient.getQueryState(["plans"])?.isInvalidated).toBe(true);
  });
});

describe("useRenamePlan", () => {
  it(`PUTs to a plan-scoped URL, invalidates the plans query and shows "Plan renamed." on success (NAV-05 AC 1, 2)`, async () => {
    server.use(planHandlers.rename({ id: 5, name: "New name", isDefault: false, myRole: "OWNER" }));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useRenamePlan(), {
      seed: (client) => client.setQueryData(["plans"], [{ id: 5, name: "Old name" }]),
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    result.current.mutate({ params: { planId: 5 }, body: { name: "New name" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Plan renamed.");

    expect(sent(requests)).toEqual([["PUT", "/api/findraco/plan/5"]]);
    expect(await requests[0].json()).toEqual({ name: "New name" });
    expect(result.current.data).toEqual({ id: 5, name: "New name", isDefault: false, myRole: "OWNER" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["plans"] });
    expect(queryClient.getQueryState(["plans"])?.isInvalidated).toBe(true);
  });
});

describe("useUpdateMemberRole", () => {
  it(`PUTs to a plan- and member-scoped URL, invalidates planMembers and plans and shows "Role updated." on success (NAV-05 AC 1, 2)`, async () => {
    const member: PlanMember = { userId: 9, name: "Bob", email: "bob@example.com", role: "EDITOR" };
    server.use(planHandlers.updateMemberRole(member));
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useUpdateMemberRole(), {
      seed: (client) => {
        client.setQueryData(["members", 5], []);
        client.setQueryData(["plans"], []);
      },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    result.current.mutate({
      params: { planId: 5, userId: 9 },
      body: { role: "EDITOR" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Role updated.");

    expect(sent(requests)).toEqual([["PUT", "/api/findraco/plan/5/members/9"]]);
    expect(await requests[0].json()).toEqual({ role: "EDITOR" });
    expect(result.current.data).toEqual(member);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["members", 5],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["plans"] });
    expect(queryClient.getQueryState(["members", 5])?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(["plans"])?.isInvalidated).toBe(true);
  });
});

describe("membership and lifecycle mutations", () => {
  it(`useRemoveMember DELETEs /plan/{planId}/members/{userId}, invalidates members and plans and shows "Member removed." (NAV-05 AC 1, 2)`, async () => {
    server.use(planHandlers.removeMember());
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useRemoveMember(), {
      seed: (client) => {
        client.setQueryData(["members", 5], []);
        client.setQueryData(["plans"], []);
      },
    });
    result.current.mutate({ params: { planId: 5, userId: 9 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Member removed.");
    expect(sent(requests)).toEqual([["DELETE", "/api/findraco/plan/5/members/9"]]);
    expect(queryClient.getQueryState(["members", 5])?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(["plans"])?.isInvalidated).toBe(true);
  });

  it(`useDeletePlan DELETEs /plan/{planId}, invalidates plans and its members and shows "Plan archived." (NAV-05 AC 1, 2)`, async () => {
    server.use(planHandlers.delete());
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useDeletePlan(), {
      seed: (client) => {
        client.setQueryData(["members", 5], []);
        client.setQueryData(["plans"], []);
      },
    });
    result.current.mutate(5);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Plan archived.");
    expect(sent(requests)).toEqual([["DELETE", "/api/findraco/plan/5"]]);
    expect(queryClient.getQueryState(["members", 5])?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(["plans"])?.isInvalidated).toBe(true);
  });

  it(`useLeavePlan POSTs /plan/{planId}/leave with no body, invalidates plans and its members and shows "You left the plan." (NAV-05 AC 1, 2)`, async () => {
    server.use(planHandlers.leave());
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useLeavePlan(), {
      seed: (client) => {
        client.setQueryData(["members", 5], []);
        client.setQueryData(["plans"], []);
      },
    });
    result.current.mutate(5);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("You left the plan.");
    expect(sent(requests)).toEqual([["POST", "/api/findraco/plan/5/leave"]]);
    expect(await requests[0].text()).toBe("");
    expect(queryClient.getQueryState(["members", 5])?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(["plans"])?.isInvalidated).toBe(true);
  });

  it(`useTransferOwnership POSTs the new owner to /plan/{planId}/transfer, invalidates plans and members and shows "Ownership transferred." (NAV-05 AC 1, 2)`, async () => {
    server.use(planHandlers.transferOwnership());
    const requests = recordRequests();

    const { result, queryClient } = renderHookWithProviders(() => useTransferOwnership(), {
      seed: (client) => {
        client.setQueryData(["members", 5], []);
        client.setQueryData(["plans"], []);
      },
    });
    result.current.mutate({
      params: { planId: 5 },
      body: { newOwnerUserId: 9, previousOwnerRole: "EDITOR" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith("Ownership transferred.");
    expect(sent(requests)).toEqual([["POST", "/api/findraco/plan/5/transfer"]]);
    expect(await requests[0].json()).toEqual({ newOwnerUserId: 9, previousOwnerRole: "EDITOR" });
    expect(queryClient.getQueryState(["members", 5])?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(["plans"])?.isInvalidated).toBe(true);
  });
});

describe("plan mutations hand the result and the request to the caller's onSuccess", () => {
  it("useUpdateMemberRole", async () => {
    const member: PlanMember = { userId: 9, name: "Bob", email: "bob@example.com", role: "VIEWER" };
    server.use(planHandlers.updateMemberRole(member));
    const onSuccess = vi.fn();
    const request = { params: { planId: 5, userId: 9 }, body: { role: "VIEWER" as const } };

    const { result } = renderHookWithProviders(() => useUpdateMemberRole({ onSuccess }));
    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalledWith(member, request);
  });
});
