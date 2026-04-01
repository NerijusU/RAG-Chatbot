import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "NK Studio AI Assistant",
  description:
    "Salon assistant for NK Studio — services, pricing, and booking help.",
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: rawLocale } = await params;
  const activeLocale: Locale = isValidLocale(rawLocale)
    ? rawLocale
    : defaultLocale;

  const messages = (await import(`../../../messages/${activeLocale}.json`))
    .default;

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
