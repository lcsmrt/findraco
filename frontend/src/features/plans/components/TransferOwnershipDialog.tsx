import {
  useGetPlanMembers,
  useTransferOwnership,
} from "@/api/services/usePlanService";
import { TransferOwnershipDialogView } from "./TransferOwnershipDialogView";

type TransferOwnershipDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: number;
};

export function TransferOwnershipDialog({
  open,
  onOpenChange,
  planId,
}: TransferOwnershipDialogProps) {
  const { data: members = [], isLoading } = useGetPlanMembers(planId, {
    enabled: open,
  });

  const candidates = members.filter((member) => member.role !== "OWNER");

  const { mutate: transferOwnership, isPending } = useTransferOwnership({
    onSuccess: () => onOpenChange(false),
  });

  function handleTransfer(newOwnerUserId: number) {
    transferOwnership({
      params: { planId },
      body: { newOwnerUserId },
    });
  }

  return (
    <TransferOwnershipDialogView
      open={open}
      onOpenChange={onOpenChange}
      candidates={candidates}
      isLoading={isLoading}
      isTransferring={isPending}
      onTransfer={handleTransfer}
    />
  );
}
