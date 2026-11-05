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
import { CurrencyInput } from "@/components/input/CurrencyInput";
import { DatePicker } from "@/components/input/DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  confirmTransactionSchema,
  type ConfirmTransactionFormOutput,
  type ConfirmTransactionFormValues,
} from "./confirmTransactionForm";

type ConfirmTransactionDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: ConfirmTransactionFormValues;
  description: string;
  isSaving: boolean;
  onConfirm: (values: ConfirmTransactionFormOutput) => void;
};

export function ConfirmTransactionDialogView({
  open,
  onOpenChange,
  initialValues,
  description,
  isSaving,
  onConfirm,
}: ConfirmTransactionDialogViewProps) {
  const { t } = useTranslation();

  const { control, handleSubmit, reset } = useForm<
    ConfirmTransactionFormValues,
    unknown,
    ConfirmTransactionFormOutput
  >({
    resolver: zodResolver(confirmTransactionSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("transactions.confirmTransactionDialogView.confirmTransaction")}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <FormField control={control} name="amount" label={t("common.amount")}>
          {(field) => (
            <CurrencyInput
              {...field}
              onValueChange={field.onChange}
              placeholder={t("common.r000")}
              disabled={isSaving}
            />
          )}
        </FormField>

        <FormField
          control={control}
          name="date"
          label={t("transactions.transactionFormDrawer.date")}
        >
          {(field) => (
            <DatePicker
              id={field.id}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value}
              // Clearing the text keeps the last date: a confirmed transaction always has one.
              onChange={(date) => date && field.onChange(date)}
              disabled={isSaving}
              className="w-full"
            />
          )}
        </FormField>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
            {t("common.cancel")}
          </Button>
          <Button type="button" isLoading={isSaving} onClick={handleSubmit(onConfirm)}>
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
