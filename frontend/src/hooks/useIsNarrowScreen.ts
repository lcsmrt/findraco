import { useSyncExternalStore } from "react";

/** Below Tailwind's `sm` (640px), where the bottom bar replaces the side navigation. */
const NARROW_QUERY = "(max-width: 639px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(NARROW_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(NARROW_QUERY).matches;
}

/** True while the viewport is narrower than 640px; follows the window being resized. */
export function useIsNarrowScreen() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
