import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n";

/**
 * Request-scoped next-intl configuration.
 *
 * In next-intl v4 for the App Router, the locale for a request is obtained
 * via the `requestLocale` function, not a direct `locale` string.
 *
 * @param context - Next.js routing context with `requestLocale` resolver.
 * @returns Locale and messages for the current request.
 */
export default getRequestConfig(async ({ requestLocale }): Promise<{
  locale: Locale;
  messages: Record<string, unknown>;
}> => {
  // In this project setup, `requestLocale` is already a Promise<string | undefined>,
  // so we await it directly instead of calling it as a function.
  const resolved = (await requestLocale) ?? defaultLocale;
  const localeParam = resolved;
  const activeLocale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale;

  return {
    locale: activeLocale,
    messages: (await import(`../../messages/${activeLocale}.json`)).default,
  };
});

