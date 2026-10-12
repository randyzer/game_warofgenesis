"use client";

import { usePathname } from "next/navigation";
import { languageInfo, locales, localePath, type Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher({ locale, className = "" }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const label = { en: "Language", ko: "언어", ja: "言語", "pt-br": "Idioma", "zh-hant": "語言" }[locale];
  return <label className={`language-switcher ${className}`}>
    <span className="sr-only">{label}</span>
    <select aria-label={label} value={locale} onChange={(event) => {
      // Changing root layouts requires a document navigation; retain section and query.
      const destination = localePath(pathname, event.target.value as Locale);
      window.location.assign(destination + window.location.search + window.location.hash);
    }}>
      {locales.map(value => <option key={value} value={value} lang={languageInfo[value].language}>{languageInfo[value].label}</option>)}
    </select>
  </label>;
}
