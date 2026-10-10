import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/button-link";
import { FaqList } from "@/components/faq-list";
import { SectionHeading } from "@/components/section-heading";
import { WikiCard } from "@/components/wiki-card";
import { guideArticles } from "@/lib/articles";
import {
  browseLinks,
  categoryCards,
  homeFaqs,
  popular,
  quickSteps,
  stats,
  updates,
} from "@/lib/site-data";

export const metadata: Metadata = {
  title: "A Field Guide to Emberdeep",
  description:
    "Plan stronger crews, read underground routes, and make every Emberdeep descent count with a free independent field guide.",
};

const quickFacts = [
  ["Studio", "Northlamp Guild"],
  ["Platform", "Desktop overlay"],
  ["Genre", "Idle expedition RPG"],
  ["Structure", "Five underground layers"],
  ["Session style", "Short check-ins"],
  ["Access", "Free field manual"],
] as const;

const topicPills = [
  "Layer routes",
  "Crew rotation",
  "Gear forging",
  "Expedition planning",
  "Field notes",
] as const;

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-grid page-shell">
          <div className="hero-copy">
            <p className="eyebrow">Free field guide · Independent project</p>
            <h1 className="hero-title">
              Chart a safer path into
              <br />
              <em>Emberdeep</em>
            </h1>
            <p className="hero-description">
              A practical codex for reading underground routes, building steady
              crews, and keeping every expedition supplied for the return.
            </p>
            <p className="hero-note">
              Learn one system at a time, then carry the useful parts into your
              next short check-in below the firelight.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/guides/getting-started/">
                Start exploring
              </ButtonLink>
              <ButtonLink href="/guides/" variant="secondary">
                Open field guide
              </ButtonLink>
            </div>
            <div className="topic-pills" aria-label="Topics covered">
              {topicPills.map((topic) => (
                <span className="topic-pill" key={topic}>
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <Image
              alt="Amber and green expedition interface showing an underground excavation grid, route telemetry, and crew status"
              height={900}
              priority
              sizes="(max-width: 767px) calc(100vw - 24px), (max-width: 1240px) 52vw, 690px"
              src="/illustrations/hero-grid.svg"
              width={1600}
            />
          </div>
        </div>
      </section>

      <section aria-label="Field guide statistics" className="page-shell">
        <dl className="stats-grid">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <dt className="stat-label">{stat.label}</dt>
              <dd className="stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="overview-heading"
        className="section-block page-shell"
        id="overview"
      >
        <SectionHeading
          description="The expedition keeps moving while you are away. Return for brief decisions about routes, recovery, equipment, and what the next descent should prove."
          eyebrow="Game overview"
          id="overview-heading"
          title="What Emberdeep actually is"
        />
        <div className="overview-grid">
          <div className="overview-visual">
            <Image
              alt="Survey map tracing a route through five underground zones with progress nodes and expedition notes"
              height={900}
              sizes="(max-width: 767px) calc(100vw - 24px), (max-width: 1240px) 52vw, 650px"
              src="/illustrations/map-panel.svg"
              width={1600}
            />
          </div>
          <div className="overview-copy">
            <p>
              Emberdeep is a fictional idle expedition RPG about preparing a
              crew, reading uncertain signals, and choosing when enough progress
              is worth the journey home. Its systems reward clear plans more
              than constant attention.
            </p>
            <h3>Quick facts</h3>
            <dl className="fact-list">
              {quickFacts.map(([label, value]) => (
                <div className="fact-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="explore-heading"
        className="section-block page-shell"
        id="explore"
      >
        <SectionHeading
          description="Move from the broad field manual to the exact system standing between your crew and a clean return."
          eyebrow="Explore the codex"
          id="explore-heading"
          title="Hubs for the systems that shape every descent"
        />
        <div className="category-grid">
          {categoryCards.map((category) => (
            <article
              className="category-card card-hover"
              id={category.id}
              key={category.key}
            >
              <div className="card-body">
                <span className="category-number">{category.number}</span>
                <h3 className="card-title">{category.title}</h3>
                <p className="card-copy">{category.description}</p>
                <ul className="category-links">
                  {category.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label} →</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="featured-guides-heading"
        className="section-block page-shell"
        id="featured-guides"
      >
        <SectionHeading
          description="Six focused references cover the first route, the working overlay, crew roles, equipment choices, and the decision to go deeper."
          eyebrow="Featured guides"
          id="featured-guides-heading"
          title="Start here before your first descent"
        />
        <div className="guide-grid">
          {guideArticles.map((article) => (
            <WikiCard article={article} key={article.metadata.slug} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="dispatches-heading"
        className="section-block page-shell"
        id="dispatches"
      >
        <SectionHeading
          description="The latest clarifications and additions to this independent field manual."
          eyebrow="Latest updates"
          id="dispatches-heading"
          title="Fresh notes from the survey desk"
        />
        <ul className="update-grid">
          {updates.map((update) => (
            <li key={update.title}>
              <Link className="update-row" href={update.href}>
                <span>
                  <span className="row-kicker">{update.category}</span>
                  <strong>{update.title}</strong>
                </span>
                <time dateTime={update.date}>{update.date}</time>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="popular-heading"
        className="section-block page-shell"
        id="popular"
      >
        <SectionHeading
          eyebrow="Popular right now"
          id="popular-heading"
          title="Field pages captains return to"
        />
        <ol className="popular-list">
          {popular.map((item) => (
            <li key={item.href}>
              <Link className="popular-row" href={item.href}>
                <span className="popular-number">{item.number}</span>
                <strong>{item.label}</strong>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="quick-start-heading"
        className="section-block page-shell"
        id="quick-start"
      >
        <SectionHeading
          description="A compact routine for turning the manual into useful decisions before, during, and after a descent."
          eyebrow="Quick start"
          id="quick-start-heading"
          title="Five steps from map to return"
        />
        <ol className="quick-grid">
          {quickSteps.map((step) => (
            <li className="step-item" key={step.number}>
              <span className="step-number">{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="browse-heading"
        className="section-block page-shell"
        id="browse"
      >
        <SectionHeading
          eyebrow="Browse everything"
          id="browse-heading"
          title="Choose the next page by problem"
        />
        <nav aria-labelledby="browse-heading" className="browse-grid">
          {browseLinks.map((link) => (
            <Link className="browse-link" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
      </section>

      <div className="section-block page-shell" id="faq">
        <FaqList faqs={homeFaqs} idPrefix="home" />
      </div>

      <section
        aria-labelledby="home-cta-heading"
        className="home-cta page-shell"
      >
        <p className="section-eyebrow">The next descent can be clearer</p>
        <h2 id="home-cta-heading">Ready to keep the lanterns burning?</h2>
        <p>
          Start with the first route, build a crew that can return, and let each
          expedition answer one useful question.
        </p>
        <ButtonLink href="/guides/getting-started/">
          Start with the beginner guide
        </ButtonLink>
      </section>
    </>
  );
}
