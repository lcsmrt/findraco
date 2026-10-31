import type { TimeZoneMode } from "@/api/dtos";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/input/base/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  TIME_ZONE_MODE_LABELS,
  type TimeZoneFormOutput,
  type TimeZoneFormValues,
  timeZoneSchema,
} from "./timeZoneForm";

type TimeZoneDialogViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: TimeZoneFormValues;
  zones: string[];
  isSaving: boolean;
  onSave: (values: TimeZoneFormOutput) => void;
};

const MODES: TimeZoneMode[] = ["AUTOMATIC", "PINNED"];

export function TimeZoneDialogView({
  open,
  onOpenChange,
  initialValues,
  zones,
  isSaving,
  onSave,
}: TimeZoneDialogViewProps) {
  const { control, handleSubmit, reset } = useForm<
    TimeZoneFormValues,
    unknown,
    TimeZoneFormOutput
  >({
    resolver: zodResolver(timeZoneSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [open, initialValues, reset]);

  const mode = useWatch({ control, name: "mode" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Time zone</DialogTitle>
          <DialogDescription>
            Decides which day is today. Automatic follows this device; pinning
            keeps the zone you pick.
          </DialogDescription>
        </DialogHeader>

        <FormField control={control} name="mode" label="Time zone source">
          {(field) => (
            <Select
              items={TIME_ZONE_MODE_LABELS}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={field.id}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={field["aria-invalid"]}
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {TIME_ZONE_MODE_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        {mode === "PINNED" && (
          <FormField control={control} name="zone" label="Time zone">
            {(field) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.id}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  aria-invalid={field["aria-invalid"]}
                  className="w-full"
                >
                  <SelectValue placeholder="Select a zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={isSaving}
            onClick={handleSubmit(onSave)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
