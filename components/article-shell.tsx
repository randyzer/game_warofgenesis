import { localize, text } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import Link from "next/link";
import type { ReactNode } from "react";

import { AdSlot } from "@/components/ad-slot";
import { FaqList } from "@/components/faq-list";
import { TableOfContents } from "@/components/table-of-contents";
import { WikiCard } from "@/components/wiki-card";
import type { ArticleMetadata, ArticleRecord } from "@/lib/articles";

interface ArticleShellProps {
  locale?: Locale;
  metadata: ArticleMetadata;
  children: ReactNode;
  related: readonly ArticleRecord[];
}

function formatPublishedDate(value: string, locale: Locale): string {
 const publishedDateFormatter = new Intl.DateTimeFormat(locale === "zh-hant" ? "zh-Hant" : locale === "pt-br" ? "pt-BR" : locale, {
  dateStyle: "long",
  timeZone: "UTC",
});

  return publishedDateFormatter.format(new Date(`${value}T00:00:00.000Z`));
}

export function ArticleShell({
  metadata,
  children,
  related,
  locale = "en",
}: ArticleShellProps) {
  const relatedHeadingId = `${metadata.slug}-related-guides-title`;

  return localize(
    <article className="article-document">
      <div className="page-shell">
        <header className="article-header">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <Link href="/guides/">Guides</Link>
            <span aria-current="page">{metadata.title}</span>
          </nav>

          <p className="article-category">{metadata.category}</p>
          <h1 className="article-title">{metadata.title}</h1>
          <p className="article-description">{metadata.description}</p>
          <p className="article-meta">
            <time dateTime={metadata.publishedAt}>
              {text("Published", locale)} {formatPublishedDate(metadata.publishedAt, locale)}
            </time>
          </p>
          <p className="article-meta">{text("Research last checked", locale)} <time dateTime={metadata.lastVerified}>{formatPublishedDate(metadata.lastVerified, locale)}</time>{text(". Historical claims retain their dates.", locale)}</p>
        </header>

        <AdSlot locale={locale} />

        <div className="article-reading-grid">
          <TableOfContents locale={locale} sections={metadata.sections} />
          <div className="article-main prose-wiki">{children}</div>
        </div>

        <FaqList locale={locale} faqs={metadata.faqs} idPrefix={`${metadata.slug}-faq`} />

        {related.length > 0 ? (
          <section
            className="article-related"
            aria-labelledby={relatedHeadingId}
          >
            <header className="section-heading">
              <p className="section-eyebrow">Related guides</p>
              <h2 id={relatedHeadingId}>
                Keep reading to learn more about the game.
              </h2>
            </header>
            <div className="related-grid">
              {related.map((article) => (
                <WikiCard locale={locale} article={article} key={article.metadata.slug} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  , locale);
}
