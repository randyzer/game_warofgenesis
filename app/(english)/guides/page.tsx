import { ArticleShell } from "@/components/article-shell";
import { getRelatedGuides, guideOverview } from "@/lib/articles";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  path: "/guides",
  title: guideOverview.metadata.title,
  description: guideOverview.metadata.description,
});

export default function GuidesPage() {
  const { Content, metadata } = guideOverview;

  return (
    <ArticleShell metadata={metadata} related={getRelatedGuides("overview", 3)}>
      <Content />
    </ArticleShell>
  );
}
