import {languageInfo, locales, localePath, type Locale} from "@/lib/i18n/locales";
import {text} from "@/lib/i18n/translate";
import type { Metadata } from "next";

import { site } from "@/lib/site-data";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
}

export function createPageMetadata({ title, description, path, locale = "en" }: PageMetadataInput): Metadata {
  const url = new URL(localePath(path,locale), site.url).toString();

  return {
    title: { absolute: title },
    description,
    keywords: ["War of Genesis", "Idle Loot", "Steam", text("Guides", locale), text("Classes", locale), text("Market", locale), "G-Coins", text("Profile", locale)],
    alternates: { canonical: url, languages: Object.fromEntries([...locales.map(value => [languageInfo[value].language,new URL(localePath(path,value),site.url).toString()]),["x-default",new URL(path,site.url).toString()]]) },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: languageInfo[locale].og,
      alternateLocale: locales.filter(value=>value !== locale).map(value=>languageInfo[value].og),
      siteName: site.name,
      images: [{
        url: new URL("/android-chrome-512x512.png", site.url).toString(),
        width: 512,
        height: 512,
        alt: text("Independent War of Genesis guide-site icon",locale),
      }],
    },
  };
}
