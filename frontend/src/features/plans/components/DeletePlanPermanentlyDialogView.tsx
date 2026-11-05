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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
            <DialogTitle>{t("plans.deletePlanPermanentlyDialogView.deletePlanNow")}</DialogTitle>
            <DialogDescription>
              {t("plans.deletePlanPermanentlyDialogView.thisPermanentlyDeletesThePlan")}
            </DialogDescription>
          </DialogHeader>

          <FormField
            control={control}
            name="confirmation"
            label={t("plans.deletePlanPermanentlyDialogView.typeToConfirm", { name: planName })}
          >
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
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              isLoading={isSubmitting}
              disabled={!matchesPlanName(confirmation, planName)}
            >
              <Trash2Icon className="h-4 w-4" />
              {t("plans.deletePlanPermanentlyDialogView.deleteNow")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
