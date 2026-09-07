import type {
  EntityType,
  PageInventoryEntry,
  PageModule,
} from "../data/schemas/page-inventory";

export function selectHubPages(
  catalog: PageInventoryEntry[],
  module: PageModule,
) {
  return catalog.filter(
    (page) => page.pageType === "hub" && page.module === module,
  );
}

export function selectEntityPages(
  catalog: PageInventoryEntry[],
  entityType: EntityType,
) {
  return catalog
    .filter((page) => page.pageType === entityType)
    .map((page) => {
      if (!page.entityRef || page.entityRef.entityType !== entityType) {
        throw new Error(
          `Page "${page.pageId}" requires a matching entityRef for ${entityType}.`,
        );
      }
      return page;
    });
}

export function selectDatabasePages(
  catalog: PageInventoryEntry[],
  module: PageModule,
) {
  return catalog.filter(
    (page) => page.pageType === "database" && page.module === module,
  );
}

export function selectEditorialPages(
  catalog: PageInventoryEntry[],
  pageType: "meta" | "patch",
) {
  const expectedCollection = pageType === "meta" ? "tierLists" : "news";

  return catalog
    .filter((page) => page.pageType === pageType)
    .map((page) => {
      if (page.contentRef?.collection !== expectedCollection) {
        throw new Error(
          `Page "${page.pageId}" requires a ${expectedCollection} contentRef.`,
        );
      }
      return page;
    });
}

export function selectToolPages(catalog: PageInventoryEntry[]) {
  return catalog.filter(
    (page) =>
      page.module === "tools" &&
      (page.pageType === "calculator" || page.pageType === "planner"),
  );
}

export interface ToolRouteRecord {
  slug: string;
  kind: "calculator" | "planner";
  page: PageInventoryEntry;
}

export function buildToolRouteRecords(
  pages: PageInventoryEntry[],
): ToolRouteRecord[] {
  return pages.map((page) => {
    const routeMatch = page.route.match(
      /^\/tools\/([a-z0-9]+(?:-[a-z0-9]+)*)\/$/,
    );

    if (
      page.module !== "tools" ||
      (page.pageType !== "calculator" && page.pageType !== "planner") ||
      !routeMatch
    ) {
      throw new Error(
        `Tool page "${page.pageId}" must use a /tools/<slug>/ route and a supported tool page type.`,
      );
    }

    return {
      slug: routeMatch[1],
      kind: page.pageType,
      page,
    };
  });
}
