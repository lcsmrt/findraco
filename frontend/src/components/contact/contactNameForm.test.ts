import { describe, expect, it } from "vitest";
import { contactNameSchema } from "./contactNameForm";

describe("contactNameSchema", () => {
  it("saves the name trimmed", () => {
    expect(contactNameSchema.parse({ name: "  Mãe  " })).toEqual({ name: "Mãe" });
  });

  it("refuses an empty name, and one that is only spaces", () => {
    for (const name of ["", "   "]) {
      const result = contactNameSchema.safeParse({ name });
      expect(result.error?.issues.map((issue) => issue.message)).toEqual(["contacts.nameForm.enterAName"]);
    }
  });

  it("accepts 60 characters and refuses 61", () => {
    expect(contactNameSchema.safeParse({ name: "a".repeat(60) }).success).toBe(true);
    expect(contactNameSchema.safeParse({ name: "a".repeat(61) }).error?.issues.map((issue) => issue.message)).toEqual([
      "contacts.nameForm.nameTooLong",
    ]);
  });
});
