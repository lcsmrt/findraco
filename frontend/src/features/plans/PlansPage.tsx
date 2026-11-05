import { useDeletePlan, useLeavePlan } from "@/api/services/usePlanService";
import { useConfirm } from "@/components/dialog/useConfirm";
import { useState } from "react";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { PlanNameDialog } from "./components/PlanNameDialog";
import { InvitePlanDialog } from "./components/InvitePlanDialog";
import { ArchivedPlansSection } from "./components/ArchivedPlansSection";
import { PlanInvitationsList } from "./components/PlanInvitationsList";
import { PlanMembersList } from "./components/PlanMembersList";
import { TransferOwnershipDialog } from "./components/TransferOwnershipDialog";
import { PlansPageView } from "./PlansPageView";
import { useTranslation } from "react-i18next";

export function PlansPage() {
  const { t } = useTranslation();

  const { plans, activePlan, activePlanId, setActivePlanId, isLoading } =
    usePlanContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const confirm = useConfirm();
  const { mutate: deletePlan, isPending: isDeletingPlan } = useDeletePlan();
  const { mutate: leavePlan, isPending: isLeavingPlan } = useLeavePlan();

  const { canManagePlan } = usePlanPermissions();

  async function handleArchivePlan() {
    if (!activePlan) return;
    const confirmed = await confirm({
      title: t("plans.plansPage.archivePlan"),
      description: t("plans.plansPage.archiveDescription", { name: activePlan.name }),
      confirmLabel: t("plans.plansPage.archive"),
      cancelLabel: t("common.cancel"),
      variant: "destructive",
    });
    if (confirmed) {
      deletePlan(activePlan.id);
    }
  }

  async function handleLeavePlan() {
    if (!activePlan) return;
    const confirmed = await confirm({
      title: t("plans.plansPage.leavePlan"),
      description: t("plans.plansPage.leaveDescription", { name: activePlan.name }),
      confirmLabel: t("plans.plansPage.leave"),
      cancelLabel: t("common.cancel"),
      variant: "destructive",
    });
    if (confirmed) {
      leavePlan(activePlan.id);
    }
  }

  return (
    <>
      <PlansPageView
        plans={plans}
        activePlan={activePlan}
        activePlanId={activePlanId}
        isLoading={isLoading}
        canManagePlan={canManagePlan}
        isArchiving={isDeletingPlan}
        isLeaving={isLeavingPlan}
        onCreatePlan={() => setIsCreateOpen(true)}
        onSelectPlan={setActivePlanId}
        onRename={() => setIsRenameOpen(true)}
        onTransferOwnership={() => setIsTransferOpen(true)}
        onArchive={handleArchivePlan}
        onInvite={() => setIsInviteOpen(true)}
        onLeave={handleLeavePlan}
        membersList={activePlan && <PlanMembersList planId={activePlan.id} />}
        invitationsList={activePlan && <PlanInvitationsList planId={activePlan.id} />}
        archivedPlans={<ArchivedPlansSection />}
      />

      <PlanNameDialog
        mode="create"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(plan) => setActivePlanId(plan.id)}
      />

      {activePlan && (
        <InvitePlanDialog
          open={isInviteOpen}
          onOpenChange={setIsInviteOpen}
          planId={activePlan.id}
        />
      )}

      {activePlan && (
        <PlanNameDialog
          mode="rename"
          open={isRenameOpen}
          onOpenChange={setIsRenameOpen}
          plan={activePlan}
        />
      )}

      {activePlan && (
        <TransferOwnershipDialog
          open={isTransferOpen}
          onOpenChange={setIsTransferOpen}
          planId={activePlan.id}
        />
      )}
    </>
  );
}
