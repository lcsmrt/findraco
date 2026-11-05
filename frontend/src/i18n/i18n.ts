import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ptBR from "./pt-BR.json";
import { SOURCE_LANGUAGE, type Language } from "./languages";
import { syncDocumentLanguage } from "./utils/syncDocumentLanguage";

export const i18n = i18next;

// Both files are bundled: two small files cost less than a request before the first paint.
export function initI18n(language: Language) {
  void i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, "pt-BR": { translation: ptBR } },
    lng: language,
    fallbackLng: SOURCE_LANGUAGE,
    supportedLngs: ["en", "pt-BR"],
    // Resources are in memory: init settles before React renders.
    initAsync: false,
    interpolation: { escapeValue: false },
  });
  syncDocumentLanguage(i18n, document.documentElement);
}
