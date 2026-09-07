import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import gameConfig from "../game.config";
import { buildEnabledPageCatalog } from "../src/core/catalog";
import {
  buildGuideRouteRecords,
  buildSearchRouteRecords,
} from "../src/core/optional-routes";
import pageInventoryData from "../src/data/page-inventory.json";
import { parsePageInventory } from "../src/data/schemas/page-inventory";

const inventory = parsePageInventory(pageInventoryData);
const gettingStarted = inventory.find(
  (page) => page.pageId === "guide.getting-started",
)!;
const guideContent = {
  collection: "guides",
  id: "getting-started",
  data: { pageId: gettingStarted.pageId },
};

function catalogWith(
  features: Partial<(typeof gameConfig)["features"]>,
) {
  return buildEnabledPageCatalog(
    {
      ...gameConfig,
      features: { ...gameConfig.features, ...features },
    },
    inventory,
  );
}

describe("optional route records", () => {
  it("uses route files that can emit zero static paths", () => {
    const projectRoot = process.cwd();

    expect(existsSync(resolve(projectRoot, "src/pages/guides/index.astro"))).toBe(
      false,
    );
    expect(existsSync(resolve(projectRoot, "src/pages/search.astro"))).toBe(
      false,
    );
    expect(
      existsSync(resolve(projectRoot, "src/pages/guides/[...slug].astro")),
    ).toBe(true);
    expect(
      existsSync(resolve(projectRoot, "src/pages/search/[...path].astro")),
    ).toBe(true);
  });

  it("emits no Guides paths when guides are disabled", () => {
    const catalog = catalogWith({ guides: false });

    expect(
      buildGuideRouteRecords(catalog, [
        { page: gettingStarted, content: guideContent },
      ]),
    ).toEqual([]);
  });

  it("emits no Search path when search is disabled", () => {
    const catalog = catalogWith({ search: false });

    expect(buildSearchRouteRecords(catalog)).toEqual([]);
  });

  it("keeps Search independent when Guides are disabled", () => {
    const catalog = catalogWith({ guides: false, search: true });

    expect(buildSearchRouteRecords(catalog)).toEqual([
      {
        path: undefined,
        page: expect.objectContaining({ pageId: "search", route: "/search/" }),
        fallbackPage: undefined,
      },
    ]);
  });

  it("preserves the existing Guides and Search URLs when enabled", () => {
    const catalog = catalogWith({ guides: true, search: true });
    const guideRecords = buildGuideRouteRecords(catalog, [
      { page: gettingStarted, content: guideContent },
    ]);

    expect(guideRecords.map((record) => record.path)).toEqual([
      undefined,
      "getting-started",
    ]);
    expect(buildSearchRouteRecords(catalog)[0]?.fallbackPage?.route).toBe(
      "/guides/",
    );
  });
});
