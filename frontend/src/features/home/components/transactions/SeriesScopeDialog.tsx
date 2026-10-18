import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog/Dialog";
import { Button } from "@/components/button/Button";
import { Field, FieldLabel } from "@/components/input/base/Field";
import { RadioGroup, RadioGroupItem } from "@/components/input/base/RadioGroup";
import { SeriesEditScope } from "@/api/dtos/financialTransaction";
import type { ScopeDialogOptions } from "./useSeriesScope";

type ScopeOption = {
  value: SeriesEditScope;
  label: string;
  helperText: string;
};

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    value: "THIS_ONE",
    label: "This one",
    helperText: "Only this occurrence will be changed.",
  },
  {
    value: "THIS_AND_FOLLOWING",
    label: "This and following",
    helperText:
      "This and all future occurrences will be changed. Past occurrences stay the same.",
  },
  {
    value: "ALL",
    label: "All",
    helperText: "Every occurrence in the series will be changed, including past ones.",
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
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent>
        <DialogHeader className="gap-4">
          <DialogTitle>{options.title ?? "Edit series"}</DialogTitle>
          <DialogDescription>
            {options.description ?? "Choose what to apply this change to."}
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          value={scope}
          onValueChange={(value) => onScopeChange(value as SeriesEditScope)}
        >
          {SCOPE_OPTIONS.map((option) => (
            <FieldLabel key={option.value} htmlFor={option.value}>
              <Field orientation="horizontal">
                <RadioGroupItem id={option.value} value={option.value} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-muted-foreground text-sm">
                    {option.helperText}
                  </span>
                </div>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={options.confirmVariant ?? "default"}
            onClick={onContinue}
          >
            {options.confirmLabel ?? "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
