import type { MetadataRoute } from "next";

import { guideArticles } from "@/lib/articles";
import { site } from "@/lib/site-data";
import { legalPages } from "@/lib/legal-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/guides", ...guideArticles.map(({ metadata }) => `/guides/${metadata.slug}`), ...legalPages.map(({ path }) => path)]
    .map((path) => ({ url: new URL(path, site.url).toString() }));
}
