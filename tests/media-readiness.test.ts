import { describe, expect, it } from "vitest";

import {
  collectMediaReadinessSignals,
  type MediaReadinessSignals,
  parseMediaDecisionTableMarkdown,
} from "../src/core/media-readiness";
import {
  pageInventory,
} from "../src/core/site-data";

describe("media readiness planning signal", () => {
  function signalsFromMarkdown(markdown: string): MediaReadinessSignals {
    const parsed = parseMediaDecisionTableMarkdown(markdown);
    const signals = collectMediaReadinessSignals({
      inventory: pageInventory,
      decisions: parsed.decisions,
    });

    return {
      errors: [...parsed.errors, ...signals.errors],
      warnings: signals.warnings,
      info: signals.info,
    };
  }

  it("passes when homepage HIGH PRIORITY media is resolved", () => {
    expect(
      collectMediaReadinessSignals({
        inventory: pageInventory,
        decisions: [
          {
            pageId: "home",
            priority: "HIGH PRIORITY",
            status: "resolved",
          },
        ],
      }),
    ).toEqual({ errors: [], warnings: [], info: [] });
  });

  it("blocks technical readiness when homepage HIGH PRIORITY media is unresolved", () => {
    const signals = collectMediaReadinessSignals({
      inventory: pageInventory,
      decisions: [
        {
          pageId: "home",
          priority: "HIGH PRIORITY",
          status: "unresolved",
        },
      ],
    });

    expect(signals.errors.join("\n")).toMatch(/home|HIGH PRIORITY|unresolved/i);
    expect(signals.warnings).toEqual([]);
  });

  it("warns without blocking when non-homepage HIGH PRIORITY media is unresolved", () => {
    const signals = collectMediaReadinessSignals({
      inventory: pageInventory,
      decisions: [
        {
          pageId: "guide.getting-started",
          priority: "HIGH PRIORITY",
          status: "unresolved",
        },
      ],
    });

    expect(signals.errors).toEqual([]);
    expect(signals.warnings.join("\n")).toMatch(/guide\.getting-started|HIGH PRIORITY|unresolved/i);
  });

  it("treats unresolved RECOMMENDED media as informational only", () => {
    const signals = collectMediaReadinessSignals({
      inventory: pageInventory,
      decisions: [
        {
          route: "/guides/getting-started/",
          priority: "RECOMMENDED",
          status: "unresolved",
        },
      ],
    });

    expect(signals.errors).toEqual([]);
    expect(signals.warnings).toEqual([]);
    expect(signals.info.join("\n")).toMatch(/RECOMMENDED|unresolved/i);
  });

  it("accepts NO MEDIA NEEDED without requiring image quota", () => {
    expect(
      collectMediaReadinessSignals({
        inventory: pageInventory,
        decisions: [
          {
            pageId: "about",
            priority: "NO MEDIA NEEDED",
            status: "unresolved",
            rationale: "Legal utility page.",
          },
        ],
      }),
    ).toEqual({ errors: [], warnings: [], info: [] });
  });

  it("preserves backward-compatible behavior when no optional artifact is supplied", () => {
    expect(
      collectMediaReadinessSignals({
        inventory: pageInventory,
      }),
    ).toEqual({ errors: [], warnings: [], info: [] });
  });

  it("parses a narrow MEDIA_DECISION_TABLE markdown artifact", () => {
    const parsed = parseMediaDecisionTableMarkdown(`
| Page ID | Route | Priority | Status | Rationale |
| --- | --- | --- | --- | --- |
| home | / | HIGH PRIORITY | resolved | Hero art integrated. |
| guide.getting-started |  | RECOMMENDED | unresolved | Nice to have. |
    `);

    expect(parsed.errors).toEqual([]);
    expect(parsed.decisions).toEqual([
      {
        pageId: "home",
        route: "/",
        priority: "HIGH PRIORITY",
        status: "resolved",
        rationale: "Hero art integrated.",
      },
      {
        pageId: "guide.getting-started",
        priority: "RECOMMENDED",
        status: "unresolved",
        rationale: "Nice to have.",
      },
    ]);
  });

  it("fails closed when a present table is empty or malformed", () => {
    expect(signalsFromMarkdown("").errors.join("\n")).toMatch(/MEDIA_DECISION_TABLE|table/i);
    expect(signalsFromMarkdown("home HIGH PRIORITY unresolved").errors.join("\n")).toMatch(/MEDIA_DECISION_TABLE|table/i);
  });

  it("fails closed when required columns are missing", () => {
    const signals = signalsFromMarkdown(`
| Page ID | Priority |
| --- | --- |
| home | HIGH PRIORITY |
    `);

    expect(signals.errors.join("\n")).toMatch(/required column.*Status/i);
  });

  it("fails closed when Priority is outside the supported readiness set", () => {
    const signals = signalsFromMarkdown(`
| Page ID | Priority | Status |
| --- | --- | --- |
| home | CRITICAL | unresolved |
    `);

    expect(signals.errors.join("\n")).toMatch(/Priority.*CRITICAL.*HIGH PRIORITY.*RECOMMENDED.*NO MEDIA NEEDED/i);
  });

  it("fails closed when Status is outside the supported readiness set", () => {
    const signals = signalsFromMarkdown(`
| Page ID | Priority | Status |
| --- | --- | --- |
| home | HIGH PRIORITY | pending |
    `);

    expect(signals.errors.join("\n")).toMatch(/Status.*pending.*resolved.*unresolved/i);
  });

  it("fails closed when a non-empty row cannot identify a page", () => {
    const signals = signalsFromMarkdown(`
| Page ID | Route | Priority | Status |
| --- | --- | --- | --- |
|  |  | HIGH PRIORITY | unresolved |
    `);

    expect(signals.errors.join("\n")).toMatch(/row \d+.*Page ID.*Route/i);
  });

  it("preserves severity through the markdown parser path", () => {
    expect(signalsFromMarkdown(`
| Page ID | Priority | Status |
| --- | --- | --- |
| home | HIGH PRIORITY | unresolved |
    `).errors.join("\n")).toMatch(/home.*HIGH PRIORITY.*unresolved/i);

    const nonHome = signalsFromMarkdown(`
| Page ID | Priority | Status |
| --- | --- | --- |
| guide.getting-started | HIGH PRIORITY | unresolved |
    `);
    expect(nonHome.errors).toEqual([]);
    expect(nonHome.warnings.join("\n")).toMatch(/guide\.getting-started.*HIGH PRIORITY.*unresolved/i);

    const recommended = signalsFromMarkdown(`
| Route | Priority | Status |
| --- | --- | --- |
| /guides/getting-started/ | RECOMMENDED | unresolved |
    `);
    expect(recommended.errors).toEqual([]);
    expect(recommended.info.join("\n")).toMatch(/RECOMMENDED.*unresolved/i);

    expect(signalsFromMarkdown(`
| Page ID | Priority | Status |
| --- | --- | --- |
| about | NO MEDIA NEEDED | unresolved |
    `)).toEqual({ errors: [], warnings: [], info: [] });
  });
});
