import { z } from "zod";

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
 * Retrieves a value from Local Storage, checked against `schema`.
 *
 * Storage outlives the code that wrote it and anyone can edit it, so what comes back is unknown
 * until validated: a missing key, malformed JSON or a value of the wrong shape all read as null.
 * @param key Storage key.
 * @param schema Shape the stored value must have.
 * @returns The validated value, or null.
 */
export function getItemFromStorage<T>(
  key: keyof typeof STORAGE_KEYS,
  schema: z.ZodType<T>,
): T | null {
  const value = localStorage.getItem(STORAGE_KEYS[key]);
  if (value === null) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }
  const result = schema.safeParse(parsed);
  return result.success ? result.data : null;
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
 * `clearStorage`, keeps unrelated entries such as saved filters and the theme.
 */
export function clearSessionStorage(): void {
  Object.values(STORAGE_KEYS).forEach((name) => localStorage.removeItem(name));
}
