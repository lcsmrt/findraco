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
import { type PlanNameFormOutput, type PlanNameFormValues, planNameSchema } from "./planNameForm";
import { useTranslation } from "react-i18next";

type PlanNameDialogMode = "create" | "rename";

const TITLE_KEYS = {
  create: "plans.planNameDialogView.newPlan",
  rename: "plans.planNameDialogView.renamePlan",
} as const;

const SUBMIT_LABEL_KEYS = {
  create: "common.create",
  rename: "common.save",
} as const;

type PlanNameDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: PlanNameDialogMode;
  /** The name the form starts from (and returns to whenever the dialog opens). */
  initialName: string;
  isSubmitting: boolean;
  onSubmit: (values: PlanNameFormOutput) => void;
};

/** Names a plan: a new one (`create`) or an existing one (`rename`). */
export function PlanNameDialogView({
  open,
  onOpenChange,
  mode,
  initialName,
  isSubmitting,
  onSubmit,
}: PlanNameDialogViewProps) {
  const { t } = useTranslation();

  const { control, handleSubmit, reset } = useForm<PlanNameFormValues, unknown, PlanNameFormOutput>(
    {
      resolver: zodResolver(planNameSchema),
      defaultValues: { name: initialName },
    },
  );

  useEffect(() => {
    reset({ name: initialName });
  }, [open, initialName, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{t(TITLE_KEYS[mode])}</DialogTitle>
          </DialogHeader>

          <FormField control={control} name="name" label={t("common.name")}>
            {(field) => (
              <Input
                {...field}
                placeholder={t("plans.planNameDialogView.eGHouseholdFinances")}
                disabled={isSubmitting}
              />
            )}
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
            <Button type="submit" isLoading={isSubmitting}>
              <SaveIcon className="h-4 w-4" />
              {t(SUBMIT_LABEL_KEYS[mode])}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
