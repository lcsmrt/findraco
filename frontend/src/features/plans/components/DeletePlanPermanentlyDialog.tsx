import type { ArchivedPlan } from "@/api/dtos";
import { useDeletePlanPermanently } from "@/api/services/usePlanService";
import { DeletePlanPermanentlyDialogView } from "./DeletePlanPermanentlyDialogView";

type DeletePlanPermanentlyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: ArchivedPlan;
};

/** Deletes an archived plan for good, after the owner types its name. */
export function DeletePlanPermanentlyDialog({
  open,
  onOpenChange,
  plan,
}: DeletePlanPermanentlyDialogProps) {
  const { mutate, isPending } = useDeletePlanPermanently({
    onSuccess: () => onOpenChange(false),
  });

  return (
    <DeletePlanPermanentlyDialogView
      open={open}
      onOpenChange={onOpenChange}
      planName={plan.name}
      isSubmitting={isPending}
      onSubmit={() => mutate(plan.id)}
    />
  );
}
