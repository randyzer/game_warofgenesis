import { describe, expect, it } from "vitest";

import {
  collectBuildHtmlAuditErrors,
  collectReferencedAssetPaths,
} from "../src/core/html-audit";
import {
  enabledPageCatalog,
  getPageByRoute,
  siteConfig,
} from "../src/core/site-data";
import type { PageInventoryEntry } from "../src/data/schemas/page-inventory";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function validHtml(page: PageInventoryEntry, links: string[] = ["/"]) {
  const canonical = new URL(page.route, siteConfig.site.url).href;
  const robots =
    page.indexability === "index"
      ? "index, follow, max-image-preview:large"
      : "noindex, nofollow";
  const pagefind = page.indexability === "index" ? " data-pagefind-body" : "";

  return `<!doctype html>
    <html lang="en">
      <head>
        <title>${escapeHtml(page.title)}</title>
        <meta name="description" content="${escapeHtml(page.description)}">
        <meta name="robots" content="${robots}">
        <link rel="canonical" href="${canonical}">
        <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebPage"}]}</script>
        <link rel="stylesheet" href="/_astro/site.css">
      </head>
      <body><main${pagefind}><h1>${escapeHtml(page.title)}</h1>${links.map((link) => `<a href="${link}">Link</a>`).join("")}<img src="/fixture.png" alt="Fixture"></main></body>
    </html>`;
}

function validCatalogHtml() {
  const indexableRoutes = enabledPageCatalog
    .filter((page) => page.indexability === "index")
    .map((page) => page.route);

  return new Map(
    enabledPageCatalog.map((page) => [
      page.route,
      validHtml(page, page.route === "/" ? indexableRoutes : ["/"]),
    ]),
  );
}

describe("generated HTML audit", () => {
  it("accepts a complete catalog with valid metadata and internal links", () => {
    expect(
      collectBuildHtmlAuditErrors({
        config: siteConfig,
        pages: enabledPageCatalog,
        htmlByRoute: validCatalogHtml(),
      }),
    ).toEqual([]);
  });

  it("reports page-level SEO, accessibility, and schema failures", () => {
    const page = getPageByRoute("/about/");
    const invalidHtml = validHtml(page)
      .replace(`<title>${page.title}</title>`, "<title></title>")
      .replace(page.description, "Wrong description")
      .replace('rel="canonical"', 'rel="alternate"')
      .replace("index, follow, max-image-preview:large", "noindex, nofollow")
      .replace("<h1", "<h2")
      .replace("</h1>", "</h2>")
      .replace('{"@context":"https://schema.org"', "{invalid")
      .replace(' alt="Fixture"', "")
      .replace('href="/"', 'href="/missing/"')
      .replace(" data-pagefind-body", "");
    const errors = collectBuildHtmlAuditErrors({
      config: siteConfig,
      pages: [page],
      htmlByRoute: new Map([[page.route, invalidHtml]]),
    }).join("\n");

    expect(errors).toMatch(/title/i);
    expect(errors).toMatch(/description/i);
    expect(errors).toMatch(/canonical/i);
    expect(errors).toMatch(/robots/i);
    expect(errors).toMatch(/one h1/i);
    expect(errors).toMatch(/json-ld/i);
    expect(errors).toMatch(/pagefind/i);
    expect(errors).toMatch(/alt/i);
    expect(errors).toMatch(/missing/i);
  });

  it("keeps global image alt validation for logo and non-media images", () => {
    const page = getPageByRoute("/");
    const invalidLogoHtml = validHtml(page).replace(
      '<img src="/fixture.png" alt="Fixture">',
      '<img class="brand__logo" src="/logo.svg">',
    );

    const errors = collectBuildHtmlAuditErrors({
      config: siteConfig,
      pages: [page],
      htmlByRoute: new Map([[page.route, invalidLogoHtml]]),
    }).join("\n");

    expect(errors).toMatch(/Every image must declare an alt attribute/i);
  });

  it("reports duplicate metadata and orphaned indexable pages", () => {
    const home = getPageByRoute("/");
    const about = getPageByRoute("/about/");
    const duplicateAbout = {
      ...about,
      title: home.title,
      description: home.description,
    };
    const errors = collectBuildHtmlAuditErrors({
      config: siteConfig,
      pages: [home, duplicateAbout],
      htmlByRoute: new Map([
        [home.route, validHtml(home, ["/"])],
        [duplicateAbout.route, validHtml(duplicateAbout, ["/"])],
      ]),
    }).join("\n");

    expect(errors).toMatch(/duplicate title/i);
    expect(errors).toMatch(/duplicate description/i);
    expect(errors).toMatch(/orphaned.*about/i);
  });

  it("collects only local build assets referenced by HTML", () => {
    expect(
      collectReferencedAssetPaths(`
        <link rel="stylesheet" href="/_astro/site.css">
        <script src="/_astro/app.js"></script>
        <astro-island component-url="/_astro/island.js" renderer-url="/_astro/client.js"></astro-island>
        <script src="https://cdn.example/app.js"></script>
      `),
    ).toEqual([
      "/_astro/app.js",
      "/_astro/client.js",
      "/_astro/island.js",
      "/_astro/site.css",
    ]);
  });
});
