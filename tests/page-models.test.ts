import { describe, expect, it } from "vitest";

import { defineGameConfig } from "../src/config/schema";
import { buildEnabledPageCatalog } from "../src/core/catalog";
import {
  buildToolRouteRecords,
  selectDatabasePages,
  selectEditorialPages,
  selectEntityPages,
  selectHubPages,
  selectToolPages,
} from "../src/core/page-models";
import {
  pageInventory,
  siteConfig,
} from "../src/core/site-data";
import {
  parsePageInventory,
  type PageInventoryEntry,
} from "../src/data/schemas/page-inventory";

const home = pageInventory.find((page) => page.pageId === "home")!;

function optionalPage(
  overrides: Partial<PageInventoryEntry>,
): PageInventoryEntry {
  return {
    ...home,
    pageId: "optional.page",
    route: "/optional/",
    primaryKeyword: "optional page",
    relatedPageIds: [],
    ...overrides,
  };
}

const optionalInventory = parsePageInventory([
  optionalPage({
    pageId: "hub.heroes",
    route: "/heroes/",
    pageType: "hub",
    cluster: "heroes",
    module: "heroes",
    feature: "heroes",
    primaryKeyword: "hero database",
  }),
  optionalPage({
    pageId: "hero.demo-sentinel",
    route: "/heroes/demo-sentinel/",
    pageType: "hero",
    cluster: "heroes",
    module: "heroes",
    feature: "heroes",
    primaryKeyword: "demo sentinel hero",
    entityRef: { entityType: "hero", entityId: "demo-sentinel" },
  }),
  optionalPage({
    pageId: "database.heroes",
    route: "/heroes/database/",
    pageType: "database",
    cluster: "heroes",
    module: "heroes",
    feature: "heroes",
    primaryKeyword: "hero stat database",
  }),
  optionalPage({
    pageId: "meta.first-tier-list",
    route: "/meta/first-tier-list/",
    pageType: "meta",
    cluster: "meta",
    module: "tierLists",
    feature: "tierLists",
    primaryKeyword: "first tier list",
    contentRef: { collection: "tierLists", slug: "first-tier-list" },
  }),
  optionalPage({
    pageId: "patch.first-update",
    route: "/news/first-update/",
    pageType: "patch",
    cluster: "news",
    module: "news",
    feature: "news",
    primaryKeyword: "first game update",
    contentRef: { collection: "news", slug: "first-update" },
  }),
  optionalPage({
    pageId: "tool.damage-calculator",
    route: "/tools/damage-calculator/",
    pageType: "calculator",
    cluster: "tools",
    module: "tools",
    feature: "calculator",
    primaryKeyword: "game damage calculator",
  }),
  optionalPage({
    pageId: "tool.build-planner",
    route: "/tools/build-planner/",
    pageType: "planner",
    cluster: "tools",
    module: "tools",
    feature: "planner",
    primaryKeyword: "game build planner",
  }),
]);

const allOptionalConfig = defineGameConfig({
  ...siteConfig,
  features: {
    ...siteConfig.features,
    heroes: true,
    tierLists: true,
    news: true,
    calculator: true,
    planner: true,
  },
});
const optionalCatalog = buildEnabledPageCatalog(
  allOptionalConfig,
  optionalInventory,
);
const noOptionalCatalog = buildEnabledPageCatalog(
  defineGameConfig({
    ...siteConfig,
    features: {
      ...siteConfig.features,
      heroes: false,
      weapons: false,
      items: false,
      maps: false,
      tierLists: false,
      news: false,
      calculator: false,
      planner: false,
    },
  }),
  pageInventory,
);

describe("page model selectors", () => {
  it("selects each optional model only from matching inventory entries", () => {
    expect(selectHubPages(optionalCatalog, "heroes")).toHaveLength(1);
    expect(selectEntityPages(optionalCatalog, "hero")).toHaveLength(1);
    expect(selectDatabasePages(optionalCatalog, "heroes")).toHaveLength(1);
    expect(selectEditorialPages(optionalCatalog, "meta")).toHaveLength(1);
    expect(selectEditorialPages(optionalCatalog, "patch")).toHaveLength(1);
    expect(selectToolPages(optionalCatalog)).toHaveLength(2);
  });

  it("rejects an entity page without its matching entityRef", () => {
    const malformedHero = optionalPage({
      pageId: "hero.malformed",
      route: "/heroes/malformed/",
      pageType: "hero",
      cluster: "heroes",
      module: "heroes",
      feature: "heroes",
      primaryKeyword: "malformed hero",
    });

    expect(() => selectEntityPages([malformedHero], "hero")).toThrow(
      /entityRef/i,
    );
  });

  it("selects no optional production pages under default flags", () => {
    expect(selectHubPages(noOptionalCatalog, "heroes")).toEqual([]);
    expect(selectEntityPages(noOptionalCatalog, "hero")).toEqual([]);
    expect(selectDatabasePages(noOptionalCatalog, "heroes")).toEqual([]);
    expect(selectEditorialPages(noOptionalCatalog, "meta")).toEqual([]);
    expect(selectEditorialPages(noOptionalCatalog, "patch")).toEqual([]);
    expect(selectToolPages(noOptionalCatalog)).toEqual([]);
  });

  it("builds stable tool slugs and rejects routes outside the tool family", () => {
    const toolPages = selectToolPages(optionalCatalog);

    expect(buildToolRouteRecords(toolPages).map((record) => record.slug)).toEqual([
      "damage-calculator",
      "build-planner",
    ]);
    expect(() =>
      buildToolRouteRecords([
        { ...toolPages[0], route: "/calculators/damage/" },
      ]),
    ).toThrow(/tools/i);
    expect(buildToolRouteRecords(selectToolPages(noOptionalCatalog))).toEqual(
      [],
    );
  });
});
