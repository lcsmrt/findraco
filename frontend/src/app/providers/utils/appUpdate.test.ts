import { describe, expect, it } from "vitest";
import { compareVersions, decideUpdate, parseVersionManifest } from "./appUpdate";

describe("compareVersions", () => {
  it("orders pre-releases numerically and below the release (PWA-04 AC 6)", () => {
    const ascending = ["1.0.0-beta.9", "1.0.0-beta.23", "1.0.0", "1.0.1"];
    for (let index = 0; index < ascending.length - 1; index += 1) {
      expect(compareVersions(ascending[index], ascending[index + 1])).toBe(-1);
      expect(compareVersions(ascending[index + 1], ascending[index])).toBe(1);
    }
  });

  it("returns 0 for equal versions (PWA-04 AC 6)", () => {
    expect(compareVersions("1.0.0-beta.23", "1.0.0-beta.23")).toBe(0);
  });
});

describe("parseVersionManifest", () => {
  it("reads a well-formed manifest (PWA-04 AC 1)", () => {
    expect(parseVersionManifest({ version: "1.0.0-beta.23", minSupported: "1.0.0-beta.20" })).toEqual({
      version: "1.0.0-beta.23",
      minSupported: "1.0.0-beta.20",
    });
  });

  it.each([
    ["a missing minSupported", { version: "1.0.0" }],
    ["a missing version", { minSupported: "1.0.0" }],
    ["a version that is not SemVer", { version: "latest", minSupported: "1.0.0" }],
    ["a number instead of a string", { version: 1, minSupported: "1.0.0" }],
    ["a non-object", "1.0.0"],
    ["null", null],
  ])("returns null for %s (PWA-04 AC 5)", (_name, json) => {
    expect(parseVersionManifest(json)).toBeNull();
  });
});

describe("decideUpdate", () => {
  const running = "1.0.0-beta.22";
  const base = { running, needRefresh: false, dismissedVersion: null };

  it("shows nothing without a manifest (PWA-04 AC 5)", () => {
    expect(decideUpdate({ ...base, manifest: null, needRefresh: true })).toEqual({ kind: "none" });
  });

  it("requires an update when the minimum is above the running version, with no worker waiting (PWA-04 AC 2)", () => {
    const manifest = { version: "1.0.0-beta.23", minSupported: "1.0.0-beta.23" };
    expect(decideUpdate({ ...base, manifest })).toEqual({ kind: "required" });
  });

  it("offers the toast for a newer version with a waiting worker (PWA-03 AC 1, PWA-04 AC 4)", () => {
    const manifest = { version: "1.0.0-beta.23", minSupported: running };
    expect(decideUpdate({ ...base, manifest, needRefresh: true })).toEqual({
      kind: "available",
      version: "1.0.0-beta.23",
      showToast: true,
    });
  });

  it("keeps the toast hidden for the version that was dismissed (PWA-03 AC 3)", () => {
    const manifest = { version: "1.0.0-beta.23", minSupported: running };
    expect(
      decideUpdate({ ...base, manifest, needRefresh: true, dismissedVersion: "1.0.0-beta.23" }),
    ).toEqual({ kind: "available", version: "1.0.0-beta.23", showToast: false });
  });

  it("shows the toast again when a different version was dismissed (PWA-03 AC 3)", () => {
    const manifest = { version: "1.0.0-beta.24", minSupported: running };
    expect(
      decideUpdate({ ...base, manifest, needRefresh: true, dismissedVersion: "1.0.0-beta.23" }),
    ).toEqual({ kind: "available", version: "1.0.0-beta.24", showToast: true });
  });

  it("shows nothing for a newer version without a waiting worker (PWA-03 AC 6)", () => {
    const manifest = { version: "1.0.0-beta.23", minSupported: running };
    expect(decideUpdate({ ...base, manifest })).toEqual({ kind: "none" });
  });

  it("shows nothing for the running version even with a waiting worker (PWA-03 AC 6)", () => {
    const manifest = { version: running, minSupported: running };
    expect(decideUpdate({ ...base, manifest, needRefresh: true })).toEqual({ kind: "none" });
  });
});
