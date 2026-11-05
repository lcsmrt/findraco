export const LANGUAGES = ["en", "pt-BR"] as const;

export type Language = (typeof LANGUAGES)[number];

export const SOURCE_LANGUAGE: Language = "en";
