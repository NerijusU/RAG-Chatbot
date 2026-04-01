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
