import { describe, expect, it } from "vitest";
import { planNameSchema } from "./planNameForm";

describe("planNameSchema", () => {
  it("accepts a valid plan name", () => {
    const result = planNameSchema.safeParse({ name: "Household finances" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "Household finances" });
    }
  });

  it("rejects an empty name", () => {
    const result = planNameSchema.safeParse({ name: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Enter a name for the plan",
      );
    }
  });
});
