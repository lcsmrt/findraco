import type { ParseKeys, TFunction } from "i18next";
import { i18n } from "../i18n";

/**
 * Form schemas hold translation keys as their messages, so an error already in the form state follows
 * a language switch. A message that is not a key (text from the API, a library default) shows as it is.
 */
export function translateMessage(t: TFunction, message: string): string {
  return i18n.exists(message) ? t(message as ParseKeys) : message;
}
