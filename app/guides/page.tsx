import type { Metadata } from "next";

import { ArticleShell } from "@/components/article-shell";
import { guideArticles, guideOverview } from "@/lib/articles";

export const metadata: Metadata = {
  title: guideOverview.metadata.title,
  description: guideOverview.metadata.description,
};

export default function GuidesPage() {
  const { Content, metadata } = guideOverview;

  return (
    <ArticleShell metadata={metadata} related={guideArticles.slice(0, 6)}>
      <Content />
    </ArticleShell>
  );
}
