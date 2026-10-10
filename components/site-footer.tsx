import Link from "next/link";

import { guideArticles } from "@/lib/articles";

const exploreLinks = [
  { href: "/#crews", label: "Crews" },
  { href: "/#loadouts", label: "Loadouts" },
  { href: "/#expeditions", label: "Expeditions" },
  { href: "/#dispatches", label: "Dispatches" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid page-shell">
        <div className="footer-brand">
          <Link className="site-brand" href="/">
            <span aria-hidden="true" className="brand-mark">
              <span className="brand-mark__spark" />
            </span>
            <span>Emberdeep Codex</span>
          </Link>
          <p className="footer-summary">
            A field-built library for crews who want clear routes, stronger
            loadouts, and fewer surprises beyond the firelight.
          </p>
        </div>

        <div>
          <h2 className="footer-heading">Start reading</h2>
          <ul className="footer-links">
            <li>
              <Link href="/guides/getting-started/">Getting started</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Explore</h2>
          <ul className="footer-links">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Guides</h2>
          <ul className="footer-links">
            {guideArticles.map(({ metadata }) => (
              <li key={metadata.slug}>
                <Link href={`/guides/${metadata.slug}/`}>{metadata.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom page-shell">
        <span>© 2026 Emberdeep Codex</span>
        <span>
          Independent reference project. Not affiliated with any game studio or
          publisher.
        </span>
      </div>
    </footer>
  );
}
