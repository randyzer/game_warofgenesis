import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { FaqList } from "@/components/faq-list";
import { TableOfContents } from "@/components/table-of-contents";
import { WikiCard } from "@/components/wiki-card";
import type { ArticleMetadata, ArticleRecord } from "@/lib/articles";

interface ArticleShellProps {
  metadata: ArticleMetadata;
  children: ReactNode;
  related: readonly ArticleRecord[];
}

const publishedDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

function formatPublishedDate(value: string): string {
  return publishedDateFormatter.format(new Date(`${value}T00:00:00.000Z`));
}

export function ArticleShell({
  metadata,
  children,
  related,
}: ArticleShellProps) {
  const relatedHeadingId = `${metadata.slug}-related-guides-title`;

  return (
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
              Published {formatPublishedDate(metadata.publishedAt)}
            </time>
          </p>
        </header>

        <div className="article-cover">
          <Image
            src={metadata.cover}
            alt={metadata.coverAlt}
            width={1600}
            height={900}
            sizes="(max-width: 1272px) calc(100vw - 2rem), 1240px"
            priority
          />
        </div>

        <div className="article-reading-grid">
          <div className="article-main prose-wiki">{children}</div>
          <TableOfContents sections={metadata.sections} />
        </div>

        <FaqList faqs={metadata.faqs} idPrefix={`${metadata.slug}-faq`} />

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
                <WikiCard article={article} key={article.metadata.slug} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
