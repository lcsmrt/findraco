export const STORAGE_KEYS = {
  hasSession: "hasSession",
  user: "user",
  activePlanId: "activePlanId",
} as const;

/**
 * Stores a value in Local Storage.
 * @param key Storage key.
 * @param value Value to be stored.
 */
export function storeItem<T>(key: keyof typeof STORAGE_KEYS, value: T): void {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
}

/**
 * Retrieves a value from Local Storage.
 * @param key Storage key.
 * @returns Parsed value or null if not found.
 */
export function getItemFromStorage<T>(
  key: keyof typeof STORAGE_KEYS,
): T | null {
  const value = localStorage.getItem(STORAGE_KEYS[key]);
  return value ? JSON.parse(value) : null;
}

/**
 * Removes a value from Local Storage.
 * @param key Storage key.
 */
export function removeItemFromStorage(key: keyof typeof STORAGE_KEYS): void {
  localStorage.removeItem(STORAGE_KEYS[key]);
}

/**
 * Clears all Local Storage entries.
 */
export function clearStorage(): void {
  localStorage.clear();
}

/**
 * Removes only the session keys (auth token, user, active plan). Unlike
 * `clearStorage`, keeps unrelated entries such as saved home filters and the theme.
 */
export function clearSessionStorage(): void {
  (Object.keys(STORAGE_KEYS) as (keyof typeof STORAGE_KEYS)[]).forEach(
    removeItemFromStorage,
  );
}
