import type { Metadata } from "next";
import { Figtree, Oxanium } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteServices } from "@/components/site-services";

import { site } from "@/lib/site-data";

import "@/app/globals.css";
import type { Locale } from "@/lib/i18n/locales";
import { languageInfo } from "@/lib/i18n/locales";
import { text } from "@/lib/i18n/translate";

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | WoG Wiki" },
  description: site.description,
  keywords: ["War of Genesis", "Idle Loot", "Steam", "wiki", "classes", "market", "G-Coins", "Profile"],
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }, { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: { title: site.title, description: site.description, type: "website", locale: "en_US" },
};

interface RootLayoutProps {
  children: ReactNode;
  locale?: Locale;
}

export function SiteLayout({ children, locale = "en" }: RootLayoutProps) {
  return (
    <html lang={languageInfo[locale].language}>
      <body className={`${figtree.variable} ${oxanium.variable}`}>
        <a className="skip-link" href="#main-content">
          {text("Skip to content", locale)}
        </a>
        <SiteHeader locale={locale} />
        <main id="main-content">{children}</main>
        <SiteServices />
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
