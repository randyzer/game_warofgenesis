import type { MarkdownHeading } from "astro";

export function selectWikiArticleHeadings(headings: MarkdownHeading[]) {
  return headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
}
