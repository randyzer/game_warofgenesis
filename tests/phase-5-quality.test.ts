import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { pageInventory } from "../src/core/site-data";

function source(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

describe("Phase 5 post-launch quality contracts", () => {
  it("ships a reusable 1200 by 630 default social image", () => {
    const imageUrl = new URL("../public/og-default.png", import.meta.url);

    expect(existsSync(imageUrl)).toBe(true);
    const image = readFileSync(imageUrl);
    expect(image.subarray(1, 4).toString()).toBe("PNG");
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(630);
  });

  it("removes production-visible legal template residue", () => {
    const legalSources = [
      source("../src/core/static-page-copy.ts"),
      source("../src/components/LegalPage.astro"),
      source("../src/pages/privacy.astro"),
      source("../src/pages/terms.astro"),
    ].join("\n");

    expect(legalSources).not.toMatch(
      /draft|replace|add your|todo|tbd|placeholder|operator action required/i,
    );
  });

  it("aligns Builds and Best Items titles with decision-support content", () => {
    const builds = pageInventory.find((page) => page.pageId === "hub.builds")!;
    const bestItems = pageInventory.find(
      (page) => page.pageId === "market.best-items-to-sell",
    )!;

    expect(builds.title).toBe("War of Genesis Build Planning Guide");
    expect(builds.description).toMatch(/plan|planning|choose/i);
    expect(builds.title).not.toMatch(/best|top|meta|tier/i);
    expect(bestItems.title).toBe("Best Items to Sell: Decision Framework");
    expect(bestItems.description).toMatch(/framework|decide|screen/i);
    expect(bestItems.description).not.toMatch(/live|ranking|current best/i);
  });

  it("keeps modified page copy explicit about rankings and live-data limits", () => {
    const builds = source("../src/pages/builds/index.astro");
    const market = source("../src/pages/market/[...slug].astro");

    expect(builds).toMatch(/planning guide|decision framework/i);
    expect(builds).toMatch(/does not publish.*(?:tier|ranking|winner)/i);
    expect(market).toMatch(/decision framework/i);
    expect(market).toMatch(/no (?:live|current).*ranking|not (?:a )?ranking/i);
  });
});
