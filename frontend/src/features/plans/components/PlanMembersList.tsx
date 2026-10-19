import { PlanMember, PlanRole } from "@/api/dtos";
import {
  useGetPlanMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/api/services/usePlanService";
import { useAuth } from "@/app/providers/useAuth";
import { useConfirm } from "@/components/dialog/useConfirm";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { PlanMembersListView } from "./PlanMembersListView";

type PlanMembersListProps = {
  planId: number;
};

export function PlanMembersList({ planId }: PlanMembersListProps) {
  const { data: members = [], isLoading } = useGetPlanMembers(planId);
  const { user } = useAuth();
  const confirm = useConfirm();
  const { mutate: updateMemberRole } = useUpdateMemberRole();
  const { mutate: removeMember } = useRemoveMember();

  const { canManagePlan } = usePlanPermissions();
  const ownerCount = members.filter((m) => m.role === "OWNER").length;

  function canManage(member: PlanMember) {
    if (!canManagePlan) return false;
    if (member.userId === user?.id) return false;
    if (member.role === "OWNER" && ownerCount <= 1) return false;
    return true;
  }

  function handleRoleChange(member: PlanMember, role: PlanRole) {
    if (role === member.role) return;
    updateMemberRole({
      params: { planId, userId: member.userId },
      body: { role },
    });
  }

  async function handleRemove(member: PlanMember) {
    const confirmed = await confirm({
      title: "Remove member",
      description: `Are you sure you want to remove ${member.name} from this plan?`,
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      removeMember({ params: { planId, userId: member.userId } });
    }
  }

  return (
    <PlanMembersListView
      members={members}
      isLoading={isLoading}
      canManageMember={canManage}
      onRoleChange={handleRoleChange}
      onRemove={handleRemove}
    />
  );
}
