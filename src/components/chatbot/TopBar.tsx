"use client";

import { useTranslations, useLocale } from "next-intl";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

const STUDIO_WEBSITE = "https://nk-studio.org";

/**
 * Fixed header with app title and an external link to the NK Studio website.
 *
 * @returns Header element for all chatbot views.
 */
export default function TopBar() {
  const rawLocale = useLocale();
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const tTopBar = useTranslations("TopBar");

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0e0e0f] border-b border-[#48484b]/10">
      <div className="relative flex items-center justify-center px-4 sm:px-6 md:px-12 h-16 bg-[#0e0e0f]/70 backdrop-blur-xl">
        <h1 className="font-headline font-bold text-[#c6c6c7] tracking-tight text-base sm:text-lg md:text-xl text-center px-14 sm:px-20">
          {tTopBar("title")}
        </h1>

        <div className="absolute right-3 sm:right-6 md:right-12 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} />
          <a
            href={STUDIO_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NK Studio website (nk-studio.org), opens in a new tab"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] sm:text-xs font-label font-semibold uppercase tracking-widest text-[#00ffab] hover:text-[#7dffc9] hover:bg-[#1f1f22] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffab]/50"
          >
            <span
              className="material-symbols-outlined text-base shrink-0"
              data-icon="open_in_new"
              aria-hidden
            >
              open_in_new
            </span>
            <span className="hidden min-[380px]:inline truncate max-w-[9rem] sm:max-w-none">
              nk-studio.org
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
