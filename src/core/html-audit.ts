import type { GameConfig } from "../config/schema";
import { adsConfig, type AdsConfig } from "../config/ads";
import { googleAnalyticsConfig } from "../config/analytics";
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

function duplicateAdAttributeErrors(
  route: string,
  values: string[],
  label: "placement" | "instance" | "bootstrap",
): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].map(
    (value) => `[${route}] Duplicate ad ${label} identity: ${value}`,
  );
}

interface AdWrapperStructure {
  placement: string;
  instanceIds: string[];
}

interface AdScriptStructure {
  attributes: Map<string, string>;
  insideAdWrapper: boolean;
}

interface AdHtmlStructure {
  attributes: Map<string, string>[];
  wrappers: AdWrapperStructure[];
  orphanInstanceIds: string[];
  scripts: AdScriptStructure[];
}

const voidHtmlTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function inspectAdHtmlStructure(html: string): AdHtmlStructure {
  const attributes: Map<string, string>[] = [];
  const wrappers: AdWrapperStructure[] = [];
  const orphanInstanceIds: string[] = [];
  const scripts: AdScriptStructure[] = [];
  const stack: Array<{ tagName: string; wrapper?: AdWrapperStructure }> = [];
  const structuralHtml = html.replace(
    /(<(?:script|style)\b[^>]*>)[\s\S]*?(<\/(?:script|style)\s*>)/gi,
    "$1$2",
  );

  for (const match of structuralHtml.matchAll(/<\/?([a-z][\w:-]*)\b[^>]*>/gi)) {
    const tag = match[0];
    const tagName = match[1].toLocaleLowerCase("en");
    if (/^<\//.test(tag)) {
      const openingIndex = stack.findLastIndex((entry) => entry.tagName === tagName);
      if (openingIndex >= 0) stack.splice(openingIndex);
      continue;
    }

    const tagAttributes = attributesFromTag(tag);
    attributes.push(tagAttributes);
    const activeWrapper = stack.findLast((entry) => entry.wrapper)?.wrapper;
    const instanceId = tagAttributes.get("data-ad-instance");
    if (instanceId) {
      if (activeWrapper) activeWrapper.instanceIds.push(instanceId);
      else orphanInstanceIds.push(instanceId);
    }

    const placement = tagAttributes.get("data-ad-placement");
    const wrapper = placement ? { placement, instanceIds: [] } : undefined;
    if (wrapper) wrappers.push(wrapper);
    if (tagName === "script") {
      scripts.push({ attributes: tagAttributes, insideAdWrapper: Boolean(activeWrapper) });
    }

    if (!voidHtmlTags.has(tagName) && !/\/\s*>$/.test(tag)) {
      stack.push({ tagName, wrapper });
    }
  }

  return { attributes, wrappers, orphanInstanceIds, scripts };
}

function normalizeScriptResourceIdentity(src: string): string {
  const trimmed = src.trim();
  try {
    const url = new URL(trimmed, "https://ad-audit.invalid/");
    url.hash = "";
    return url.href;
  } catch {
    return trimmed;
  }
}

function duplicateAdBootstrapResourceErrors(
  route: string,
  scripts: AdScriptStructure[],
): string[] {
  const resourceScripts = scripts.flatMap(({ attributes, insideAdWrapper }) => {
    const src = attributes.get("src")?.trim();
    if (!src) return [];
    return [{
      identity: normalizeScriptResourceIdentity(src),
      src,
      identifiesAdBootstrap: insideAdWrapper || attributes.has("data-ad-bootstrap"),
    }];
  });
  const adBootstrapResources = new Set(
    resourceScripts
      .filter((script) => script.identifiesAdBootstrap)
      .map((script) => script.identity),
  );

  return [...adBootstrapResources].flatMap((identity) => {
    const matches = resourceScripts.filter((script) => script.identity === identity);
    return matches.length > 1
      ? [`[${route}] Duplicate ad bootstrap resource identity: ${matches[0].src}`]
      : [];
  });
}

export function collectAdHtmlAuditErrors(
  htmlByRoute: Map<string, string>,
  config: AdsConfig<string>,
): string[] {
  const errors: string[] = [];

  for (const [route, html] of htmlByRoute) {
    const structure = inspectAdHtmlStructure(html);
    const { attributes, wrappers, orphanInstanceIds, scripts } = structure;
    const hasAdOutput = attributes.some((tag) =>
      [...tag.keys()].some((name) => name.startsWith("data-ad-")),
    );

    if (!config.enabled) {
      if (hasAdOutput) {
        errors.push(`[${route}] Globally disabled ads emitted ad-specific output.`);
      }
      continue;
    }

    for (const tag of attributes) {
      if (
        [...tag.keys()].some((name) =>
          /^data-ad-(?:api-key|secret|token|password|private-key)$/i.test(name),
        )
      ) {
        errors.push(`[${route}] Ad output contains a private credential attribute.`);
      }
    }

    const placements = wrappers.map((wrapper) => wrapper.placement);
    const instances = attributes.flatMap((tag) => {
      const value = tag.get("data-ad-instance");
      return value ? [value] : [];
    });
    const bootstraps = attributes.flatMap((tag) => {
      const value = tag.get("data-ad-bootstrap");
      return value ? [value] : [];
    });

    errors.push(
      ...duplicateAdAttributeErrors(route, placements, "placement"),
      ...duplicateAdAttributeErrors(route, instances, "instance"),
      ...duplicateAdAttributeErrors(route, bootstraps, "bootstrap"),
      ...duplicateAdBootstrapResourceErrors(route, scripts),
    );

    for (const wrapper of wrappers) {
      const definition = config.placements[wrapper.placement];
      if (!definition?.enabled) {
        errors.push(
          `[${route}] Ad placement is not enabled in config: ${wrapper.placement}`,
        );
      }
      if (wrapper.instanceIds.length !== 1) {
        errors.push(
          `[${route}] Ad placement ${wrapper.placement} requires exactly one provider instance; found ${wrapper.instanceIds.length}.`,
        );
      } else if (
        definition?.enabled &&
        wrapper.instanceIds[0] !== definition.instanceId
      ) {
        errors.push(
          `[${route}] Ad placement ${wrapper.placement} provider instance does not match configured identity: ${wrapper.instanceIds[0]}.`,
        );
      }
    }

    for (const instanceId of orphanInstanceIds) {
      errors.push(
        `[${route}] Orphan ad provider instance exists outside a semantic ad wrapper: ${instanceId}`,
      );
    }

    for (const { attributes: script, insideAdWrapper } of scripts) {
      if (
        insideAdWrapper &&
        !script.get("src")?.trim() &&
        !script.get("data-ad-bootstrap")?.trim()
      ) {
        errors.push(
          `[${route}] Inline ad bootstrap requires a stable data-ad-bootstrap identity.`,
        );
      }
    }

  }

  return errors;
}

function enabledAdBootstrapSources(config: AdsConfig<string>): Set<string> {
  if (!config.enabled) return new Set();
  return new Set(
    Object.values(config.placements).flatMap((definition) =>
      definition?.enabled && definition.provider
        ? [normalizeScriptResourceIdentity(definition.provider.scriptSrc)]
        : [],
    ),
  );
}

/**
 * External scripts stay banned by default. The only exception is a reviewed ad
 * bootstrap whose src matches an enabled placement provider and that declares a
 * data-ad-bootstrap identity, so an arbitrary third-party script still fails.
 */
export function collectExternalScriptErrors(
  route: string,
  html: string,
  config: AdsConfig<string> = adsConfig,
  analytics = googleAnalyticsConfig,
): string[] {
  const allowedAdSources = enabledAdBootstrapSources(config);
  const allowedAnalyticsSource = analytics?.scriptSrc
    ? normalizeScriptResourceIdentity(analytics.scriptSrc)
    : null;

  return openingTags(html, "script").flatMap((tag) => {
    const attributes = attributesFromTag(tag);
    const src = attributes.get("src")?.trim() ?? "";
    if (!/^https?:\/\//i.test(src)) return [];

    const isReviewedAdBootstrap =
      Boolean(attributes.get("data-ad-bootstrap")?.trim()) &&
      allowedAdSources.has(normalizeScriptResourceIdentity(src));
    const isReviewedAnalyticsBootstrap =
      attributes.get("data-analytics-provider") === "google-analytics" &&
      allowedAnalyticsSource === normalizeScriptResourceIdentity(src);
    return isReviewedAdBootstrap || isReviewedAnalyticsBootstrap
      ? []
      : [`[${route}] External script reference is not allowed by default.`];
  });
}

export function collectBuildHtmlAuditErrors({
  config,
  pages,
  htmlByRoute,
}: BuildHtmlAuditInput): string[] {
  const knownRoutes = new Set(pages.map((page) => page.route));
  const analyses = new Map<string, HtmlPageAnalysis>();
  const errors: string[] = [];

  errors.push(...collectAdHtmlAuditErrors(htmlByRoute, adsConfig));

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
