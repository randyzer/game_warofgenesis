import type { GameConfig } from "../config/schema";
import type { PageInventoryEntry } from "../data/schemas/page-inventory";
import { buildCanonicalUrl } from "./seo";

interface BuildHtmlAuditInput {
  config: GameConfig;
  pages: PageInventoryEntry[];
  htmlByRoute: Map<string, string>;
}

interface HtmlPageAnalysis {
  errors: string[];
  title: string;
  description: string;
  internalRoutes: string[];
}

function decodeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
  };
  return value.replace(
    /&(amp|lt|gt|quot|#39|#x27);/gi,
    (entity) => entities[entity.toLocaleLowerCase("en")] ?? entity,
  );
}

function attributesFromTag(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of tag.matchAll(pattern)) {
    attributes.set(
      match[1].toLocaleLowerCase("en"),
      decodeHtml(match[2] ?? match[3] ?? match[4] ?? ""),
    );
  }
  return attributes;
}

function openingTags(html: string, tagName: string): string[] {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map(
    (match) => match[0],
  );
}

function tagTexts(html: string, tagName: string): string[] {
  return [
    ...html.matchAll(
      new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\/${tagName}>`, "gi"),
    ),
  ].map((match) =>
    decodeHtml(match[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()),
  );
}

function metaContent(html: string, name: string): string {
  for (const tag of openingTags(html, "meta")) {
    const attributes = attributesFromTag(tag);
    if (attributes.get("name")?.toLocaleLowerCase("en") === name) {
      return attributes.get("content") ?? "";
    }
  }
  return "";
}

function linkHref(html: string, relation: string): string {
  for (const tag of openingTags(html, "link")) {
    const attributes = attributesFromTag(tag);
    if (
      attributes
        .get("rel")
        ?.toLocaleLowerCase("en")
        .split(/\s+/)
        .includes(relation)
    ) {
      return attributes.get("href") ?? "";
    }
  }
  return "";
}

function internalRouteFromHref(
  config: GameConfig,
  currentRoute: string,
  href: string,
): string | null {
  if (!href || /^(?:mailto|tel|javascript|data):/i.test(href)) return null;

  try {
    const currentUrl = buildCanonicalUrl(config, currentRoute);
    const url = new URL(href, currentUrl);
    if (url.origin !== new URL(config.site.url).origin) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

function analyzeHtmlPage(
  config: GameConfig,
  page: PageInventoryEntry,
  html: string,
  knownRoutes: Set<string>,
): HtmlPageAnalysis {
  const errors: string[] = [];
  const title = tagTexts(html, "title")[0] ?? "";
  const description = metaContent(html, "description");
  const canonical = linkHref(html, "canonical");
  const robots = metaContent(html, "robots");
  const h1s = tagTexts(html, "h1");
  const expectedRobots =
    page.indexability === "index"
      ? "index, follow, max-image-preview:large"
      : "noindex, nofollow";

  if (title !== page.title) {
    errors.push(`[${page.route}] Title does not match Page Inventory.`);
  }
  if (description !== page.description) {
    errors.push(`[${page.route}] Meta description does not match Page Inventory.`);
  }
  if (canonical !== buildCanonicalUrl(config, page.route)) {
    errors.push(`[${page.route}] Canonical URL does not match the inventory route.`);
  }
  if (robots !== expectedRobots) {
    errors.push(`[${page.route}] Robots directive does not match indexability.`);
  }
  if (h1s.length !== 1 || !h1s[0]) {
    errors.push(`[${page.route}] Page must contain one H1, and it must be non-empty.`);
  }

  const hasPagefindBody = /\bdata-pagefind-body(?:\s|=|>)/i.test(html);
  if (page.indexability === "index" && !hasPagefindBody) {
    errors.push(`[${page.route}] Indexable page is missing data-pagefind-body.`);
  }
  if (page.indexability === "noindex" && hasPagefindBody) {
    errors.push(`[${page.route}] Noindex page must not enter the Pagefind body.`);
  }

  const jsonLdScripts = [
    ...html.matchAll(
      /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    ),
  ].filter((match) =>
    attributesFromTag(match[1]).get("type") === "application/ld+json",
  );
  if (jsonLdScripts.length === 0) {
    errors.push(`[${page.route}] Page is missing JSON-LD.`);
  }
  for (const script of jsonLdScripts) {
    try {
      JSON.parse(script[2]);
    } catch {
      errors.push(`[${page.route}] Page contains invalid JSON-LD.`);
    }
  }

  for (const imageTag of openingTags(html, "img")) {
    if (!attributesFromTag(imageTag).has("alt")) {
      errors.push(`[${page.route}] Every image must declare an alt attribute.`);
    }
  }

  const internalRoutes = openingTags(html, "a").flatMap((tag) => {
    const href = attributesFromTag(tag).get("href") ?? "";
    const route = internalRouteFromHref(config, page.route, href);
    if (!route) return [];
    if (!knownRoutes.has(route)) {
      errors.push(`[${page.route}] Internal link targets an unregistered route: ${route}`);
    }
    return [route];
  });

  return { errors, title, description, internalRoutes };
}

function duplicateValueErrors(
  analyses: Array<{ route: string; value: string }>,
  label: "title" | "description",
): string[] {
  const routesByValue = new Map<string, string[]>();
  for (const analysis of analyses) {
    if (!analysis.value) continue;
    const routes = routesByValue.get(analysis.value) ?? [];
    routes.push(analysis.route);
    routesByValue.set(analysis.value, routes);
  }

  return [...routesByValue.values()].flatMap((routes) =>
    routes.length > 1
      ? [`Duplicate ${label} used by routes: ${routes.join(", ")}`]
      : [],
  );
}

export function collectBuildHtmlAuditErrors({
  config,
  pages,
  htmlByRoute,
}: BuildHtmlAuditInput): string[] {
  const knownRoutes = new Set(pages.map((page) => page.route));
  const analyses = new Map<string, HtmlPageAnalysis>();
  const errors: string[] = [];

  for (const page of pages) {
    const html = htmlByRoute.get(page.route);
    if (!html) {
      errors.push(`[${page.route}] Generated HTML is missing.`);
      continue;
    }
    const analysis = analyzeHtmlPage(config, page, html, knownRoutes);
    analyses.set(page.route, analysis);
    errors.push(...analysis.errors);
  }

  errors.push(
    ...duplicateValueErrors(
      [...analyses].map(([route, analysis]) => ({
        route,
        value: analysis.title,
      })),
      "title",
    ),
    ...duplicateValueErrors(
      [...analyses].map(([route, analysis]) => ({
        route,
        value: analysis.description,
      })),
      "description",
    ),
  );

  const inboundRoutes = new Set<string>();
  for (const [sourceRoute, analysis] of analyses) {
    for (const targetRoute of analysis.internalRoutes) {
      if (targetRoute !== sourceRoute) inboundRoutes.add(targetRoute);
    }
  }
  for (const page of pages) {
    if (
      page.route !== "/" &&
      page.indexability === "index" &&
      !inboundRoutes.has(page.route)
    ) {
      errors.push(`Orphaned indexable route has no inbound link: ${page.route}`);
    }
  }

  return errors;
}

export function collectReferencedAssetPaths(html: string): string[] {
  const assets = new Set<string>();
  for (const tag of html.match(/<[^>]+>/g) ?? []) {
    const attributes = attributesFromTag(tag);
    for (const attribute of ["src", "href", "component-url", "renderer-url"]) {
      const value = attributes.get(attribute);
      if (value?.startsWith("/_astro/") && !value.includes("..")) {
        assets.add(value);
      }
    }
  }
  return [...assets].sort();
}
