import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import siteConfig from "../game.config";
import { adsConfig } from "../src/config/ads";

function read(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

describe("War of Genesis Phase 0 identity", () => {
  it("configures the canonical English-first project identity", () => {
    expect(siteConfig.brand).toMatchObject({
      name: "War of Genesis Wiki",
      shortName: "WoG Wiki",
      mark: "WoG",
      logoPath: "/logo.svg",
    });
    expect(siteConfig.site).toMatchObject({
      url: "https://war-of-genesis.wiki",
      locale: "en",
    });
    expect(siteConfig.seo.titleTemplate).toBe("%s | War of Genesis Wiki");
    expect(siteConfig.homepage.displayHeading).toBe(
      "[WoG] War of Genesis: Idle Loot",
    );
    expect(siteConfig.social.xHandle).toBeUndefined();
    expect(siteConfig.features).toEqual({
      guides: true,
      heroes: false,
      weapons: false,
      items: false,
      maps: false,
      tierLists: false,
      news: false,
      search: true,
      calculator: true,
      planner: false,
    });
  });

  it("keeps monetization disabled and uses project package metadata", () => {
    const packageJson = JSON.parse(read("../package.json"));
    const packageLock = JSON.parse(read("../package-lock.json"));
    const wranglerConfig = read("../wrangler.jsonc");

    expect(adsConfig).toEqual({ enabled: false, placements: {} });
    expect(packageJson.name).toBe("game-warofgenesis");
    expect(packageLock.name).toBe(packageJson.name);
    expect(packageLock.packages[""].name).toBe(packageJson.name);
    expect(wranglerConfig).toMatch(/"name": "game-warofgenesis"/);
  });

  it("uses project-specific logo and favicon labels", () => {
    const logo = read("../public/logo.svg");
    const favicon = read("../public/favicon.svg");

    expect(logo).toContain('aria-label="War of Genesis Wiki logo"');
    expect(favicon).toContain('aria-label="War of Genesis Wiki favicon"');
  });

  it("contains no stale Starter identity in production-facing source files", () => {
    const productionSource = [
      "../game.config.ts",
      "../src/data/page-inventory.json",
      "../src/content/guides/beginner-guide.mdx",
      "../src/content/guides/farming.mdx",
      "../src/core/static-page-copy.ts",
      "../src/pages/privacy.astro",
      "../src/pages/terms.astro",
      "../public/logo.svg",
      "../public/favicon.svg",
    ]
      .map(read)
      .join("\n");

    expect(productionSource).not.toMatch(
      /Game Atlas|gameatlas\.example|\bstarter\b|example game|placeholder game|sample site/i,
    );
  });
});
