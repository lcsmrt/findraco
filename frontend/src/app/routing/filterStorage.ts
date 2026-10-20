export type FilterScreen = "overview" | "transactions" | "categories";

// The key format changed with per-screen routes; entries under the old `homeFilters:` keys are
// never read, so each screen starts from its defaults once.
function keyFor(screen: FilterScreen, userId: number, planId: number) {
  return `filters:${screen}:${userId}:${planId}`;
}

/** Saves a screen's query string for (user, plan). Never throws. */
export function saveFilters(
  screen: FilterScreen,
  userId: number,
  planId: number,
  search: string,
): void {
  try {
    localStorage.setItem(keyFor(screen, userId, planId), search);
  } catch {
    // Storage unavailable (private mode, quota): URL state still works.
  }
}

/** Loads a screen's saved query string for (user, plan), or null. Never throws. */
export function loadFilters(
  screen: FilterScreen,
  userId: number,
  planId: number,
): string | null {
  try {
    return localStorage.getItem(keyFor(screen, userId, planId));
  } catch {
    return null;
  }
}
