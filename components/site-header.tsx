import Link from "next/link";

import { ButtonLink } from "@/components/button-link";
import {
  MobileMenu,
  type MobileMenuLink,
} from "@/components/mobile-menu";
import { guideArticles } from "@/lib/articles";
import { site } from "@/lib/site-data";

const guideLinks: readonly MobileMenuLink[] = guideArticles.slice(0, 6).map(
  ({ metadata }) => ({
    href: `/guides/${metadata.slug}/`,
    label: metadata.title,
  }),
);

const exploreLinks: readonly MobileMenuLink[] = [
  { href: "/#classes", label: "Classes" },
  { href: "/#market", label: "Market" },
  { href: "/#updates", label: "Updates" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Link aria-label={`${site.name} home`} className="site-brand" href="/">
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
          <span className="language-label">EN</span>
          <ButtonLink href="/guides/getting-started/">Start reading</ButtonLink>
        </div>

        <MobileMenu exploreLinks={exploreLinks} guideLinks={guideLinks} />
      </div>
    </header>
  );
}
