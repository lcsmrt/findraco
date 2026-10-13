import type { PlanMember } from "@/api/dtos";
import { useGetPlanMembers } from "@/api/services/usePlanService";
import { usePlanContext } from "@/app/providers/PlanProvider";
import { useCallback, useMemo } from "react";

/** Member identity colours (UX-04 AC 2), defined per theme in `index.css`. */
export const MEMBER_PALETTE = [
  "var(--member-1)",
  "var(--member-2)",
  "var(--member-3)",
  "var(--member-4)",
  "var(--member-5)",
  "var(--member-6)",
] as const;

/** Colour for someone who is not (or no longer) in the member list. */
export const NEUTRAL_MEMBER_COLOR = "var(--muted-foreground)";

type MemberRef = Pick<PlanMember, "userId">;

/**
 * Palette slot of a member: their position in the plan's members ordered by user id,
 * modulo the palette size; -1 when the user is not a member.
 */
export const memberColorIndex = (members: MemberRef[], userId: number): number => {
  const position = members
    .map((member) => member.userId)
    .sort((a, b) => a - b)
    .indexOf(userId);
  return position === -1 ? -1 : position % MEMBER_PALETTE.length;
};

/** CSS colour of a member, or the neutral colour for an unknown user. */
export const memberColor = (members: MemberRef[], userId: number): string => {
  const index = memberColorIndex(members, userId);
  return index === -1 ? NEUTRAL_MEMBER_COLOR : MEMBER_PALETTE[index];
};

export type MemberColorOf = (userId: number) => string;

/** Colour lookup for the active plan's members. */
export const useMemberColors = (): MemberColorOf => {
  const { activePlanId } = usePlanContext();
  const { data: members } = useGetPlanMembers(activePlanId ?? undefined);
  const stable = useMemo(() => members ?? [], [members]);
  return useCallback((userId: number) => memberColor(stable, userId), [stable]);
};
