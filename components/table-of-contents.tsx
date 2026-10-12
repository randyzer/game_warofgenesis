import { localize } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/locales";
import type { ArticleSection } from "@/lib/articles";

interface TableOfContentsProps {
  locale?: Locale;
  sections: readonly ArticleSection[];
}

export function TableOfContents({ sections, locale = "en" }: TableOfContentsProps) {
  return localize(
    <nav className="article-toc" aria-label="On this page">
      <p className="toc-title">On this page</p>
      <ul className="toc-list">
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{section.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  , locale);
}
