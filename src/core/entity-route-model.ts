import type { PageInventoryEntry } from "../data/schemas/page-inventory";

export interface RoutableFact {
  id: string;
  slug: string;
  name: string;
  summary: string;
}

export type EntityModuleRouteRecord<TFact extends RoutableFact> =
  | {
      path?: string;
      view: "hub" | "database";
      page: PageInventoryEntry;
      facts: TFact[];
    }
  | {
      path: string;
      view: "detail";
      page: PageInventoryEntry;
      facts: TFact[];
      fact: TFact;
    };

export interface EntityModuleRouteInput<TFact extends RoutableFact> {
  segment: string;
  module: string;
  entityType: string;
  catalog: PageInventoryEntry[];
  facts: TFact[];
}

export function buildEntityModuleRouteRecords<TFact extends RoutableFact>(
  input: EntityModuleRouteInput<TFact>,
): EntityModuleRouteRecord<TFact>[] {
  const modulePrefix = `/${input.segment}/`;
  const factsById = new Map(input.facts.map((fact) => [fact.id, fact]));

  return input.catalog
    .filter(
      (page) =>
        page.module === input.module &&
        (page.pageType === "hub" ||
          page.pageType === "database" ||
          page.pageType === input.entityType),
    )
    .map((page) => {
      if (!page.route.startsWith(modulePrefix) || !page.route.endsWith("/")) {
        throw new Error(
          `Page "${page.pageId}" must use the ${modulePrefix} route family.`,
        );
      }

      const path =
        page.route === modulePrefix
          ? undefined
          : page.route.slice(modulePrefix.length, -1);

      if (page.pageType === "hub") {
        if (path !== undefined) {
          throw new Error(`Hub page "${page.pageId}" must use ${modulePrefix}.`);
        }
        return { path, view: "hub" as const, page, facts: input.facts };
      }

      if (page.pageType === "database") {
        if (!path) {
          throw new Error(`Database page "${page.pageId}" requires a route path.`);
        }
        return { path, view: "database" as const, page, facts: input.facts };
      }

      if (
        !page.entityRef ||
        page.entityRef.entityType !== input.entityType
      ) {
        throw new Error(
          `Entity page "${page.pageId}" requires a matching entityRef.`,
        );
      }

      const fact = factsById.get(page.entityRef.entityId);
      if (!fact) {
        throw new Error(
          `Entity "${page.entityRef.entityId}" for page "${page.pageId}" has no matching fact.`,
        );
      }
      if (path !== fact.slug) {
        throw new Error(
          `Entity page "${page.pageId}" route path must match fact slug "${fact.slug}".`,
        );
      }

      return {
        path,
        view: "detail" as const,
        page,
        facts: input.facts,
        fact,
      };
    });
}
