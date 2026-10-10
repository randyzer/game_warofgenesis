import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleShell } from "@/components/article-shell";
import {
  getGuideBySlug,
  getRelatedGuides,
  guideArticles,
} from "@/lib/articles";

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return guideArticles.map(({ metadata }) => ({ slug: metadata.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.metadata.title,
    description: article.metadata.description,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  if (!article) {
    notFound();
  }

  const { Content, metadata } = article;

  return (
    <ArticleShell metadata={metadata} related={getRelatedGuides(slug, 6)}>
      <Content />
    </ArticleShell>
  );
}
