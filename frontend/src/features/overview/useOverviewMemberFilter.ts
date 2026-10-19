import { useGetPlanMembers } from "@/api/services/usePlanService";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { useEffect, useMemo } from "react";
import { useOverviewFilters } from "./filters/useOverviewFilters";

// StandardCombobox requires an `id`; PlanMember keys on `userId`, so members are adapted to this shape.
export type MemberOption = { id: number; name: string };

/**
 * Overview member filter rules: the picker shows only on multi-member plans, a
 * single-member plan ignores the saved member, and a member no longer in the plan
 * is dropped from the URL.
 */
export function useOverviewMemberFilter() {
  const { overview, updateOverview } = useOverviewFilters();
  const { memberId } = overview;

  const { activePlanId } = usePlanContext();
  const { data: members = [], isSuccess: membersLoaded } = useGetPlanMembers(
    activePlanId ?? undefined,
  );
  const memberOptions = useMemo<MemberOption[]>(
    () => members.map((m) => ({ id: m.userId, name: m.name })),
    [members],
  );
  const showMemberPicker = memberOptions.length > 1;
  const selectedMember =
    memberOptions.find((m) => m.id === memberId) ?? null;
  const isMemberStale = membersLoaded && memberId != null && !selectedMember;
  // The member filter is ignored on single-member plans; until members load it is
  // applied as-is so the dashboard is not fetched twice for the common case.
  const effectiveMemberId =
    memberId != null && (!membersLoaded || showMemberPicker) && !isMemberStale
      ? memberId
      : null;

  useEffect(() => {
    if (isMemberStale) updateOverview((o) => ({ ...o, memberId: null }));
  }, [isMemberStale, updateOverview]);

  return { memberOptions, showMemberPicker, selectedMember, effectiveMemberId };
}
