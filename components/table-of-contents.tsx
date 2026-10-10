import type { ArticleSection } from "@/lib/articles";

interface TableOfContentsProps {
  sections: readonly ArticleSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  return (
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
  );
}
