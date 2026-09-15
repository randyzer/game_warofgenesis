import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  buildBuildsRouteRecord,
  buildMarketRouteRecord,
  buildToolsHubRouteRecord,
} from "../src/core/optional-routes";
import {
  enabledPageCatalog,
  resolvedNavigationGroups,
} from "../src/core/site-data";

const EXPECTED_PHASE_2A_ROUTES = [
  "/",
  "/guides/",
  "/guides/beginner-guide/",
  "/guides/farming/",
  "/market/",
  "/builds/",
  "/tools/",
  "/tools/steam-market-fee-calculator/",
] as const;

describe("Phase 2A route allowlist", () => {
  it("publishes every approved route", () => {
    const routes = new Set(enabledPageCatalog.map((page) => page.route));

    for (const route of EXPECTED_PHASE_2A_ROUTES) {
      expect(routes.has(route), `${route} is enabled`).toBe(true);
    }
  });

  it("keeps post-launch, deferred, and merged routes unpublished", () => {
    const routes = new Set(enabledPageCatalog.map((page) => page.route));

    expect(routes.has("/codes/")).toBe(false);
    expect(routes.has("/patch-notes/")).toBe(false);
    expect(routes.has("/troubleshooting/")).toBe(false);
    expect(routes.has("/classes/")).toBe(false);
    expect(routes.has("/guides/classes/")).toBe(false);
    expect(routes.has("/guides/steam-market/")).toBe(false);
  });

  it("uses explicit route capabilities for Market, Builds, and Tools", () => {
    expect(buildMarketRouteRecord(enabledPageCatalog).route).toBe("/market/");
    expect(buildBuildsRouteRecord(enabledPageCatalog).route).toBe("/builds/");
    expect(buildToolsHubRouteRecord(enabledPageCatalog).route).toBe("/tools/");
  });

  it("configures the exact primary navigation order", () => {
    expect(resolvedNavigationGroups.map((group) => group.label)).toEqual([
      "Guides",
      "Market",
      "Builds",
      "Tools",
    ]);
    expect(
      resolvedNavigationGroups.map((group) => group.page.route),
    ).toEqual(["/guides/", "/market/", "/builds/", "/tools/"]);
  });

  it("has route entry files for all non-guide Phase 2A capabilities", () => {
    for (const relativePath of [
      "../src/pages/market/[...slug].astro",
      "../src/pages/builds/index.astro",
      "../src/pages/tools/index.astro",
    ]) {
      expect(existsSync(new URL(relativePath, import.meta.url)), relativePath).toBe(
        true,
      );
    }
  });

  it("replaces the Phase 0 guide stub with both approved guide files", () => {
    const beginner = new URL(
      "../src/content/guides/beginner-guide.mdx",
      import.meta.url,
    );
    const farming = new URL(
      "../src/content/guides/farming.mdx",
      import.meta.url,
    );
    const oldStub = new URL(
      "../src/content/guides/getting-started.mdx",
      import.meta.url,
    );

    expect(readFileSync(beginner, "utf8")).toContain(
      "pageId: guide.beginner-guide",
    );
    expect(readFileSync(farming, "utf8")).toContain("pageId: guide.farming");
    expect(existsSync(oldStub)).toBe(false);
  });
});
