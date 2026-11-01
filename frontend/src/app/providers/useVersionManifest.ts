import { useEffect, useState } from "react";
import { parseVersionManifest, type VersionManifest } from "./utils/appUpdate";

const CHECK_INTERVAL_MS = 60 * 60 * 1000;

async function fetchVersionManifest(): Promise<VersionManifest | null> {
  try {
    const response = await fetch("/version.json", { cache: "no-store" });
    if (!response.ok) return null;
    return parseVersionManifest(await response.json());
  } catch {
    return null;
  }
}

/**
 * The newest published manifest, read on start-up, on return to the foreground and every hour; each
 * read also asks the browser for a new worker. A failed read keeps the last good manifest, so a
 * transient error neither raises a notice nor lifts a block that was already shown.
 */
export function useVersionManifest(checkForUpdate: () => Promise<void>): VersionManifest | null {
  const [manifest, setManifest] = useState<VersionManifest | null>(null);

  useEffect(() => {
    let active = true;

    async function check() {
      const [next] = await Promise.all([fetchVersionManifest(), checkForUpdate()]);
      if (active && next) setManifest(next);
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") void check();
    }

    void check();
    const interval = setInterval(() => void check(), CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkForUpdate]);

  return manifest;
}
