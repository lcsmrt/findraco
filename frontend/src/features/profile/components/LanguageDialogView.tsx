import type { UserLanguage } from "@/api/dtos";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { Field, FieldLabel } from "@/components/input/base/Field";
import { RadioGroup, RadioGroupItem } from "@/components/input/base/RadioGroup";
import { useTranslation } from "react-i18next";

// Each language is named in itself, so a reader who cannot read the current one still finds theirs.
const LANGUAGE_OPTIONS: { value: UserLanguage; name: string }[] = [
  { value: "en", name: "English" },
  { value: "pt-BR", name: "Português (Brasil)" },
];

type LanguageDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The language in use. */
  value: UserLanguage;
  onPick: (language: UserLanguage) => void;
};

export function LanguageDialogView({ open, onOpenChange, value, onPick }: LanguageDialogViewProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("profile.languageDialogView.title")}</DialogTitle>
          <DialogDescription>{t("profile.languageDialogView.description")}</DialogDescription>
        </DialogHeader>

        <RadioGroup value={value} onValueChange={(next) => onPick(next)}>
          {LANGUAGE_OPTIONS.map((option) => (
            <FieldLabel key={option.value} htmlFor={`language-${option.value}`}>
              <Field orientation="horizontal">
                <RadioGroupItem id={`language-${option.value}`} value={option.value} />
                {option.name}
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
