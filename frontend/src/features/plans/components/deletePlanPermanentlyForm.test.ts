import { describe, expect, it } from "vitest";
import { deletePlanPermanentlySchema, matchesPlanName } from "./deletePlanPermanentlyForm";

describe("matchesPlanName", () => {
  it("accepts the exact name (PDEL-04 AC 1)", () => {
    expect(matchesPlanName("Casa", "Casa")).toBe(true);
  });

  it.each([
    ["empty text", ""],
    ["a different case", "casa"],
    ["a trailing space", "Casa "],
    ["a leading space", " Casa"],
    ["a prefix of the name", "Cas"],
  ])("rejects %s (PDEL-04 AC 1)", (_label, typed) => {
    expect(matchesPlanName(typed, "Casa")).toBe(false);
  });
});

describe("deletePlanPermanentlySchema", () => {
  it("passes the exact name and fails anything else with a message (PDEL-04 AC 1)", () => {
    const schema = deletePlanPermanentlySchema("Casa");

    expect(schema.safeParse({ confirmation: "Casa" }).success).toBe(true);
    const wrong = schema.safeParse({ confirmation: "casa" });
    expect(wrong.success).toBe(false);
    if (!wrong.success) {
      expect(wrong.error.issues[0].message).toBe("plans.deleteForm.typeThePlanNameExactly");
    }
  });
});
