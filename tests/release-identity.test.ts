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
      expect(source).not.toMatch(/^# .*v2\.5\.0/m);
      expect(source).not.toMatch(/\bStarter v2\.5\.0 is\b/);
      expect(source).not.toMatch(/`GAME_SOP v2\.5` is the production methodology/);
      expect(source).not.toMatch(/Record the `GAME_SOP v2\.5` commit used for production methodology/);
      expect(source).not.toMatch(/fit satisfy `GAME_SOP v2\.5`/);
      expect(source).toMatch(/\b(?:GAME_SITE_STARTER|Starter) v2\.6\.2\b/);
      expect(source).toMatch(/GAME_SOP v2\.6\.2\b/);
      expect(source).toMatch(/Phase C|D1-D3/i);
      expect(source).not.toMatch(/not yet implemented|not implemented yet/i);
      expect(source).not.toMatch(/IMPLEMENTATION COMPLETE|final Human PASS/i);
    }
  });

  it("documents the scaffold package version separately from the Starter release identity", () => {
    const packageJson = JSON.parse(read("../package.json"));
    const packageLock = JSON.parse(read("../package-lock.json"));
    const readme = read("../README.md").replace(/\s+/g, " ");

    expect(packageJson.private).toBe(true);
    expect(packageLock.version).toBe(packageJson.version);
    expect(packageLock.packages[""].version).toBe(packageJson.version);
    expect(readme).toContain(
      "`GAME_SITE_STARTER v2.6.2` identifies the current Starter implementation target and its `GAME_SOP v2.6.2` compatibility line.",
    );
    expect(readme).toContain(
      `\`package.json\` version \`${packageJson.version}\` is the inherited private application/scaffold package metadata version, also recorded at the top level and root package of \`package-lock.json\`.`,
    );
    expect(readme).toContain(
      "This package metadata value does not identify the Starter release or SOP compatibility line.",
    );
  });

  it("documents normalized Pagefind and NOT FINAL evidence-build contracts", () => {
    const readme = read("../README.md");
    const qa = read("../docs/QA_CHECKLIST.md");

    expect(`${readme}\n${qa}`).toContain("npm run build:evidence");
    expect(qa).toMatch(/normalized contract-required Pagefind payload.*800,000 B/i);
    expect(qa).toContain("dist/EVIDENCE_BUILD_NOT_FINAL.json");
    expect(qa).toMatch(/NOT FINAL/i);
    expect(qa).toMatch(/Human review required/i);
  });
});
