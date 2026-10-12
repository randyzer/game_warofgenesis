import { LegalPage } from "@/components/legal-page";
import Link from "next/link";
import { localize } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import { legalPages } from "@/lib/legal-pages";
import { site } from "@/lib/site-data";

const page = legalPages[1];


export function CookiesPage({ locale = "en" }: { locale?: Locale }) {
  return localize(<LegalPage locale={locale} title={page.title}>
    <p>This page describes the browser storage and third-party loading arrangement for {site.name}.</p>
    <h2>Cookies and browser storage</h2>
    <p>Cookies and other browser storage can keep information between visits. The site’s reading features do not offer account sessions or saved preferences. That does not mean that the website’s analytics, advertising, or infrastructure services are cookie-free.</p>
    <h2>Analytics and advertisements</h2>
    <p>Google Analytics 4 and Adsterra load directly on the production website without a site consent prompt. Third-party scripts may use cookies or other storage for their analytics and advertising features. A verified list of storage identifiers and expiration periods is not provided in this notice.</p>
    <p>Google Analytics 4 runs on content and policy pages. Adsterra loads only on published content pages; it does not load on Privacy, Cookie Policy, Terms, or error pages. Both services are disabled on local and preview origins.</p>
    <h2>Your browser controls</h2>
    <p>You can use your browser’s settings to inspect, restrict, or clear cookies and other site storage. Those settings may affect third-party analytics or advertising. Clearing stored information does not itself prevent a later visit from loading the scripts again. This site does not provide a separate preference panel or claim to implement a withdrawal control.</p>
    <h2>Service changes and contact</h2>
    <p>If the site’s scripts or loading controls change, this notice should be updated to describe the actual implementation. For questions, contact {site.operator.name} at <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>. More information is provided in the <Link href="/privacy">Privacy Policy</Link>.</p>
  </LegalPage>, locale);
}
