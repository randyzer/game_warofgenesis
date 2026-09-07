import { describe, expect, it } from "vitest";

import {
  buildArticleSchema,
  buildBaseSeoGraph,
  buildBreadcrumbSchema,
  buildBreadcrumbTrail,
  buildCanonicalUrl,
  buildRobotsTxt,
  getSitemapRoutes,
  serializeJsonLd,
} from "../src/core/seo";
import {
  enabledPageCatalog,
  pageInventory,
  siteConfig,
} from "../src/core/site-data";

const homePage = pageInventory.find((page) => page.pageId === "home")!;
const guideHub = pageInventory.find((page) => page.pageId === "hub.guides")!;
const guidePage = pageInventory.find(
  (page) => page.pageId === "guide.getting-started",
)!;
const guideCatalog = [homePage, guideHub, guidePage];

describe("technical SEO helpers", () => {
  it("selects only enabled, indexable routes for the sitemap", () => {
    expect(getSitemapRoutes(enabledPageCatalog)).toEqual(
      enabledPageCatalog
        .filter((page) => page.indexability === "index")
        .map((page) => page.route),
    );
  });

  it("builds canonical HTTPS URLs from inventory routes", () => {
    expect(buildCanonicalUrl(siteConfig, guideHub.route)).toBe(
      new URL(guideHub.route, siteConfig.site.url).href,
    );
  });

  it("derives breadcrumbs only from enabled route ancestors", () => {
    expect(buildBreadcrumbTrail(siteConfig, guidePage, guideCatalog)).toEqual([
      {
        name: siteConfig.brand.name,
        url: new URL(homePage.route, siteConfig.site.url).href,
      },
      {
        name: guideHub.title,
        url: new URL(guideHub.route, siteConfig.site.url).href,
      },
      {
        name: guidePage.title,
        url: new URL(guidePage.route, siteConfig.site.url).href,
      },
    ]);
  });

  it("builds one accurate base graph and page-specific schema nodes", () => {
    const trail = buildBreadcrumbTrail(siteConfig, guidePage, guideCatalog);
    const graph = [
      ...buildBaseSeoGraph(siteConfig, guidePage),
      buildBreadcrumbSchema(
        buildCanonicalUrl(siteConfig, guidePage.route),
        trail,
      ),
      buildArticleSchema(siteConfig, guidePage),
    ];

    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
      "BreadcrumbList",
      "Article",
    ]);
    expect(new Set(graph.flatMap((node) => node["@id"] ?? []))).toHaveLength(5);
    expect(graph.at(-1)).not.toHaveProperty("image");
  });

  it("serializes JSON-LD without allowing a script-closing sequence", () => {
    expect(serializeJsonLd({ value: "</script><script>alert(1)</script>" }))
      .not.toContain("</script>");
  });

  it("generates robots text from the configured production URL", () => {
    expect(buildRobotsTxt(siteConfig)).toBe(
      `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.site.url}/sitemap-index.xml\n`,
    );
  });
});
