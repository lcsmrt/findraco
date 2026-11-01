import { z } from "zod";

type ParsedVersion = { core: number[]; prerelease: string[] };

function parseVersion(value: string): ParsedVersion | null {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(value);
  if (!match) return null;
  return {
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4] ? match[4].split(".") : [],
  };
}

function comparePrereleaseIdentifier(a: string, b: string): number {
  const aNumeric = /^\d+$/.test(a);
  const bNumeric = /^\d+$/.test(b);
  if (aNumeric && bNumeric) return Math.sign(Number(a) - Number(b));
  // Numeric identifiers rank below alphanumeric ones.
  if (aNumeric) return -1;
  if (bNumeric) return 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

function requireVersion(value: string): ParsedVersion {
  const parsed = parseVersion(value);
  if (!parsed) throw new Error(`"${value}" is not a SemVer version`);
  return parsed;
}

// The order is all that is needed, so this stays a small SemVer 2.0.0 precedence check instead of a
// dependency. The build script that refuses a minimum above the shipped version shares it.
export function compareVersions(a: string, b: string): number {
  const left = requireVersion(a);
  const right = requireVersion(b);
  for (let index = 0; index < 3; index += 1) {
    const difference = left.core[index] - right.core[index];
    if (difference !== 0) return Math.sign(difference);
  }
  // A version without a pre-release outranks the same core with one.
  if (left.prerelease.length === 0 || right.prerelease.length === 0) {
    return Math.sign(right.prerelease.length - left.prerelease.length);
  }
  const shared = Math.min(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < shared; index += 1) {
    const result = comparePrereleaseIdentifier(left.prerelease[index], right.prerelease[index]);
    if (result !== 0) return result;
  }
  return Math.sign(left.prerelease.length - right.prerelease.length);
}

export type VersionManifest = { version: string; minSupported: string };

export type UpdateState =
  | { kind: "none" }
  | { kind: "available"; version: string; showToast: boolean }
  | { kind: "required" };

// A version that is not SemVer would make every comparison throw, so it counts as a malformed file.
const versionSchema = z.string().refine((value) => parseVersion(value) !== null);
const manifestSchema = z.object({ version: versionSchema, minSupported: versionSchema });

export function parseVersionManifest(json: unknown): VersionManifest | null {
  const result = manifestSchema.safeParse(json);
  return result.success ? result.data : null;
}

type DecideUpdateInput = {
  running: string;
  manifest: VersionManifest | null;
  needRefresh: boolean;
  dismissedVersion: string | null;
};

export function decideUpdate({
  running,
  manifest,
  needRefresh,
  dismissedVersion,
}: DecideUpdateInput): UpdateState {
  if (!manifest) return { kind: "none" };
  if (compareVersions(manifest.minSupported, running) > 0) return { kind: "required" };
  // The label needs the version, and without a waiting worker there is nothing to activate.
  if (needRefresh && compareVersions(manifest.version, running) > 0) {
    return { kind: "available", version: manifest.version, showToast: dismissedVersion !== manifest.version };
  }
  return { kind: "none" };
}
