import { z } from "zod";

/** The API's bounds (BST-15): characters are Unicode code points, counted after NFKC. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_LENGTH_MESSAGE = `Use ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters`;
export const PASSWORD_CHARACTERS_MESSAGE = "Remove tabs, line breaks and invisible characters";

// Control (Cc), format (Cf: zero-width space, BOM), line (Zl) and paragraph (Zp) separators: they arrive by
// paste and make a password that looks right and never matches.
const FORBIDDEN_CHARACTERS = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u;

/** How many characters the API will count: code points of the NFKC form, so an emoji is one. */
export function passwordLength(password: string): number {
  return Array.from(password.normalize("NFKC")).length;
}

export function hasForbiddenPasswordCharacters(password: string): boolean {
  return FORBIDDEN_CHARACTERS.test(password.normalize("NFKC"));
}

/**
 * A new password, as the API checks it. An empty value gets `emptyMessage` alone; the sign-in form does not use
 * this schema, because existing accounts keep the password they have.
 */
export function newPasswordSchema(emptyMessage: string) {
  return z
    .string()
    .min(1, emptyMessage)
    .superRefine((password, context) => {
      if (password.length === 0) return;
      const length = passwordLength(password);
      if (length < PASSWORD_MIN_LENGTH || length > PASSWORD_MAX_LENGTH) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: PASSWORD_LENGTH_MESSAGE });
      }
      if (hasForbiddenPasswordCharacters(password)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: PASSWORD_CHARACTERS_MESSAGE });
      }
    });
}

/**
 * A hint, never an error: spaces at either end are allowed (passphrases), but they are easy to type by
 * accident and then impossible to see.
 */
export function passwordSpacesHint(password: string): string | null {
  return password.length > 0 && password.trim() !== password
    ? "This password starts or ends with a space. Keep it only if you meant to."
    : null;
}
