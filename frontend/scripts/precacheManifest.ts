// The worker throws at install when its precache list names a URL twice, and then precaches nothing
// while still looking installed. Nothing in the build notices, so the build rejects the list instead.

export type PrecacheEntry = { url: string };

export function findDuplicateUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const url of urls) {
    if (seen.has(url)) {
      duplicates.add(url);
    }
    seen.add(url);
  }
  return [...duplicates];
}

/**
 * A Workbox manifest transform that fails the build on a duplicate URL. Workbox appends
 * `additionalManifestEntries` after the transforms run (the plugin adds the web manifest and public
 * assets that way), so their URLs are passed in to be counted with the globbed ones.
 */
export function rejectDuplicateUrls(additionalUrls: string[]) {
  return function rejectDuplicates<T extends PrecacheEntry>(manifest: T[]) {
    const duplicates = findDuplicateUrls([
      ...manifest.map((entry) => entry.url),
      ...additionalUrls,
    ]);
    if (duplicates.length > 0) {
      throw new Error(
        `The precache list names these URLs more than once, so the worker would precache nothing: ${duplicates.join(", ")}`,
      );
    }
    return { manifest };
  };
}
