import { describe, expect, it } from "vitest";
import type { z } from "zod";
import {
  forgotPasswordSchema,
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "./authForms";

function messages(result: z.SafeParseReturnType<unknown, unknown>) {
  return result.error?.issues.map((issue) => [issue.path[0], issue.message]);
}

describe("loginSchema", () => {
  it("accepts an email and a password", () => {
    expect(
      loginSchema.safeParse({ email: "ana@example.com", password: "secret" })
        .success,
    ).toBe(true);
  });

  it("asks for each empty field (STD-06 AC 9)", () => {
    expect(
      messages(loginSchema.safeParse({ email: "", password: "" })),
    ).toEqual([
      // Empty also fails the format check; the field shows the first issue, the missing email.
      ["email", "Please enter your email"],
      ["email", "Invalid email"],
      ["password", "Please enter your password"],
    ]);
  });

  it("rejects a malformed email (STD-06 AC 9)", () => {
    expect(
      messages(loginSchema.safeParse({ email: "ana", password: "secret" })),
    ).toEqual([["email", "Invalid email"]]);
  });
});

describe("registerUserSchema", () => {
  it("accepts a name, an email and a password", () => {
    const result = registerUserSchema.safeParse({
      name: "Ana Souza",
      email: "ana@example.com",
      password: "secret",
    });

    expect(result.success).toBe(true);
  });

  it("asks for each empty field", () => {
    expect(
      messages(
        registerUserSchema.safeParse({ name: "", email: "", password: "" }),
      ),
    ).toEqual([
      ["name", "Please enter your full name"],
      // Empty also fails the format check; the field shows the first issue, the missing email.
      ["email", "Please enter your email"],
      ["email", "Invalid email"],
      ["password", "Please enter your password"],
    ]);
  });

  it("rejects a malformed email", () => {
    const result = registerUserSchema.safeParse({
      name: "Ana",
      email: "ana@",
      password: "secret",
    });

    expect(messages(result)).toEqual([["email", "Invalid email"]]);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts an email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "ana@example.com" }).success,
    ).toBe(true);
  });

  it("asks for an empty email (STD-06 AC 9)", () => {
    expect(messages(forgotPasswordSchema.safeParse({ email: "" }))).toEqual([
      ["email", "Please enter your email"],
      ["email", "Invalid email"],
    ]);
  });

  it("rejects a malformed email", () => {
    expect(messages(forgotPasswordSchema.safeParse({ email: "ana" }))).toEqual([
      ["email", "Invalid email"],
    ]);
  });
});

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
