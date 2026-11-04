import { Button } from "@/components/button/base/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  type DeletePlanPermanentlyFormOutput,
  type DeletePlanPermanentlyFormValues,
  deletePlanPermanentlySchema,
  matchesPlanName,
} from "./deletePlanPermanentlyForm";

type DeletePlanPermanentlyDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  isSubmitting: boolean;
  onSubmit: () => void;
};

/** Confirms an irreversible deletion: the button stays disabled until the plan's name is typed exactly. */
export function DeletePlanPermanentlyDialogView({
  open,
  onOpenChange,
  planName,
  isSubmitting,
  onSubmit,
}: DeletePlanPermanentlyDialogViewProps) {
  const { control, handleSubmit, reset } = useForm<
    DeletePlanPermanentlyFormValues,
    unknown,
    DeletePlanPermanentlyFormOutput
  >({
    resolver: zodResolver(deletePlanPermanentlySchema(planName)),
    defaultValues: { confirmation: "" },
  });
  const confirmation = useWatch({ control, name: "confirmation" });

  useEffect(() => {
    reset({ confirmation: "" });
  }, [open, planName, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(() => onSubmit())} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Delete plan now</DialogTitle>
            <DialogDescription>
              This permanently deletes the plan and everything in it: transactions, categories,
              recurring series, members and invitations. It cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <FormField control={control} name="confirmation" label={`Type "${planName}" to confirm`}>
            {(field) => <Input {...field} autoComplete="off" disabled={isSubmitting} />}
          </FormField>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              <XIcon className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              isLoading={isSubmitting}
              disabled={!matchesPlanName(confirmation, planName)}
            >
              <Trash2Icon className="h-4 w-4" />
              Delete now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
