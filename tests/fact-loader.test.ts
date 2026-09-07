import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { defineGameConfig } from "../src/config/schema";
import { loadFactModule } from "../src/core/fact-loader";
import { siteConfig } from "../src/core/site-data";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function tempProject() {
  const directory = mkdtempSync(join(tmpdir(), "game-site-facts-"));
  temporaryDirectories.push(directory);
  return directory;
}

function configWithHeroes(enabled: boolean) {
  return defineGameConfig({
    ...siteConfig,
    features: { ...siteConfig.features, heroes: enabled },
  });
}

describe("loadFactModule", () => {
  it("does not require or read a fact file for a disabled module", () => {
    expect(loadFactModule("heroes", configWithHeroes(false), tempProject())).toEqual(
      [],
    );
  });

  it("fails precisely when an enabled module file is missing", () => {
    expect(() =>
      loadFactModule("heroes", configWithHeroes(true), tempProject()),
    ).toThrow(/heroes\.json/i);
  });

  it("fails precisely when an enabled module file is invalid", () => {
    const project = tempProject();
    const factsDirectory = join(project, "src/data/facts");
    mkdirSync(factsDirectory, { recursive: true });
    writeFileSync(join(factsDirectory, "heroes.json"), "{invalid", "utf8");

    expect(() =>
      loadFactModule("heroes", configWithHeroes(true), project),
    ).toThrow(/invalid.*heroes\.json/i);
  });

  it("parses valid enabled data through the module schema", () => {
    const project = tempProject();
    const factsDirectory = join(project, "src/data/facts");
    mkdirSync(factsDirectory, { recursive: true });
    writeFileSync(
      join(factsDirectory, "heroes.json"),
      JSON.stringify([
        {
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
        },
      ]),
      "utf8",
    );

    expect(
      loadFactModule("heroes", configWithHeroes(true), project),
    ).toHaveLength(1);
  });
});
