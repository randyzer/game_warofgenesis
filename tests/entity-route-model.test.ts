import { describe, expect, it } from "vitest";

import { buildEntityModuleRouteRecords } from "../src/core/entity-route-model";
import { pageInventory } from "../src/core/site-data";
import type { HeroFact } from "../src/data/schemas/facts";
import type { PageInventoryEntry } from "../src/data/schemas/page-inventory";

const basePage = pageInventory.find((page) => page.pageId === "home")!;

function page(overrides: Partial<PageInventoryEntry>): PageInventoryEntry {
  return {
    ...basePage,
    pageId: "hub.heroes",
    route: "/heroes/",
    pageType: "hub",
    cluster: "heroes",
    module: "heroes",
    feature: "heroes",
    primaryKeyword: "hero hub",
    relatedPageIds: [],
    ...overrides,
  };
}

const hero: HeroFact = {
  id: "demo-sentinel",
  slug: "demo-sentinel",
  name: "Demo Sentinel",
  summary: "A validation-only defensive hero used in starter tests.",
  patch: "1.0.0",
  updatedAt: "2026-09-01",
  sources: [
    {
      sourceUrl: "https://game.example/heroes/demo-sentinel",
      sourceType: "official",
      accessedAt: "2026-09-01",
      evidenceNote: "Official hero reference used only by this test fixture.",
    },
  ],
  confidence: "high",
  role: "tank",
  difficulty: 2,
  strengths: ["Area control"],
  weaknesses: ["Limited range"],
};

const catalog = [
  page({}),
  page({
    pageId: "database.heroes",
    route: "/heroes/database/",
    pageType: "database",
    primaryKeyword: "hero database",
  }),
  page({
    pageId: "hero.demo-sentinel",
    route: "/heroes/demo-sentinel/",
    pageType: "hero",
    primaryKeyword: "demo sentinel hero",
    entityRef: { entityType: "hero", entityId: "demo-sentinel" },
  }),
];

describe("buildEntityModuleRouteRecords", () => {
  it("joins hub, database, and detail inventory with explicit paths", () => {
    const records = buildEntityModuleRouteRecords({
      segment: "heroes",
      module: "heroes",
      entityType: "hero",
      catalog,
      facts: [hero],
    });

    expect(records.map((record) => [record.path, record.view])).toEqual([
      [undefined, "hub"],
      ["database", "database"],
      ["demo-sentinel", "detail"],
    ]);
    const detailRecord = records[2];
    expect(detailRecord.view).toBe("detail");
    if (detailRecord.view !== "detail") {
      throw new Error("Expected the third record to be an entity detail.");
    }
    expect(detailRecord.fact).toBe(hero);
  });

  it("fails when a published entity page has no matching fact", () => {
    expect(() =>
      buildEntityModuleRouteRecords({
        segment: "heroes",
        module: "heroes",
        entityType: "hero",
        catalog,
        facts: [],
      }),
    ).toThrow(/demo-sentinel.*fact/i);
  });

  it("returns no records for an empty disabled-module catalog", () => {
    expect(
      buildEntityModuleRouteRecords({
        segment: "heroes",
        module: "heroes",
        entityType: "hero",
        catalog: [],
        facts: [],
      }),
    ).toEqual([]);
  });
});
