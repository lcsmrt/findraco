import { describe, expect, it } from "vitest";
import { resetPasswordSchema } from "./ResetPasswordPage";

describe("resetPasswordSchema", () => {
  it("accepts matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "new-password",
      confirmPassword: "new-password",
    });

    expect(result.success).toBe(true);
  });

  it("flags the confirmation when the passwords differ", () => {
    const result = resetPasswordSchema.safeParse({
      password: "new-password",
      confirmPassword: "other-password",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        path: ["confirmPassword"],
        message: "Passwords do not match",
      }),
    ]);
  });

  it("requires both fields", () => {
    const result = resetPasswordSchema.safeParse({
      password: "",
      confirmPassword: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "password",
      "confirmPassword",
    ]);
  });
});
