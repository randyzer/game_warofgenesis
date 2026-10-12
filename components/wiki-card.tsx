import { localize } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import Link from "next/link";

import type { ArticleRecord } from "@/lib/articles";

interface WikiCardProps {
  locale?: Locale;
  article: ArticleRecord;
}

export function WikiCard({ article, locale = "en" }: WikiCardProps) {
  const { metadata } = article;

  return localize(
    <article>
      <Link
        className="wiki-card card-hover"
        href={`/guides/${metadata.slug}/`}
      >
        <div className="card-body">
          <p className="card-kicker">{metadata.category}</p>
          <h3 className="card-title">{metadata.title}</h3>
          <p className="card-copy">{metadata.description}</p>
          <span className="card-link" aria-hidden="true">
            Read guide →
          </span>
        </div>
      </Link>
    </article>
  , locale);
}
