import { describe, expect, it } from "vitest";

import { resolveContentPages } from "../src/core/page-resolution";
import type { PageInventoryEntry } from "../src/data/schemas/page-inventory";

const guidePage: PageInventoryEntry = {
  pageId: "guide.getting-started",
  route: "/guides/getting-started/",
  pageType: "guide",
  cluster: "onboarding",
  module: "guides",
  feature: "guides",
  priority: 90,
  visibility: "public",
  publicationStatus: "published",
  contentStatus: "ready",
  developmentStatus: "ready",
  needsReview: false,
  needsUpdate: false,
  indexability: "index",
  title: "How to Configure This Game Site Starter",
  description:
    "Set the brand, feature flags, page inventory, and sourced facts before publishing your first production game guide.",
  publishedAt: "2026-09-01",
  updatedAt: "2026-09-01",
  primaryKeyword: "game site starter setup",
  tags: ["setup", "workflow", "publishing"],
  contentRef: { collection: "guides", slug: "getting-started" },
  relatedPageIds: ["home"],
  relatedEntityRefs: [],
  sources: [
    {
      sourceUrl: "https://gameatlas.example/guides/getting-started/",
      sourceType: "editorial",
      accessedAt: "2026-09-01",
      evidenceNote: "Starter operating instructions maintained with the repository.",
    },
  ],
  confidence: "high",
};

const contentEntry = {
  collection: "guides",
  id: "getting-started",
  data: { pageId: "guide.getting-started" },
};

describe("resolveContentPages", () => {
  it("rejects content whose pageId is missing from inventory", () => {
    expect(() =>
      resolveContentPages([guidePage], [
        { ...contentEntry, data: { pageId: "guide.unknown" } },
      ]),
    ).toThrow(/pageId/i);
  });

  it("rejects a content entry whose collection or slug does not match", () => {
    expect(() =>
      resolveContentPages([guidePage], [
        { ...contentEntry, id: "wrong-guide" },
      ]),
    ).toThrow(/contentRef/i);
  });

  it("rejects duplicate content entries for one inventory page", () => {
    expect(() =>
      resolveContentPages([guidePage], [contentEntry, contentEntry]),
    ).toThrow(/duplicate/i);
  });

  it("joins a valid content entry to its inventory-owned metadata", () => {
    const [resolved] = resolveContentPages([guidePage], [contentEntry]);

    expect(resolved.page).toBe(guidePage);
    expect(resolved.content).toBe(contentEntry);
  });
});
