import type { PageInventoryEntry } from "../data/schemas/page-inventory";
import type { ResolvedPageMedia } from "../data/media/catalog";

export type GuideRouteRecord<TContent> =
  | {
      path?: string;
      view: "hub";
      page: PageInventoryEntry;
      guidePages: PageInventoryEntry[];
      pageMedia?: ResolvedPageMedia;
    }
  | {
      path: string;
      view: "article";
      page: PageInventoryEntry;
      content: TContent;
    };

interface ResolvedGuideContent<TContent> {
  page: PageInventoryEntry;
  content: TContent;
}

export function buildGuideRouteRecords<TContent>(
  catalog: PageInventoryEntry[],
  resolvedGuides: ResolvedGuideContent<TContent>[],
): GuideRouteRecord<TContent>[] {
  const enabledPageIds = new Set(catalog.map((page) => page.pageId));
  const guidePages = catalog
    .filter((page) => page.pageType === "guide" && page.module === "guides")
    .sort((left, right) => right.priority - left.priority);
  const hubRecords = catalog
    .filter((page) => page.pageType === "hub" && page.module === "guides")
    .map((page) => {
      if (page.route !== "/guides/") {
        throw new Error(`Guides hub "${page.pageId}" must use /guides/.`);
      }

      return {
        path: undefined,
        view: "hub" as const,
        page,
        guidePages,
      };
    });
  const articleRecords = resolvedGuides.flatMap(({ page, content }) => {
    if (!enabledPageIds.has(page.pageId)) return [];
    if (page.pageType !== "guide" || page.module !== "guides") {
      throw new Error(`Guide content page "${page.pageId}" is not a Guides page.`);
    }

    const slug = page.contentRef?.slug;
    if (!slug || page.route !== `/guides/${slug}/`) {
      throw new Error(
        `Guide page "${page.pageId}" route must match its content slug.`,
      );
    }

    return [{ path: slug, view: "article" as const, page, content }];
  });

  return [...hubRecords, ...articleRecords];
}

export interface SearchRouteRecord {
  path?: string;
  page: PageInventoryEntry;
  fallbackPage?: PageInventoryEntry;
}

export function buildSearchRouteRecords(
  catalog: PageInventoryEntry[],
): SearchRouteRecord[] {
  const pageById = new Map(catalog.map((page) => [page.pageId, page]));

  return catalog
    .filter((page) => page.pageType === "search" && page.module === "search")
    .map((page) => {
      if (page.route !== "/search/") {
        throw new Error(`Search page "${page.pageId}" must use /search/.`);
      }

      const fallbackPage = page.relatedPageIds
        .map((pageId) => pageById.get(pageId))
        .find((candidate) => candidate?.module === "guides");

      return { path: undefined, page, fallbackPage };
    });
}

function requireSingleHubRoute(
  catalog: PageInventoryEntry[],
  module: "market" | "builds" | "tools",
  route: "/market/" | "/builds/" | "/tools/",
): PageInventoryEntry {
  const matches = catalog.filter(
    (page) =>
      page.pageType === "hub" &&
      page.module === module &&
      page.route === route,
  );

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one enabled ${module} hub at ${route}; received ${matches.length}.`,
    );
  }

  return matches[0];
}

export function buildMarketRouteRecord(catalog: PageInventoryEntry[]) {
  return requireSingleHubRoute(catalog, "market", "/market/");
}

export interface MarketRouteRecord {
  path?: string;
  page: PageInventoryEntry;
}

export function buildMarketRouteRecords(
  catalog: PageInventoryEntry[],
): MarketRouteRecord[] {
  const hub = buildMarketRouteRecord(catalog);
  const spokes = catalog
    .filter((page) => page.module === "market" && page.pageType === "guide")
    .sort((left, right) => right.priority - left.priority)
    .map((page) => {
      const match = page.route.match(/^\/market\/([a-z0-9]+(?:-[a-z0-9]+)*)\/$/);
      if (!match) {
        throw new Error(
          `Market guide "${page.pageId}" must use one /market/{slug}/ segment.`,
        );
      }

      return { path: match[1], page };
    });

  return [{ path: undefined, page: hub }, ...spokes];
}

export function buildBuildsRouteRecord(catalog: PageInventoryEntry[]) {
  return requireSingleHubRoute(catalog, "builds", "/builds/");
}

export function buildToolsHubRouteRecord(catalog: PageInventoryEntry[]) {
  return requireSingleHubRoute(catalog, "tools", "/tools/");
}
