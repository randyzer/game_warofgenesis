import { describe, expect, it } from "vitest";

import gameConfig from "../game.config";
import { buildEnabledPageCatalog } from "../src/core/catalog";
import {
  createEntityModuleIndex,
  entityModuleDefinitions,
  getEntityModuleDefinition,
} from "../src/data/entity-modules";
import pageInventoryData from "../src/data/page-inventory.json";
import { parsePageInventory } from "../src/data/schemas/page-inventory";

const inventory = parsePageInventory(pageInventoryData);

describe("entity module definitions", () => {
  it("keeps existing family registration in one explicit definition list", () => {
    expect(
      entityModuleDefinitions.map(
        ({ module, entityType, routeSegment, singularLabel }) => ({
          module,
          entityType,
          routeSegment,
          singularLabel,
        }),
      ),
    ).toEqual([
      {
        module: "heroes",
        entityType: "hero",
        routeSegment: "heroes",
        singularLabel: "Hero",
      },
      {
        module: "weapons",
        entityType: "weapon",
        routeSegment: "weapons",
        singularLabel: "Weapon",
      },
      {
        module: "items",
        entityType: "item",
        routeSegment: "items",
        singularLabel: "Item",
      },
      {
        module: "maps",
        entityType: "map",
        routeSegment: "maps",
        singularLabel: "Map",
      },
    ]);
    expect(getEntityModuleDefinition("heroes").pluralLabel).toBe("Heroes");
  });

  it("indexes a test family without changing a Core registry", () => {
    const bossDefinition = {
      module: "bosses",
      entityType: "boss",
      routeSegment: "bosses",
      singularLabel: "Boss",
      pluralLabel: "Bosses",
      parse: (input: unknown) => input as unknown[],
    } as const;

    const index = createEntityModuleIndex([
      ...entityModuleDefinitions,
      bossDefinition,
    ]);

    expect(Object.keys(index)).toEqual(["definitions", "byModule"]);
    expect(index.byModule.get("bosses")).toBe(bossDefinition);
  });

  it("removes a disabled entity family without changing unrelated pages", () => {
    const withoutHeroes = buildEnabledPageCatalog(
      {
        ...gameConfig,
        features: { ...gameConfig.features, heroes: false },
      },
      inventory,
    );
    const withHeroes = buildEnabledPageCatalog(
      {
        ...gameConfig,
        features: { ...gameConfig.features, heroes: true },
      },
      inventory,
    );

    expect(withoutHeroes.some((page) => page.module === "heroes")).toBe(false);
    expect(
      withHeroes
        .filter((page) => page.module !== "heroes")
        .map((page) => page.pageId),
    ).toEqual(withoutHeroes.map((page) => page.pageId));
  });
});
