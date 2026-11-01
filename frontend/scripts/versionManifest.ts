import { compareVersions, type VersionManifest } from "../src/app/providers/utils/appUpdate.ts";

export type { VersionManifest };

// A minimum above the shipped version would block every device, the new one included, so the build refuses it.
export function buildVersionManifest(version: string, minSupported: string): VersionManifest {
  if (compareVersions(minSupported, version) > 0) {
    throw new Error(
      `findraco.minSupportedVersion (${minSupported}) is greater than version (${version})`,
    );
  }
  return { version, minSupported };
}
