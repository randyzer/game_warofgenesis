import { describe, expect, it } from "vitest";

import {
  parseHeroFacts,
  parseItemFacts,
  parseMapFacts,
  parseWeaponFacts,
} from "../src/data/schemas/facts";

const provenance = {
  sourceUrl: "https://game.example/patch-notes",
  sourceType: "official" as const,
  accessedAt: "2026-09-01",
  publishedAt: "2026-08-30",
  evidenceNote: "Official patch notes for the current live version.",
};

const hero = {
  id: "demo-sentinel",
  slug: "demo-sentinel",
  name: "Demo Sentinel",
  summary: "A validation-only defensive hero used in starter tests.",
  patch: "1.0.0",
  updatedAt: "2026-09-01",
  sources: [provenance],
  confidence: "high" as const,
  role: "tank" as const,
  difficulty: 2,
  strengths: ["Area control"],
  weaknesses: ["Limited range"],
};

describe("fact schemas", () => {
  it("rejects malformed provenance", () => {
    expect(() =>
      parseHeroFacts([
        {
          ...hero,
          sources: [{ ...provenance, sourceUrl: "http://game.example/wiki" }],
        },
      ]),
    ).toThrow(/HTTPS/i);
  });

  it("rejects confidence outside the supported enum", () => {
    expect(() =>
      parseHeroFacts([{ ...hero, confidence: "certain" }]),
    ).toThrow();
  });

  it("rejects duplicate entity slugs", () => {
    expect(() =>
      parseHeroFacts([
        hero,
        { ...hero, id: "demo-vanguard", name: "Demo Vanguard" },
      ]),
    ).toThrow(/slug/i);
  });

  it("accepts distinct hero, weapon, item, and map collections", () => {
    expect(parseHeroFacts([hero])).toHaveLength(1);
    expect(
      parseWeaponFacts([
        {
          id: "demo-carbine",
          slug: "demo-carbine",
          name: "Demo Carbine",
          summary: "A validation-only mid-range weapon used in starter tests.",
          patch: "1.0.0",
          updatedAt: "2026-09-01",
          sources: [provenance],
          confidence: "high",
          weaponClass: "rifle",
          damage: 24,
          fireRate: 8.5,
          effectiveRange: 35,
        },
      ]),
    ).toHaveLength(1);
    expect(
      parseItemFacts([
        {
          id: "demo-beacon",
          slug: "demo-beacon",
          name: "Demo Beacon",
          summary: "A validation-only utility item used in starter tests.",
          patch: "1.0.0",
          updatedAt: "2026-09-01",
          sources: [provenance],
          confidence: "medium",
          category: "utility",
          cost: 300,
          effect: "Reveals a small area for five seconds.",
        },
      ]),
    ).toHaveLength(1);
    expect(
      parseMapFacts([
        {
          id: "demo-foundry",
          slug: "demo-foundry",
          name: "Demo Foundry",
          summary: "A validation-only compact map used in starter tests.",
          patch: "1.0.0",
          updatedAt: "2026-09-01",
          sources: [provenance],
          confidence: "high",
          mode: "control",
          size: "small",
          keyLocations: ["Assembly", "Cooling"],
        },
      ]),
    ).toHaveLength(1);
  });
});
