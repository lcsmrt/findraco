import type { i18n as I18n } from "i18next";

// The browser reads `lang` for hyphenation, screen-reader voices and spell-checking, so it must name the
// language on screen, not the one the page was served in.
export function syncDocumentLanguage(instance: I18n, root: HTMLElement) {
  root.lang = instance.language;
  instance.on("languageChanged", (language) => {
    root.lang = language;
  });
}
