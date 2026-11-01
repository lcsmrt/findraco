export type VersionManifest = { version: string; minSupported: string };

type ParsedVersion = { core: number[]; prerelease: string[] };

function parseVersion(value: string): ParsedVersion {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(value);
  if (!match) {
    throw new Error(`"${value}" is not a SemVer version`);
  }
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

// The build only needs the order, so this stays a small SemVer 2.0.0 precedence check instead of a dependency.
function compareVersions(a: string, b: string): number {
  const left = parseVersion(a);
  const right = parseVersion(b);
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

// A minimum above the shipped version would block every device, the new one included, so the build refuses it.
export function buildVersionManifest(version: string, minSupported: string): VersionManifest {
  if (compareVersions(minSupported, version) > 0) {
    throw new Error(
      `findraco.minSupportedVersion (${minSupported}) is greater than version (${version})`,
    );
  }
  return { version, minSupported };
}
