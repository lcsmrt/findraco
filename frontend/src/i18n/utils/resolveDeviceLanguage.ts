import { SOURCE_LANGUAGE, type Language } from "../languages";

// The first preferred language that is Portuguese in any variety wins; pt-PT readers read pt-BR.
export function resolveDeviceLanguage(
  deviceLanguages: readonly string[],
): Language {
  const portuguese = deviceLanguages.some((tag) => /^pt(-|$)/i.test(tag));
  return portuguese ? "pt-BR" : SOURCE_LANGUAGE;
}
