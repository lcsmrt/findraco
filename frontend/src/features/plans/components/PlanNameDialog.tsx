import type { Plan } from "@/api/dtos";
import { useCreatePlan, useRenamePlan } from "@/api/services/usePlanService";
import { Button } from "@/components/button/base/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type PlanNameFormValues, planNameSchema } from "./planNameForm";

type PlanNameDialogMode = "create" | "rename";

const TITLES: Record<PlanNameDialogMode, string> = {
  create: "New plan",
  rename: "Rename plan",
};

const SUBMIT_LABELS: Record<PlanNameDialogMode, string> = {
  create: "Create",
  rename: "Save",
};

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

  const { control, handleSubmit, reset } = useForm<PlanNameFormValues>({
    resolver: zodResolver(planNameSchema),
    defaultValues: { name: initialName },
  });

  useEffect(() => {
    reset({ name: initialName });
  }, [open, initialName, reset]);

  const { mutate: createPlan, isPending: isCreating } = useCreatePlan({
    onSuccess: (plan) => {
      if (props.mode === "create") props.onSuccess?.(plan);
      onOpenChange(false);
    },
  });
  const { mutate: renamePlan, isPending: isRenaming } = useRenamePlan({
    onSuccess: () => onOpenChange(false),
  });
  const isPending = isCreating || isRenaming;

  function submit({ name }: PlanNameFormValues) {
    if (props.mode === "rename") {
      renamePlan({ params: { planId: props.plan.id }, body: { name } });
      return;
    }
    createPlan({ body: { name } });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{TITLES[mode]}</DialogTitle>
          </DialogHeader>

          <FormField control={control} name="name" label="Name">
            {(field) => (
              <Input {...field} placeholder="e.g., Household finances" disabled={isPending} />
            )}
          </FormField>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              <XIcon className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              <SaveIcon className="h-4 w-4" />
              {SUBMIT_LABELS[mode]}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
