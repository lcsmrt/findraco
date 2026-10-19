import { cleanup, waitFor } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Plan, PlanMember } from "@/api/dtos";
import { planHandlers } from "@/api/services/plan.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { useOverviewMemberFilter } from "./useOverviewMemberFilter";

const PLAN_ID = 5;
const ana: PlanMember = { userId: 7, name: "Ana", email: "ana@x.com", role: "OWNER" };
const bruno: PlanMember = { userId: 8, name: "Bruno", email: "bruno@x.com", role: "EDITOR" };

function planValue(): PlanContextValue {
  const plan: Plan = { id: PLAN_ID, name: "Home", isDefault: true, myRole: "OWNER" };
  return {
    activePlanId: PLAN_ID,
    setActivePlanId: vi.fn(),
    activePlan: plan,
    plans: [plan],
    isLoading: false,
  };
}

function setup(url: string, members: PlanMember[]) {
  server.use(planHandlers.members(members));
  const requests = recordRequests();
  const hook = renderHookWithProviders(
    () => ({ filter: useOverviewMemberFilter(), location: useLocation() }),
    { route: url, plan: planValue() },
  );
  return { ...hook, requests };
}

function params(location: { search: string }) {
  return Object.fromEntries(new URLSearchParams(location.search));
}

afterEach(() => {
  cleanup();
});

describe("useOverviewMemberFilter", () => {
  it("applies the member filter and shows the picker on a multi-member plan", async () => {
    const { result, requests } = setup("/?plan=5&overviewMember=7", [ana, bruno]);

    await waitFor(() => expect(result.current.filter.showMemberPicker).toBe(true));
    expect(result.current.filter.selectedMember).toEqual({ id: 7, name: "Ana" });
    expect(result.current.filter.effectiveMemberId).toBe(7);
    expect(params(result.current.location)).toEqual({ plan: "5", overviewMember: "7" });
    expect(requests.map((request) => new URL(request.url).pathname)).toEqual([
      "/api/findraco/plan/5/members",
    ]);
  });

  it("hides the picker and ignores a saved member on a single-member plan", async () => {
    const { result } = setup("/?plan=5&overviewMember=7", [ana]);

    await waitFor(() => expect(result.current.filter.memberOptions).toHaveLength(1));
    expect(result.current.filter.showMemberPicker).toBe(false);
    expect(result.current.filter.effectiveMemberId).toBeNull();
  });

  it("drops a member who is no longer in the plan from the URL", async () => {
    const { result } = setup("/?plan=5&period=last-3m&overviewMember=99", [ana, bruno]);

    await waitFor(() =>
      expect(params(result.current.location)).toEqual({ plan: "5", period: "last-3m" }),
    );
    expect(result.current.filter.effectiveMemberId).toBeNull();
    expect(result.current.filter.selectedMember).toBeNull();
  });
});
