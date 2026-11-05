import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/base/Dialog";
import { Button } from "@/components/button/base/Button";
import { Field, FieldLabel } from "@/components/input/base/Field";
import { RadioGroup, RadioGroupItem } from "@/components/input/base/RadioGroup";
import { SeriesEditScope } from "@/api/dtos/transaction";
import type { ScopeDialogOptions } from "./useSeriesScope";
import { Text } from "@/components/typography/base/Text";
import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";

type ScopeOption = {
  value: SeriesEditScope;
  label: ParseKeys;
  helperText: ParseKeys;
};

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    value: "THIS_ONE",
    label: "transactions.seriesScopeDialog.thisOne",
    helperText: "transactions.seriesScopeDialog.thisOneHelp",
  },
  {
    value: "THIS_AND_FOLLOWING",
    label: "transactions.seriesScopeDialog.thisAndFollowing",
    helperText: "transactions.seriesScopeDialog.thisAndFollowingHelp",
  },
  {
    value: "ALL",
    label: "transactions.seriesScopeDialog.all",
    helperText: "transactions.seriesScopeDialog.allHelp",
  },
];

type SeriesScopeDialogProps = {
  open: boolean;
  scope: SeriesEditScope;
  options: ScopeDialogOptions;
  onScopeChange: (scope: SeriesEditScope) => void;
  onContinue: () => void;
  onCancel: () => void;
};

export function SeriesScopeDialog({
  open,
  scope,
  options,
  onScopeChange,
  onContinue,
  onCancel,
}: SeriesScopeDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent>
        <DialogHeader className="gap-4">
          <DialogTitle>
            {options.title ?? t("transactions.seriesScopeDialog.editSeries")}
          </DialogTitle>
          <DialogDescription>
            {options.description ?? t("transactions.seriesScopeDialog.chooseScope")}
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={scope} onValueChange={(value) => onScopeChange(value)}>
          {SCOPE_OPTIONS.map((option) => (
            <FieldLabel key={option.value} htmlFor={option.value}>
              <Field orientation="horizontal">
                <RadioGroupItem id={option.value} value={option.value} />
                <div className="flex flex-col gap-0.5">
                  <Text variant="label">{t(option.label)}</Text>
                  <Text variant="secondary">{t(option.helperText)}</Text>
                </div>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button variant={options.confirmVariant ?? "default"} onClick={onContinue}>
            {options.confirmLabel ?? t("transactions.seriesScopeDialog.continue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
