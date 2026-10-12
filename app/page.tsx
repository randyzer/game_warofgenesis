import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { ButtonLink } from "@/components/button-link";
import { FaqList } from "@/components/faq-list";
import { SectionHeading } from "@/components/section-heading";
import { WikiCard } from "@/components/wiki-card";
import { guideArticles } from "@/lib/articles";
import { createPageMetadata } from "@/lib/page-metadata";
import { browseLinks, categoryCards, homeFaqs, popular, quickSteps, site, stats, updates } from "@/lib/site-data";

export const metadata = createPageMetadata({
  path: "/",
  title: site.title,
  description: site.description,
});
const quickFacts = [
  ["Developer", "New Normal Soft Inc."],
  ["Platform", "Steam / Windows PC"],
  ["Genre", "Desktop idle loot RPG"],
  ["Full release", "October 7, 2026"],
  ["Classes", "Knight · Ranger · Wizard"],
  ["Research checked", "October 9–10, 2026"],
] as const;

export default function HomePage() {
  return <>
    <section className="hero">
      <div className="hero-grid page-shell">
        <div className="hero-copy">
          <p className="eyebrow">Independent Fan-Made Community Wiki</p>
          <h1 className="hero-title">War of Genesis:<br /><em>Idle Loot</em></h1>
          <p className="hero-description">Turn a corner of your Windows desktop into an automatic fantasy battlefield. Understand the loot loop, explore the three classes, and check the documented Steam Market features.</p>
          <p className="hero-note">Based on research checked October 9–10, 2026. Version-sensitive advice and historical observations carry their dates.</p>
          <div className="hero-actions">
            <ButtonLink href="/guides/getting-started/">Start beginner guide</ButtonLink>
            <ButtonLink href="/guides/classes/" variant="secondary">Explore classes</ButtonLink>
          </div>
          <div className="topic-pills" aria-label="Published reference topics">
            {["Desktop idle RPG", "Knight · Ranger · Wizard", "Steam Market", "Profile & G-Coins"].map(topic => <span className="topic-pill" key={topic}>{topic}</span>)}
          </div>
        </div>
        <div className="hero-visual site-icon-panel surface-card">
          <Image alt="Independent War of Genesis guide-site icon" src="/android-chrome-512x512.png" width={256} height={256} priority />
          <p className="section-eyebrow">Steam App 4891320</p>
          <p>War of Genesis: Idle Loot</p>
          <span className="hero-note">Guide-site icon · not a gameplay screenshot</span>
        </div>
      </div>
    </section>
    <section aria-label="Verified game facts" className="page-shell">
      <dl className="stats-grid">{stats.map(stat => <div className="stat" key={stat.label}><dt className="stat-label">{stat.label}</dt><dd className="stat-value">{stat.value}</dd></div>)}</dl>
    </section>
    <AdSlot className="page-shell" />
    <section aria-labelledby="overview-heading" className="section-block page-shell" id="overview">
      <SectionHeading eyebrow="Game overview" id="overview-heading" title="What is War of Genesis: Idle Loot?" description="A Windows desktop loot RPG with automatic battles, equipment growth, and eligible-item trading." />
      <div className="overview-grid">
        <div className="overview-copy">
          <p>War of Genesis: Idle Loot is a free-to-play desktop game developed by New Normal Soft Inc. Its transparent character battles automatically while the client is running, with weapons, armor, and jewels among the drops.</p>
          <p>The official store describes Alliance Raid, World Boss, PvP Arena, and Steam Community Market trading. This hub covers the Steam game, distinct from the older Idle Heroes mobile title.</p>
          <h3>Quick facts</h3>
          <dl className="fact-list">{quickFacts.map(([label,value]) => <div className="fact-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </div>
        <div className="overview-copy surface-card reference-panel">
          <h3>Official game references</h3>
          <ul className="category-links">
            <li><a href={site.links.steam}>Steam store →</a></li>
            <li><a href={site.links.news}>Official announcements →</a></li>
            <li><a href={site.links.discord}>Officially cited Discord invite →</a></li>
            <li><a href={site.links.market}>Steam Community Market →</a></li>
          </ul>
          <p>These are source and community entry links. This site is an independent guide project.</p>
          <h3>Codes status</h3>
          <p>No active public codes for the Steam version were confirmed in the October 9, 2026 research. Codes from Idle Heroes are not used here.</p>
        </div>
      </div>
    </section>
    <section aria-labelledby="explore-heading" className="section-block page-shell" id="explore">
      <SectionHeading eyebrow="Explore the wiki" id="explore-heading" title="Find a reference by topic" description="Each linked page covers a bounded set of verified material. Unresolved builds, drop rates, and platform questions remain outside public pages." />
      <div className="category-grid">{categoryCards.map(category => <article className="category-card card-hover" id={category.id} key={category.key}><div className="card-body"><span className="category-number">{category.number}</span><h3 className="card-title">{category.title}</h3><p className="card-copy">{category.description}</p><ul className="category-links">{category.links.map(link => <li key={link.href}><Link href={link.href}>{link.label} →</Link></li>)}</ul></div></article>)}</div>
    </section>
    <section aria-labelledby="featured-guides-heading" className="section-block page-shell" id="featured-guides">
      <SectionHeading eyebrow="Start here" id="featured-guides-heading" title="Core references for your first questions" description="Begin with the basic loop, the three class names, and the documented purchase and profile features." />
      <div className="guide-grid">{["getting-started","classes","profile","in-app-purchases","market","market-buying"].map(slug => guideArticles.find(article => article.metadata.slug === slug)).filter(article => article !== undefined).map(article => <WikiCard article={article} key={article.metadata.slug} />)}</div>
    </section>
    <section aria-labelledby="updates-heading" className="section-block page-shell" id="updates">
      <SectionHeading eyebrow="Dated official announcements" id="updates-heading" title="Release and interface changes" description="Selected historical announcements from the research snapshot, linking to official Steam news. This is not a live update feed." />
      <ul className="update-grid">{updates.map(update => <li key={update.title}><a className="update-row" href={update.href}><span><span className="row-kicker">{update.category}</span><strong>{update.title}</strong></span><time dateTime={update.date}>{update.date}</time></a></li>)}</ul>
    </section>
    <section aria-labelledby="reading-heading" className="section-block page-shell" id="reading">
      <SectionHeading eyebrow="Suggested reading" id="reading-heading" title="Choose the next reference" description="Editorial reading order, based on topic; no popularity ranking is implied." />
      <ol className="popular-list">{popular.map(item => <li key={item.href}><Link className="popular-row" href={item.href}><span className="popular-number">{item.number}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span></Link></li>)}</ol>
    </section>
    <section aria-labelledby="quick-start-heading" className="section-block page-shell" id="quick-start">
      <SectionHeading eyebrow="Your starting point" id="quick-start-heading" title="Four questions to orient your reading" />
      <ol className="quick-grid">{quickSteps.map(step => <li className="step-item" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
    </section>
    <section aria-labelledby="browse-heading" className="section-block page-shell" id="browse">
      <SectionHeading eyebrow="All published references" id="browse-heading" title="Browse by the question you have" />
      <nav aria-labelledby="browse-heading" className="browse-grid">{browseLinks.map(link => <Link className="browse-link" href={link.href} key={link.label}>{link.label}</Link>)}</nav>
    </section>
    <div className="section-block page-shell" id="faq"><FaqList faqs={homeFaqs} idPrefix="home" /></div>
    <section aria-labelledby="home-cta-heading" className="home-cta page-shell">
      <p className="section-eyebrow">War of Genesis: Idle Loot</p>
      <h2 id="home-cta-heading">Make your next question easier to answer</h2>
      <p>Start with the beginner reference, read the documented systems, and use the official Steam page for the game itself.</p>
      <div className="hero-actions"><ButtonLink href="/guides/getting-started/">Read the beginner guide</ButtonLink><ButtonLink href={site.links.steam} variant="secondary">Open game on Steam</ButtonLink></div>
    </section>
  </>;
}
