import Link from "next/link";

import { ButtonLink } from "@/components/button-link";
import {
  MobileMenu,
  type MobileMenuLink,
} from "@/components/mobile-menu";
import { guideArticles } from "@/lib/articles";

const guideLinks: readonly MobileMenuLink[] = guideArticles.map(
  ({ metadata }) => ({
    href: `/guides/${metadata.slug}/`,
    label: metadata.title,
  }),
);

const exploreLinks: readonly MobileMenuLink[] = [
  { href: "/#crews", label: "Crews" },
  { href: "/#loadouts", label: "Loadouts" },
  { href: "/#expeditions", label: "Expeditions" },
  { href: "/#dispatches", label: "Dispatches" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Link aria-label="Emberdeep Codex home" className="site-brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            <span className="brand-mark__spark" />
          </span>
          <span>Emberdeep Codex</span>
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
          <ButtonLink href="/guides/how-to-play/">Open field guide</ButtonLink>
        </div>

        <MobileMenu exploreLinks={exploreLinks} guideLinks={guideLinks} />
      </div>
    </header>
  );
}
