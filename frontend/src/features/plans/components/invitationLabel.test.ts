import type { Invitation } from "@/api/dtos";
import { describe, expect, it } from "vitest";
import { invitationLabel } from "./invitationLabel";

const base: Invitation = { id: 1, token: "abc", role: "EDITOR", type: "EMAIL", status: "PENDING" };

describe("invitationLabel", () => {
  it("names an email invitation by its address", () => {
    expect(invitationLabel({ ...base, email: "ana@example.com" })).toBe("ana@example.com");
  });

  it("falls back to a generic name for an email invitation without an address", () => {
    expect(invitationLabel(base)).toBe("Email invitation");
  });

  it("names a link invitation generically", () => {
    expect(invitationLabel({ ...base, type: "LINK", email: "ana@example.com" })).toBe("Link invitation");
  });
});
