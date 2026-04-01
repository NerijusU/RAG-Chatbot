import type { Metadata } from "next";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
import { getLocale } from "next-intl/server";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NK Studio AI Assistant",
  description:
    "Salon assistant for NK Studio — services, pricing, and booking help.",
  icons: {
    icon: [{ url: "/brand/nk-studio-logo.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const detected = await getLocale().catch(() => defaultLocale);
  const activeLocale: Locale = isValidLocale(detected)
    ? detected
    : defaultLocale;

  return (
    <html
      lang={activeLocale}
      className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
