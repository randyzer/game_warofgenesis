import { LegalPage } from "@/components/legal-page";
import Link from "next/link";
import { localize } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import { legalPages } from "@/lib/legal-pages";
import { site } from "@/lib/site-data";

const page = legalPages[0];


export function PrivacyPage({ locale = "en" }: { locale?: Locale }) {
  return localize(<LegalPage locale={locale} title={page.title}>
    <p>{site.name} is an independent fan-made reference website operated by {site.operator.name}. This notice describes the website’s contact channel, analytics, advertising, and infrastructure.</p>
    <h2>Reading and contacting the site</h2>
    <p>You can read the articles without a site account. This website does not offer an on-site account, comment system, or contact form. If you email the operator, your address, message, and any attachments are sent through email services, rather than a form on this website.</p>
    <h2>Analytics and advertising</h2>
    <p>The production website loads Google Analytics 4 for site analytics and Adsterra for advertising. These services load automatically; this site does not provide a cookie consent prompt or preference control. Their scripts may process information about browser activity and use cookies or other browser storage. This notice does not describe that processing as completely anonymous.</p>
    <p>Adsterra advertising is displayed on content pages. Privacy, Cookie Policy, and Terms pages do not load the advertising script. Google Analytics 4 also runs on these policy pages. Local and preview origins do not load either service.</p>
    <h2>Hosting and network services</h2>
    <p>The website uses Vercel hosting and Cloudflare for its domain and network setup. Requests to the website pass through the services configured for delivery. This website does not promise that infrastructure providers keep no request records.</p>
    <h2>Retention and questions about data</h2>
    <p>The operator has set a 30-day retention policy for Vercel and Cloudflare website request logs and for contact emails. The retention and deletion settings in those services and the email account have not yet been independently verified. This policy does not specify retention periods for data processed separately by Google Analytics 4 or Adsterra.</p>
    <p>Contact the operator with questions about a message you have sent or records associated with your visit. Do not include a password, account token, or payment information in a site inquiry.</p>
    <h2>External destinations and browser controls</h2>
    <p>Links to Steam, Discord, X, and other services take you outside this guide hub. Their sites and services operate separately. Your browser provides controls for cookies and storage; see the <Link href="/cookies">Cookie Policy</Link> for this site’s loading arrangement.</p>
    <h2>Contact and changes</h2>
    <p>Contact {site.operator.name} at <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>. This notice should be updated when the site’s services or handling arrangements change; the date above identifies this version.</p>
  </LegalPage>, locale);
}
