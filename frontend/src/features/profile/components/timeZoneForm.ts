import type { TimeZoneMode, UpdateTimeZoneRequest, User } from "@/api/dtos";
import { z } from "zod";

export const timeZoneSchema = z
  .object({
    mode: z.enum(["AUTOMATIC", "PINNED"]),
    zone: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.mode === "PINNED" && !values.zone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pick a time zone",
        path: ["zone"],
      });
    }
  });

export type TimeZoneFormValues = z.input<typeof timeZoneSchema>;
export type TimeZoneFormOutput = z.output<typeof timeZoneSchema>;

export const TIME_ZONE_MODE_LABELS: Record<TimeZoneMode, string> = {
  AUTOMATIC: "Automatic (this device)",
  PINNED: "Pinned",
};

/** The zones the browser knows, with the user's own first when the browser's list lacks it. */
export function listTimeZones(current: string): string[] {
  const zones = Intl.supportedValuesOf("timeZone");
  return !current || zones.includes(current) ? zones : [current, ...zones];
}

export function toTimeZoneFormValues(
  profile?: Pick<User, "timeZone" | "timeZoneMode">,
): TimeZoneFormValues {
  return {
    mode: profile?.timeZoneMode ?? "AUTOMATIC",
    zone: profile?.timeZone ?? "",
  };
}

/** Only a pinned zone is sent: an automatic zone comes from the device header. */
export function toTimeZonePayload(
  values: TimeZoneFormOutput,
): UpdateTimeZoneRequest["body"] {
  return values.mode === "PINNED"
    ? { mode: "PINNED", zone: values.zone }
    : { mode: "AUTOMATIC" };
}
