import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import gameConfig from "../game.config";
import { buildMarketRouteRecords } from "../src/core/optional-routes";
import { buildBreadcrumbTrail, buildCanonicalUrl } from "../src/core/seo";
import {
  enabledPageCatalog,
  resolvedNavigationGroups,
} from "../src/core/site-data";

const LAUNCH_ROUTES = [
  "/",
  "/guides/",
  "/guides/beginner-guide/",
  "/guides/farming/",
  "/guides/gear/",
  "/builds/",
  "/market/",
  "/market/best-items-to-sell/",
  "/market/how-to-sell-items/",
  "/market/steam-market-fees/",
  "/tools/",
  "/tools/steam-market-fee-calculator/",
] as const;

const PHASE_2B_ROUTES = [
  "/guides/gear/",
  "/market/best-items-to-sell/",
  "/market/how-to-sell-items/",
  "/market/steam-market-fees/",
] as const;

const DEFERRED_ROUTES = [
  "/codes/",
  "/patch-notes/",
  "/troubleshooting/",
  "/classes/",
  "/guides/classes/",
  "/guides/steam-market/",
] as const;

function source(relativePath: string) {
  const url = new URL(relativePath, import.meta.url);
  return existsSync(url) ? readFileSync(url, "utf8") : "";
}

describe("Phase 2B complete launch MVP", () => {
  it("derives the four-route allowlist from the authoritative phase documents", () => {
    const phase1Map = source("../docs/WAR_OF_GENESIS_PHASE_1_IA_SEO_PLAN.md")
      .split("## F. Launch MVP Page Map")[1]
      .split("## G.")[0];
    const planned = [...phase1Map.matchAll(/^\| P[01] \| `([^`]+)`.*\| Launch \|$/gm)]
      .map((match) => match[1]);
    const phase2aMap = source("../docs/WAR_OF_GENESIS_PHASE_2A_MVP_IMPLEMENTATION.md")
      .split("## F. Routes")[1]
      .split("## G.")[0];
    const implemented2a = new Set(
      [...phase2aMap.matchAll(/^- `([^`]+)`$/gm)].map((match) => match[1]),
    );

    expect(planned).toHaveLength(12);
    expect([...planned].sort()).toEqual([...LAUNCH_ROUTES].sort());
    expect(planned.filter((route) => !implemented2a.has(route)).sort()).toEqual(
      [...PHASE_2B_ROUTES].sort(),
    );
  });

  it("emits exactly the Market hub and the three approved spoke paths", () => {
    expect(buildMarketRouteRecords(enabledPageCatalog).map((record) => record.path)).toEqual([
      undefined,
      "best-items-to-sell",
      "how-to-sell-items",
      "steam-market-fees",
    ]);
  });

  it.each(PHASE_2B_ROUTES)("resolves a canonical and published breadcrumb ancestors for %s", (route) => {
    const page = enabledPageCatalog.find((entry) => entry.route === route)!;
    expect(page).toBeDefined();
    expect(buildCanonicalUrl(gameConfig, route)).toBe(`https://war-of-genesis.wiki${route}`);
    const trail = buildBreadcrumbTrail(gameConfig, page, enabledPageCatalog);
    expect(trail.map((entry) => new URL(entry.url).pathname)).toEqual([
      "/",
      route.startsWith("/guides/") ? "/guides/" : "/market/",
      route,
    ]);
  });

  it("keeps fee formulas inside the editorial column on mobile", () => {
    const styles = source("../src/styles/global.css");

    expect(styles).toMatch(/\.editorial \.prose\s*\{[^}]*min-width:\s*0;/);
    expect(styles).toMatch(/\.editorial \.prose pre\s*\{[^}]*overflow-x:\s*auto;/);
  });

  it("publishes all 12 and only the approved strategic launch routes", () => {
    const enabledRoutes = new Set(
      enabledPageCatalog.map((page) => page.route),
    );

    expect(LAUNCH_ROUTES.filter((route) => !enabledRoutes.has(route))).toEqual(
      [],
    );
    expect(DEFERRED_ROUTES.filter((route) => enabledRoutes.has(route))).toEqual(
      [],
    );
    expect([...enabledRoutes].sort()).toEqual([
      ...LAUNCH_ROUTES,
      "/search/",
      "/about/",
      "/privacy/",
      "/terms/",
      "/404.html",
    ].sort());
  });

  it("registers unique, indexable metadata for every Phase 2B page", () => {
    const pages = PHASE_2B_ROUTES.map((route) =>
      enabledPageCatalog.find((page) => page.route === route),
    );

    expect(pages.every(Boolean)).toBe(true);
    expect(new Set(pages.map((page) => page?.title)).size).toBe(4);
    expect(new Set(pages.map((page) => page?.description)).size).toBe(4);
    expect(
      pages.every(
        (page) =>
          page?.indexability === "index" &&
          page.publicationStatus === "published" &&
          page.contentStatus === "ready" &&
          page.developmentStatus === "ready",
      ),
    ).toBe(true);
  });

  it("keeps the four top-level nav groups and adds only approved children", () => {
    expect(resolvedNavigationGroups.map((group) => group.label)).toEqual([
      "Guides",
      "Market",
      "Builds",
      "Tools",
    ]);
    expect(
      resolvedNavigationGroups.map((group) =>
        group.children.map((page) => page.route),
      ),
    ).toEqual([
      [
        "/guides/beginner-guide/",
        "/guides/farming/",
        "/guides/gear/",
      ],
      [
        "/market/best-items-to-sell/",
        "/market/how-to-sell-items/",
        "/market/steam-market-fees/",
      ],
      [],
      ["/tools/steam-market-fee-calculator/"],
    ]);
  });

  it("gives every launch page a contextual inbound link", () => {
    const launchPages = enabledPageCatalog.filter((page) =>
      LAUNCH_ROUTES.includes(page.route as (typeof LAUNCH_ROUTES)[number]),
    );
    const inboundCounts = new Map<string, number>(
      LAUNCH_ROUTES.map((route) => [route, 0]),
    );
    const routeById = new Map(
      launchPages.map((page) => [page.pageId, page.route]),
    );

    for (const page of launchPages) {
      for (const relatedPageId of page.relatedPageIds) {
        const route = routeById.get(relatedPageId);
        if (route && route !== page.route) {
          inboundCounts.set(route, (inboundCounts.get(route) ?? 0) + 1);
        }
      }
    }

    expect(
      LAUNCH_ROUTES.filter(
        (route) => route !== "/" && (inboundCounts.get(route) ?? 0) === 0,
      ),
    ).toEqual([]);
  });

  it("adds the Gear article and keeps claims bounded", () => {
    const gear = source("../src/content/guides/gear.mdx");

    expect(gear).toContain("pageId: guide.gear");
    expect(gear).toMatch(/keep|equip|upgrade|synthesi[sz]e|sell/i);
    expect(gear).toMatch(/rarity alone/i);
    expect(gear).not.toMatch(/guaranteed|best-in-slot|drop rate/i);
  });

  it("keeps market content decision-led and free of live-price rankings", () => {
    const market = source("../src/pages/market/[...slug].astro");

    expect(market).toMatch(/tradab|marketab/i);
    expect(market).toMatch(/rarity/i);
    expect(market).toMatch(/demand/i);
    expect(market).toMatch(/useful|progression/i);
    expect(market).toMatch(/keeping|keep/i);
    expect(market).not.toMatch(/Top 10|most expensive|live price ranking/i);
  });

  it("does not publish codes or confuse Idle Loot with Idle Heroes", () => {
    const phase2bSources = [
      source("../src/content/guides/gear.mdx"),
      source("../src/pages/market/[...slug].astro"),
      source("../src/data/page-inventory.json"),
    ].join("\n");

    expect(enabledPageCatalog.some((page) => page.route === "/codes/")).toBe(
      false,
    );
    expect(phase2bSources).not.toContain("War of Genesis: Idle Heroes");
  });

  it("keeps ads and live integrations disabled", () => {
    expect(gameConfig.features).not.toHaveProperty("codes");
    expect(source("../src/config/ads.ts")).toMatch(/enabled:\s*false/);
    expect(source("../src/pages/market/[...slug].astro")).not.toMatch(
      /fetch\(|WebSocket|EventSource/,
    );
  });
});
