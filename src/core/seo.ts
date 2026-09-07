import type { GameConfig } from "../config/schema";
import type { PageInventoryEntry } from "../data/schemas/page-inventory";

export type StructuredDataNode = Record<string, unknown> & {
  "@type": string;
  "@id"?: string;
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildCanonicalUrl(config: GameConfig, route: string): string {
  return new URL(route, config.site.url).href;
}

export function getSitemapRoutes(pages: PageInventoryEntry[]): string[] {
  return pages
    .filter((page) => page.indexability === "index")
    .map((page) => page.route);
}

export function buildBreadcrumbTrail(
  config: GameConfig,
  page: PageInventoryEntry,
  catalog: PageInventoryEntry[],
): BreadcrumbItem[] {
  const ancestors = catalog
    .filter(
      (candidate) =>
        candidate.route !== page.route &&
        candidate.route !== "/404.html" &&
        page.route.startsWith(candidate.route),
    )
    .sort((left, right) => left.route.length - right.route.length);

  return [...ancestors, page].map((candidate) => ({
    name:
      candidate.pageType === "home" ? config.brand.name : candidate.title,
    url: buildCanonicalUrl(config, candidate.route),
  }));
}

export function buildBaseSeoGraph(
  config: GameConfig,
  page: PageInventoryEntry,
): StructuredDataNode[] {
  const siteUrl = buildCanonicalUrl(config, "/");
  const canonical = buildCanonicalUrl(config, page.route);

  return [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: config.brand.name,
      url: siteUrl,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: config.brand.name,
      description: config.seo.defaultDescription,
      inLanguage: config.site.locale,
      publisher: { "@id": `${siteUrl}#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: page.title,
      description: page.description,
      datePublished: page.publishedAt,
      dateModified: page.updatedAt,
      inLanguage: config.site.locale,
      isPartOf: { "@id": `${siteUrl}#website` },
    },
  ];
}

export function buildBreadcrumbSchema(
  canonical: string,
  trail: BreadcrumbItem[],
): StructuredDataNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildArticleSchema(
  config: GameConfig,
  page: PageInventoryEntry,
): StructuredDataNode {
  const siteUrl = buildCanonicalUrl(config, "/");
  const canonical = buildCanonicalUrl(config, page.route);

  return {
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: page.title,
    description: page.description,
    datePublished: page.publishedAt,
    dateModified: page.updatedAt,
    inLanguage: config.site.locale,
    mainEntityOfPage: { "@id": `${canonical}#webpage` },
    author: { "@id": `${siteUrl}#organization` },
    publisher: { "@id": `${siteUrl}#organization` },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export function buildRobotsTxt(config: GameConfig): string {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("/sitemap-index.xml", config.site.url).href}`,
    "",
  ].join("\n");
}
