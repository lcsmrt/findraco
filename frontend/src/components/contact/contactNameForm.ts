import { z } from "zod";

/** A contact's name as the API stores it: trimmed, 1 to 60 characters. */
export const contactNameSchema = z.object({
  name: z.string().trim().min(1, "contacts.nameForm.enterAName").max(60, "contacts.nameForm.nameTooLong"),
});

export type ContactNameFormValues = z.input<typeof contactNameSchema>;
export type ContactNameFormOutput = z.output<typeof contactNameSchema>;
