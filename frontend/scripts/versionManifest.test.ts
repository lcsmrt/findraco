import { describe, expect, it } from "vitest";
import { buildVersionManifest } from "./versionManifest.ts";

describe("buildVersionManifest", () => {
  it("returns the version and the minimum supported version (PWA-04 AC 1)", () => {
    expect(buildVersionManifest("1.0.0-beta.23", "1.0.0-beta.20")).toEqual({
      version: "1.0.0-beta.23",
      minSupported: "1.0.0-beta.20",
    });
  });

  it("accepts a minimum equal to the version", () => {
    expect(buildVersionManifest("1.0.0-beta.23", "1.0.0-beta.23")).toEqual({
      version: "1.0.0-beta.23",
      minSupported: "1.0.0-beta.23",
    });
  });

  it("compares pre-release numbers as numbers, not text", () => {
    expect(() => buildVersionManifest("1.0.0-beta.23", "1.0.0-beta.9")).not.toThrow();
  });

  it("throws naming both when the minimum is a later pre-release (PWA-04 edge case)", () => {
    expect(() => buildVersionManifest("1.0.0-beta.23", "1.0.0-beta.24")).toThrow(
      "findraco.minSupportedVersion (1.0.0-beta.24) is greater than version (1.0.0-beta.23)",
    );
  });

  it("throws when the minimum is the release of the shipped pre-release", () => {
    expect(() => buildVersionManifest("1.0.0-beta.23", "1.0.0")).toThrow(
      "(1.0.0) is greater than version (1.0.0-beta.23)",
    );
  });

  it("throws when the minimum is a later patch of a release", () => {
    expect(() => buildVersionManifest("1.0.0", "1.0.1")).toThrow("(1.0.1) is greater than version (1.0.0)");
  });
});
