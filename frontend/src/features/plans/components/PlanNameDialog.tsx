import type { Plan } from "@/api/dtos";
import { PlanNameDialogView } from "./PlanNameDialogView";
import { usePlanNameSubmit } from "./usePlanNameSubmit";

type PlanNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & (
  | { mode: "create"; onSuccess?: (plan: Plan) => void }
  | { mode: "rename"; plan: Plan }
);

/** Names a plan: a new one (`create`) or the given one (`rename`). */
export function PlanNameDialog(props: PlanNameDialogProps) {
  const { open, onOpenChange, mode } = props;
  const initialName = props.mode === "rename" ? props.plan.name : "";

  const { submit, isSubmitting } = usePlanNameSubmit(
    props.mode === "rename"
      ? { mode: "rename", plan: props.plan, onDone: () => onOpenChange(false) }
      : {
          mode: "create",
          onCreated: props.onSuccess,
          onDone: () => onOpenChange(false),
        },
  );

  return (
    <PlanNameDialogView
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      initialName={initialName}
      isSubmitting={isSubmitting}
      onSubmit={submit}
    />
  );
}
