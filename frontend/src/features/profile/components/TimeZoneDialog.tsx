import {
  useGetUserProfile,
  useUpdateTimeZone,
} from "@/api/services/useAuthService";
import { useMemo } from "react";
import {
  listTimeZones,
  toTimeZoneFormValues,
  toTimeZonePayload,
  type TimeZoneFormOutput,
} from "./timeZoneForm";
import { TimeZoneDialogView } from "./TimeZoneDialogView";

type TimeZoneDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TimeZoneDialog({ open, onOpenChange }: TimeZoneDialogProps) {
  const { data: profile } = useGetUserProfile({ enabled: open });
  const { mutate: updateTimeZone, isPending } = useUpdateTimeZone({
    onSuccess: () => onOpenChange(false),
  });

  const initialValues = useMemo(() => toTimeZoneFormValues(profile), [profile]);
  const zones = useMemo(
    () => listTimeZones(initialValues.zone),
    [initialValues.zone],
  );

  function handleSave(values: TimeZoneFormOutput) {
    updateTimeZone({ body: toTimeZonePayload(values) });
  }

  return (
    <TimeZoneDialogView
      open={open}
      onOpenChange={onOpenChange}
      initialValues={initialValues}
      zones={zones}
      isSaving={isPending}
      onSave={handleSave}
    />
  );
}
