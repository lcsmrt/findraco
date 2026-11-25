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
import { useTranslation } from "react-i18next";
import {
  contactNameSchema,
  type ContactNameFormOutput,
  type ContactNameFormValues,
} from "./contactNameForm";

export type ContactNameDialogMode = "create" | "rename";

const TITLE_KEYS = {
  create: "contacts.nameDialog.newContact",
  rename: "contacts.nameDialog.renameContact",
} as const;

const SUBMIT_LABEL_KEYS = {
  create: "common.create",
  rename: "common.save",
} as const;

type ContactNameDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ContactNameDialogMode;
  /** The name the form starts from (and returns to whenever the dialog opens). */
  initialName: string;
  isSubmitting: boolean;
  /** True when the API refused the name because another active contact has it. */
  isNameTaken: boolean;
  onSubmit: (values: ContactNameFormOutput) => void;
};

/** Names a contact: a new one (`create`) or an existing one (`rename`). */
export function ContactNameDialogView({
  open,
  onOpenChange,
  mode,
  initialName,
  isSubmitting,
  isNameTaken,
  onSubmit,
}: ContactNameDialogViewProps) {
  const { t } = useTranslation();

  const { control, handleSubmit, reset, setError } = useForm<ContactNameFormValues, unknown, ContactNameFormOutput>({
    resolver: zodResolver(contactNameSchema),
    defaultValues: { name: initialName },
  });

  useEffect(() => {
    reset({ name: initialName });
  }, [open, initialName, reset]);

  useEffect(() => {
    // The name is only known to be taken once the API has answered, so the error comes in after the submit.
    if (isNameTaken) setError("name", { type: "server", message: "problems.contact-name-taken" });
  }, [isNameTaken, setError]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{t(TITLE_KEYS[mode])}</DialogTitle>
          </DialogHeader>

          <FormField control={control} name="name" label={t("common.name")}>
            {(field) => (
              <Input {...field} placeholder={t("contacts.nameDialog.placeholder")} disabled={isSubmitting} />
            )}
          </FormField>

          <DialogFooter>
            <Button variant="outline" type="button" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
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
