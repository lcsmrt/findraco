import { describe, expect, it } from "vitest";
import {
  listTimeZones,
  timeZoneSchema,
  toTimeZoneFormValues,
  toTimeZonePayload,
} from "./timeZoneForm";

describe("timeZoneSchema", () => {
  it("asks for a zone when pinning without one (BST-11 AC 7)", () => {
    const result = timeZoneSchema.safeParse({ mode: "PINNED", zone: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({
      path: ["zone"],
      message: "Pick a time zone",
    });
  });

  it("accepts automatic with no zone chosen", () => {
    expect(
      timeZoneSchema.safeParse({ mode: "AUTOMATIC", zone: "" }).success,
    ).toBe(true);
  });
});

describe("toTimeZonePayload", () => {
  it("sends the zone only when pinned", () => {
    expect(
      toTimeZonePayload({ mode: "PINNED", zone: "Europe/Lisbon" }),
    ).toEqual({
      mode: "PINNED",
      zone: "Europe/Lisbon",
    });
    expect(
      toTimeZonePayload({ mode: "AUTOMATIC", zone: "Europe/Lisbon" }),
    ).toEqual({ mode: "AUTOMATIC" });
  });
});

describe("toTimeZoneFormValues", () => {
  it("starts from the stored mode and zone, or automatic with none", () => {
    expect(
      toTimeZoneFormValues({ timeZone: "Asia/Tokyo", timeZoneMode: "PINNED" }),
    ).toEqual({
      mode: "PINNED",
      zone: "Asia/Tokyo",
    });
    expect(toTimeZoneFormValues()).toEqual({ mode: "AUTOMATIC", zone: "" });
  });
});

describe("listTimeZones", () => {
  it("lists the browser's zones and keeps the user's own when it is missing", () => {
    expect(listTimeZones("America/Sao_Paulo")).toContain("America/Sao_Paulo");
    expect(listTimeZones("Mars/Olympus")[0]).toBe("Mars/Olympus");
  });
});
