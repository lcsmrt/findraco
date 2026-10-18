import { useGetPlanMembers } from "@/api/services/usePlanService";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { memberColor, type MemberColorOf } from "@/utils/memberColors";
import { useCallback, useMemo } from "react";

/** Colour lookup for the active plan's members. */
export function useMemberColors(): MemberColorOf {
  const { activePlanId } = usePlanContext();
  const { data: members } = useGetPlanMembers(activePlanId ?? undefined);
  // A fresh `[]` on every render would give the lookup a new identity while members load.
  const stable = useMemo(() => members ?? [], [members]);
  return useCallback((userId: number) => memberColor(stable, userId), [stable]);
}
