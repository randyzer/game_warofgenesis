"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/button-link";
import { isLocale, languageInfo } from "@/lib/i18n/locales";
import { localize } from "@/lib/i18n/translate";

const subscribe = () => () => {};

export function NotFoundContent() {
  // The global fallback is static English; choose the URL language after hydration.
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const firstSegment = usePathname()?.split("/")[1] ?? "";
  const locale = hydrated && isLocale(firstSegment) ? firstSegment : "en";
  useEffect(() => {
    document.documentElement.lang = languageInfo[locale].language;
  }, [locale]);
  return localize(
    <section className="not-found page-shell" aria-labelledby="not-found-title">
      <p className="section-eyebrow">Page not found</p>
      <h1 id="not-found-title">This reference is not available.</h1>
      <p>The requested page is not part of the published War of Genesis: Idle Loot guide hub.</p>
      <div className="not-found__actions">
        <ButtonLink locale={locale} href="/">Return home</ButtonLink>
        <ButtonLink locale={locale} href="/guides/" variant="secondary">Game overview</ButtonLink>
      </div>
    </section>, locale,
  );
}
