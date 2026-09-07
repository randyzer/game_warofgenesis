import { describe, expect, it } from "vitest";

import { defineGameConfig } from "../src/config/schema";
import { buildBrandPresentation } from "../src/core/brand";
import { siteConfig } from "../src/core/site-data";

describe("brand presentation boundary", () => {
  it("derives shared shell labels from a cloned site's config", () => {
    const config = defineGameConfig({
      ...siteConfig,
      brand: {
        name: "Raid Codex",
        shortName: "Codex",
        mark: "RC",
        tagline: "Decisions backed by current game evidence.",
      },
      site: { ...siteConfig.site, locale: "en-US" },
    });

    const presentation = buildBrandPresentation(config);

    expect(presentation).toEqual({
      mark: "RC",
      descriptor: "Decisions backed by current game evidence.",
      coordinateLabel: "CODEX / EN-US",
    });
    expect(JSON.stringify(presentation)).not.toMatch(
      /Game Atlas|Field intelligence|FIELD \/ EN|"GA"/,
    );
  });

  it("keeps the logo path in the brand config without requiring logo alt config", () => {
    const config = defineGameConfig({
      ...siteConfig,
      brand: {
        ...siteConfig.brand,
        logoPath: "/logo.svg",
      },
    });

    expect(config.brand.logoPath).toBe("/logo.svg");
    expect(buildBrandPresentation(config)).toMatchObject({
      logoPath: "/logo.svg",
    });
  });

  it("preserves the text mark presentation when no logo is configured", () => {
    const config = defineGameConfig({
      ...siteConfig,
      brand: {
        name: "Raid Codex",
        shortName: "Codex",
        mark: "RC",
        tagline: "Decisions backed by current game evidence.",
      },
    });

    expect(buildBrandPresentation(config)).not.toHaveProperty("logoPath");
  });
});
