import { localize } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import Link from "next/link";
import { site, browseLinks } from "@/lib/site-data";
import { legalPages } from "@/lib/legal-pages";

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  return localize(<footer className="site-footer">
    <div className="footer-grid page-shell">
      <div className="footer-brand">
        <Link className="site-brand" href="/"><span>{site.shortName}</span></Link>
        <p className="footer-summary">An independent fan-made guide hub for the Steam game War of Genesis: Idle Loot. References cover the basic loop, classes, profile settings, G-Coins, communities, and Steam Market features.</p>
        <p className="footer-summary">Research checked October 9–10, 2026. Historical information is dated; this site does not claim live data or complete game coverage.</p>
        <p className="footer-summary">Site operator: {site.operator.name}. Contact: <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>.</p>
      </div>
      <div><h2 className="footer-heading">Start reading</h2><ul className="footer-links">{browseLinks.slice(0, 3).map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></div>
      <div><h2 className="footer-heading">Official entries</h2><ul className="footer-links">
        <li><a href={site.links.steam}>Steam game page</a></li><li><a href={site.links.news}>Official news</a></li><li><a href={site.links.discord}>Official Discord invite</a></li><li><a href={site.links.x}>Official X account</a></li><li><a href={site.links.community}>Steam Community</a></li><li><a href={site.links.support}>Game customer support</a></li>
      </ul></div>
      <div><h2 className="footer-heading">More references</h2><ul className="footer-links">{browseLinks.slice(3).map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></div>
    </div>
    <div className="footer-bottom page-shell"><span>War of Genesis · Independent guide hub</span><span>Not affiliated with New Normal Soft Inc., Steam, or Valve.</span><nav className="legal-links" aria-label="Site policies">{legalPages.map(page => <a key={page.path} href={page.path}>{page.title}</a>)}</nav></div>
  </footer>,locale);
}
