"use client";

import { useState, type ComponentType } from "react";
import { US, DE, LT, RU } from "country-flag-icons/react/3x2";
import { useTranslations } from "next-intl";
import { locales, type Locale } from "@/i18n";
import { usePathname } from "next/navigation";
import Link from "next/link";

type LanguageSwitcherProps = {
  /** Currently active locale code. */
  locale: Locale;
  /** Called when user selects a different locale. */
  onChangeLocale?: (locale: Locale) => void;
};

const localeToFlag: Record<Locale, ComponentType<{ className?: string }>> = {
  en: US,
  de: DE,
  lt: LT,
  ru: RU,
};

/**
 * Simple language switcher with flag button and dropdown list of locales.
 *
 * @param props - Active locale and change handler.
 * @returns Language switcher control.
 */
export function LanguageSwitcher({
  locale,
  onChangeLocale,
}: LanguageSwitcherProps) {
  const t = useTranslations("LanguageSwitcher");
  const FlagIcon = localeToFlag[locale] ?? DE;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const pathWithoutLocale = (() => {
    const segments = pathname.split("/");
    if (segments.length > 2) {
      return `/${segments.slice(2).join("/")}`;
    }
    return "";
  })();

  function handleSelect(next: Locale) {
    onChangeLocale?.(next);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
        aria-label={t("label")}
        title={t("tooltip")}
      >
        <FlagIcon className="h-4 w-4 rounded-sm" aria-hidden />
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-32 rounded-md bg-[#1f1f22] border border-white/10 shadow-lg z-20">
          <ul className="py-1 text-xs text-white">
            {locales.map((loc) => (
              <li key={loc}>
                <Link
                  href={`/${loc}${pathWithoutLocale}`}
                  onClick={() => handleSelect(loc)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-white/10 ${
                    loc === locale ? "text-[#00ffab]" : ""
                  }`}
                >
                  {t(loc)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
