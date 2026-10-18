import { describe, expect, it } from "vitest";
import { INVITE_FORM_DEFAULTS, inviteSchema, toInvitePayload } from "./inviteForm";

function emailIssues(values: unknown) {
  const result = inviteSchema.safeParse(values);
  if (result.success) return [];
  return result.error.issues.filter((issue) => issue.path[0] === "email").map((issue) => issue.message);
}

describe("inviteSchema", () => {
  it("asks for an email address when the invitation goes by email", () => {
    expect(emailIssues({ ...INVITE_FORM_DEFAULTS, type: "EMAIL", email: "" })).toEqual([
      "Enter an email address",
    ]);
  });

  it("treats a whitespace-only email address as missing", () => {
    expect(emailIssues({ ...INVITE_FORM_DEFAULTS, type: "EMAIL", email: "   " })).toEqual([
      "Enter an email address",
    ]);
  });

  it("accepts an email invitation with an address", () => {
    const result = inviteSchema.safeParse({ ...INVITE_FORM_DEFAULTS, email: "ana@example.com" });

    expect(result.success).toBe(true);
  });

  it("accepts a link invitation without an email address", () => {
    const result = inviteSchema.safeParse({ ...INVITE_FORM_DEFAULTS, type: "LINK", email: "" });

    expect(result.success).toBe(true);
  });

  it("rejects a role that cannot be invited", () => {
    const result = inviteSchema.safeParse({ ...INVITE_FORM_DEFAULTS, role: "OWNER", email: "ana@example.com" });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].path).toEqual(["role"]);
  });

  it("rejects an unknown invitation type", () => {
    const result = inviteSchema.safeParse({ ...INVITE_FORM_DEFAULTS, type: "SMS" });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].path).toEqual(["type"]);
  });
});

describe("toInvitePayload", () => {
  it("sends the trimmed address and no expiry for an email invitation", () => {
    expect(
      toInvitePayload({ role: "EDITOR", type: "EMAIL", email: "  ana@example.com ", expiresAt: "2026-12-31T18:00" }),
    ).toEqual({ role: "EDITOR", type: "EMAIL", email: "ana@example.com", expiresAt: undefined });
  });

  it("sends the expiry and no address for a link invitation", () => {
    expect(
      toInvitePayload({ role: "VIEWER", type: "LINK", email: "ana@example.com", expiresAt: "2026-12-31T18:00" }),
    ).toEqual({ role: "VIEWER", type: "LINK", email: undefined, expiresAt: "2026-12-31T18:00" });
  });

  it("sends no expiry for a link invitation left without one", () => {
    expect(toInvitePayload({ role: "VIEWER", type: "LINK", email: "", expiresAt: "" })).toEqual({
      role: "VIEWER",
      type: "LINK",
      email: undefined,
      expiresAt: undefined,
    });
  });
});
