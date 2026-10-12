import { LegalPage } from "@/components/legal-page";
import Link from "next/link";
import { localize } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import { legalPages } from "@/lib/legal-pages";
import { site } from "@/lib/site-data";

const page = legalPages[2];


export function TermsPage({ locale = "en" }: { locale?: Locale }) {
  return localize(<LegalPage locale={locale} title={page.title}>
    <h2>Independent reference site</h2>
    <p>{site.name} is an independent fan-made guide hub operated by {site.operator.name}. It is not affiliated with New Normal Soft Inc., Steam, or Valve. References to a game or platform identify the subject of the articles and do not imply endorsement.</p>
    <h2>Information and updates</h2>
    <p>Articles describe a limited set of researched references. Historical announcements and version-sensitive observations retain their dates. The site does not claim complete game coverage or provide a live feed of prices, player counts, or updates. Check the relevant official source and the current game interface before relying on version-sensitive information.</p>
    <h2>External destinations</h2>
    <p>Some links take you to third-party services, including official game and platform pages. Those destinations operate separately from this guide hub. Game purchases, account support, and trading take place on the relevant third-party service rather than through this website.</p>
    <h2>Contact and corrections</h2>
    <p>For site questions or to report an error in an article, contact {site.operator.name} at <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>. Include the page address and the information you would like reviewed. For game account or purchase support, use the official support channel linked on the site.</p>
    <h2>Privacy and browser storage</h2>
    <p>Read the <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link> for the website’s contact, analytics, and advertising arrangements.</p>
  </LegalPage>, locale);
}
