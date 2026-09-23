import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import ProjectAd from "../src/components/ads/ProjectAd.astro";
import {
  adsConfig,
  buildAdsterraAdsConfig,
  projectAdPlacements,
  resolveAdPlacement,
} from "../src/config/ads";
import {
  DEFAULT_ADSTERRA_DOMAIN,
  buildAdsterraUnit,
  normalizeAdsterraDomain,
} from "../src/config/adsterra";
import {
  collectAdHtmlAuditErrors,
  collectExternalScriptErrors,
} from "../src/core/html-audit";

const KEY = "b8bc5ad535a79dcab713fda8ed0c75cf";

describe("Adsterra unit identity", () => {
  it("derives the public script and container identities from a 32-hex key", () => {
    const unit = buildAdsterraUnit(KEY);

    expect(unit).toEqual({
      key: KEY,
      domain: DEFAULT_ADSTERRA_DOMAIN,
      scriptSrc: `https://${DEFAULT_ADSTERRA_DOMAIN}/${KEY}/invoke.js`,
      containerId: `container-${KEY}`,
    });
    expect(buildAdsterraUnit(KEY.toUpperCase())?.key).toBe(KEY);
  });

  it("fails closed for a missing or malformed key", () => {
    for (const invalid of ["", "   ", "abc", KEY.slice(0, 31), `${KEY}0`, `${KEY.slice(0, 31)}z`]) {
      expect(buildAdsterraUnit(invalid)).toBeNull();
    }
  });

  it("accepts an overridden delivery domain and ignores unusable values", () => {
    expect(buildAdsterraUnit(KEY, "https://pl99999999.example-network.com/")?.scriptSrc).toBe(
      `https://pl99999999.example-network.com/${KEY}/invoke.js`,
    );
    expect(buildAdsterraUnit(KEY, "not a domain")?.domain).toBe(DEFAULT_ADSTERRA_DOMAIN);
    expect(normalizeAdsterraDomain("  ")).toBeNull();
  });
});

describe("Adsterra placement configuration", () => {
  it("stays globally disabled without a configured key", () => {
    expect(buildAdsterraAdsConfig(null)).toEqual({ enabled: false, placements: {} });
    expect(adsConfig.enabled).toBe(false);
    expect(adsConfig.placements).toEqual({});
  });

  it("enables one homepage and one in-article placement for a configured key", () => {
    const config = buildAdsterraAdsConfig(buildAdsterraUnit(KEY));

    expect(config.enabled).toBe(true);
    expect(projectAdPlacements).toContain("article-after-intro");
    for (const placement of ["home-primary", "article-after-intro"] as const) {
      const definition = resolveAdPlacement(config, placement);
      expect(definition?.publicSlotId).toBe(`container-${KEY}`);
      expect(definition?.provider?.scriptSrc).toContain(`/${KEY}/invoke.js`);
      expect(definition?.provider?.bootstrapId).toBe(`adsterra-${KEY}`);
    }
    expect(resolveAdPlacement(config, "before-footer")).toBeNull();
  });
});

describe("Adsterra provider rendering", () => {
  async function renderProvider(placement: "home-primary" | "article-after-intro") {
    const config = buildAdsterraAdsConfig(buildAdsterraUnit(KEY));
    const definition = resolveAdPlacement(config, placement)!;
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectAd, {
      props: { placement, definition },
    });
    return { config, definition, html };
  }

  it("emits exactly one container and one async bootstrap script per placement", async () => {
    const { definition, html } = await renderProvider("article-after-intro");

    expect(html.match(new RegExp(`<div id="${definition.provider!.containerId}"></div>`, "g"))).toHaveLength(1);
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html).toContain('data-cfasync="false"');
    expect(html).toContain("async");
    expect(html).toContain(`src="${definition.provider!.scriptSrc}"`);
    expect(html).toContain(`data-ad-instance="${definition.instanceId}"`);
    expect(html).not.toMatch(/secret|token|api-key|password/i);
  });

  it("passes the build-time ad HTML audit when composed inside its semantic wrapper", async () => {
    const { config, html } = await renderProvider("home-primary");
    const composed = `<section class="ad-slot" data-ad-placement="home-primary" aria-label="Advertisement">${html}</section>`;

    expect(collectAdHtmlAuditErrors(new Map([["/", composed]]), config)).toEqual([]);
  });
});

describe("Adsterra composition boundaries", () => {
  it("places the in-article slot after the intro and before the article body", () => {
    for (const [path, bodyMarker] of [
      ["../src/components/wiki/WikiArticle.astro", "article__layout"],
      ["../src/components/EditorialArticle.astro", "article__layout"],
    ] as const) {
      const source = readFileSync(new URL(path, import.meta.url), "utf8");
      const header = source.indexOf("article__header");
      const slot = source.indexOf('<AdSlot placement="article-after-intro"');
      const body = source.indexOf(`class="${bodyMarker}`) === -1
        ? source.indexOf(bodyMarker, slot)
        : source.indexOf(`class="${bodyMarker}`);

      expect(header).toBeGreaterThan(-1);
      expect(slot).toBeGreaterThan(header);
      expect(slot).toBeLessThan(body);
      expect(source).not.toMatch(/invoke\.js|container-[0-9a-f]{32}|profitableratecpmnetwork/i);
    }
  });

  it("keeps the provider key out of committed source and config", () => {
    for (const path of [
      "../src/config/ads.ts",
      "../src/config/adsterra.ts",
      "../src/components/ads/ProjectAd.astro",
      "../src/components/ads/AdSlot.astro",
    ]) {
      expect(readFileSync(new URL(path, import.meta.url), "utf8")).not.toContain(KEY);
    }
  });
});

describe("external script policy", () => {
  const config = buildAdsterraAdsConfig(buildAdsterraUnit(KEY));
  const provider = resolveAdPlacement(config, "home-primary")!.provider!;

  it("allows only the reviewed ad bootstrap resource", () => {
    const allowed = `<script async data-cfasync="false" data-ad-bootstrap="${provider.bootstrapId}" src="${provider.scriptSrc}"></script>`;

    expect(collectExternalScriptErrors("/", allowed, config)).toEqual([]);
  });

  it("still rejects unreviewed external scripts, spoofed identities, and other hosts", () => {
    const rejected = [
      `<script src="${provider.scriptSrc}"></script>`,
      `<script data-ad-bootstrap="${provider.bootstrapId}" src="https://evil.example.com/${KEY}/invoke.js"></script>`,
      '<script src="https://cdn.example.com/tracker.js"></script>',
    ];

    for (const html of rejected) {
      expect(collectExternalScriptErrors("/", html, config)).toEqual([
        "[/] External script reference is not allowed by default.",
      ]);
    }
  });

  it("rejects the same bootstrap resource when ads are globally disabled", () => {
    const html = `<script data-ad-bootstrap="${provider.bootstrapId}" src="${provider.scriptSrc}"></script>`;

    expect(collectExternalScriptErrors("/", html, buildAdsterraAdsConfig(null))).toHaveLength(1);
  });

  it("ignores inline and local scripts", () => {
    const html = '<script>console.log(1)</script><script src="/_astro/app.js"></script>';

    expect(collectExternalScriptErrors("/", html, config)).toEqual([]);
  });
});
