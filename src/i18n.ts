export const locales = ["en", "de", "lt", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

/**
 * Checks whether string is supported locale.
 * @param {string} value - The locale segment to validate.
 * @returns {value is Locale} True when the locale is supported.
 */
export const isValidLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

/**
 * Human-readable language name for LLM system prompts (assistant reply language).
 *
 * @param locale - Active UI locale.
 * @returns English name of the language the model should write in.
 */
export function replyLanguageNameForLocale(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: "English",
    de: "German",
    lt: "Lithuanian",
    ru: "Russian",
  };
  return names[locale];
}
