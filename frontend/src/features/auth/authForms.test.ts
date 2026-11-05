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
  it("does not apply the new-password policy: existing accounts keep their password", () => {
    expect(
      loginSchema.safeParse({ email: "ana@example.com", password: "abc" }).success,
    ).toBe(true);
  });

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
      ["email", "auth.form.pleaseEnterYourEmail"],
      ["email", "auth.form.invalidEmail"],
      ["password", "auth.form.pleaseEnterYourPassword"],
    ]);
  });

  it("rejects a malformed email (STD-06 AC 9)", () => {
    expect(
      messages(loginSchema.safeParse({ email: "ana", password: "secret" })),
    ).toEqual([["email", "auth.form.invalidEmail"]]);
  });
});

describe("registerUserSchema", () => {
  it("accepts a name, an email and a password", () => {
    const result = registerUserSchema.safeParse({
      name: "Ana Souza",
      email: "ana@example.com",
      password: "secret-pass",
    });

    expect(result.success).toBe(true);
  });

  it("asks for each empty field", () => {
    expect(
      messages(
        registerUserSchema.safeParse({ name: "", email: "", password: "" }),
      ),
    ).toEqual([
      ["name", "auth.form.pleaseEnterYourFullName"],
      // Empty also fails the format check; the field shows the first issue, the missing email.
      ["email", "auth.form.pleaseEnterYourEmail"],
      ["email", "auth.form.invalidEmail"],
      ["password", "auth.form.pleaseEnterYourPassword"],
    ]);
  });

  it("holds a new password to the API's policy (BST-15 AC 11)", () => {
    const result = registerUserSchema.safeParse({
      name: "Ana",
      email: "ana@example.com",
      password: "short",
    });

    expect(messages(result)).toEqual([["password", "auth.password.length"]]);
  });

  it("rejects a malformed email", () => {
    const result = registerUserSchema.safeParse({
      name: "Ana",
      email: "ana@",
      password: "secret-pass",
    });

    expect(messages(result)).toEqual([["email", "auth.form.invalidEmail"]]);
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
      ["email", "auth.form.pleaseEnterYourEmail"],
      ["email", "auth.form.invalidEmail"],
    ]);
  });

  it("rejects a malformed email", () => {
    expect(messages(forgotPasswordSchema.safeParse({ email: "ana" }))).toEqual([
      ["email", "auth.form.invalidEmail"],
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

  it("holds the new password to the API's policy (BST-15 AC 11)", () => {
    const result = resetPasswordSchema.safeParse({
      password: "short",
      confirmPassword: "short",
    });

    expect(messages(result)).toEqual([["password", "auth.password.length"]]);
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
        message: "auth.form.passwordsDoNotMatch",
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
