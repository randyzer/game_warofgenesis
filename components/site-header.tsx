import { localize, text } from "@/lib/i18n/translate";
import { localePath, type Locale } from "@/lib/i18n/locales";
import Link from "next/link";

import { ButtonLink } from "@/components/button-link";
import {
  MobileMenu,
  type MobileMenuLink,
} from "@/components/mobile-menu";
import { getArticles } from "@/lib/i18n/articles";
import { LanguageSwitcher } from "@/components/language-switcher";
import { site } from "@/lib/site-data";


const exploreLinks: readonly MobileMenuLink[] = [
  { href: "/#classes", label: "Classes" },
  { href: "/#market", label: "Market" },
  { href: "/#updates", label: "Updates" },
];

export function SiteHeader({ locale = "en" }: { locale?: Locale }) {
  const { guideArticles } = getArticles(locale);
  const guideLinks = guideArticles.slice(0, 6).map(({metadata}) => ({href: `/guides/${metadata.slug}/`, label: metadata.title}));
  return localize(
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Link aria-label={`${text(site.name, locale)} · ${text("Home", locale)}`} className="site-brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            <span className="brand-mark__spark" />
          </span>
          <span>{site.shortName}</span>
        </Link>

        <nav aria-label="Primary navigation" className="desktop-nav">
          <Link href="/">Home</Link>
          <div className="nav-item">
            <Link
              className="nav-trigger"
              href="/guides/"
            >
              Guides <span aria-hidden="true">⌄</span>
            </Link>
            <div className="nav-dropdown">
              {guideLinks.map((link) => (
                <Link href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {exploreLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions desktop-only">
          <LanguageSwitcher locale={locale} />
          <ButtonLink locale={locale} href="/guides/getting-started/">Start reading</ButtonLink>
        </div>

        <LanguageSwitcher locale={locale} className="mobile-language" />
        <MobileMenu locale={locale} labels={{home: text("Home",locale), guides:text("Guides",locale), explore:text("Explore",locale), start:text("Start reading",locale), open:text("Open menu",locale), close:text("Close menu",locale), navigation:text("Mobile navigation",locale)}} exploreLinks={exploreLinks.map(link=>({href:localePath(link.href,locale),label:text(link.label,locale)}))} guideLinks={guideLinks.map(link=>({href:localePath(link.href,locale),label:link.label}))} />
      </div>
    </header>
  , locale);
}
