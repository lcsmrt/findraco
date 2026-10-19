import { waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PlanMember } from "@/api/dtos";
import { planHandlers } from "@/api/services/plan.handlers";
import type { PlanContextValue } from "@/app/providers/usePlanContext";
import { recordRequests } from "@/test/recordRequests";
import { renderHookWithProviders } from "@/test/renderWithProviders";
import { server } from "@/test/server";
import { NEUTRAL_MEMBER_COLOR } from "@/utils/memberColors";
import { useMemberColors } from "./useMemberColors";

function planContext(activePlanId: number | null): PlanContextValue {
  return { activePlanId, setActivePlanId: () => {}, plans: [], isLoading: false };
}

const members: PlanMember[] = [
  { userId: 7, name: "Livia", email: "livia@example.com", role: "EDITOR" },
  { userId: 3, name: "Lucas", email: "lucas@example.com", role: "OWNER" },
];

describe("useMemberColors", () => {
  it("colours the active plan's members by their order of user id", async () => {
    server.use(planHandlers.members(members));
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useMemberColors(), { plan: planContext(5) });

    await waitFor(() => expect(result.current(3)).toBe("var(--member-1)"));
    expect(result.current(7)).toBe("var(--member-2)");
    expect(new URL(requests[0].url).pathname).toBe("/api/findraco/plan/5/members");
  });

  it("gives an unknown user the neutral colour", async () => {
    server.use(planHandlers.members(members));

    const { result } = renderHookWithProviders(() => useMemberColors(), { plan: planContext(5) });

    await waitFor(() => expect(result.current(3)).toBe("var(--member-1)"));
    expect(result.current(99)).toBe(NEUTRAL_MEMBER_COLOR);
  });

  it("keeps the same lookup across re-renders while members load", () => {
    server.use(planHandlers.members(members));

    const { result, rerender } = renderHookWithProviders(() => useMemberColors(), { plan: planContext(5) });
    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
    expect(first(3)).toBe(NEUTRAL_MEMBER_COLOR);
  });

  it("asks nothing and colours everyone neutral without an active plan", () => {
    const requests = recordRequests();

    const { result } = renderHookWithProviders(() => useMemberColors(), { plan: planContext(null) });

    expect(result.current(3)).toBe(NEUTRAL_MEMBER_COLOR);
    expect(requests).toEqual([]);
  });
});
