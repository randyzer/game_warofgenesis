import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const currentStarterFiles = [
  "../README.md",
  "../docs/CONTENT_AND_DATA_GUIDE.md",
  "../docs/QA_CHECKLIST.md",
  "../public/media/README.md",
] as const;

function read(path: string): string {
  const url = new URL(path, import.meta.url);
  expect(existsSync(url), `${url.pathname} exists`).toBe(true);
  return existsSync(url) ? readFileSync(url, "utf8") : "";
}

describe("release identity", () => {
  it("uses the exact current Starter release identity in active docs", () => {
    for (const path of currentStarterFiles) {
      const source = read(path);
      expect(source).not.toMatch(/GAME_SITE_STARTER v2\.5(?!\.0)/);
      expect(source).not.toMatch(/\bStarter v2\.5(?!\.0)/);
      expect(source).toMatch(/\b(?:GAME_SITE_STARTER|Starter) v2\.5\.0\b/);
    }
  });
});
