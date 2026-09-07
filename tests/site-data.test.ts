import { describe, expect, it } from "vitest";

import { defineGameConfig } from "../src/config/schema";
import {
  enabledPageCatalog,
  featuredHomepagePages,
  getPageByRoute,
  getRelatedPages,
  homepageBrowsePages,
  pageInventory,
  resolveNavigationGroups,
  resolvedNavigationGroups,
  siteConfig,
} from "../src/core/site-data";

describe("site data", () => {
  it("exposes only routes allowed by config and inventory", () => {
    for (const page of pageInventory) {
      const shouldBeEnabled =
        page.visibility === "public" &&
        page.publicationStatus === "published" &&
        (!page.feature || siteConfig.features[page.feature]);

      expect(
        enabledPageCatalog.some((candidate) => candidate.pageId === page.pageId),
        page.pageId,
      ).toBe(shouldBeEnabled);
    }
  });

  it("finds a routable page by its canonical route", () => {
    expect(getPageByRoute("/").pageId).toBe("home");
    expect(() => getPageByRoute("/__missing-test-route__/")).toThrow(
      /enabled page/i,
    );
  });

  it("resolves related pages without leaking disabled modules", () => {
    const home = getPageByRoute("/");

    const enabledPageIds = new Set(
      enabledPageCatalog.map((page) => page.pageId),
    );
    expect(getRelatedPages(home).map((page) => page.pageId)).toEqual(
      home.relatedPageIds.filter((pageId) => enabledPageIds.has(pageId)),
    );
  });

  it("resolves configured navigation groups and homepage references in order", () => {
    expect(
      resolvedNavigationGroups.map(({ label, page, children }) => ({
        label,
        pageId: page.pageId,
        childPageIds: children.map((child) => child.pageId),
      })),
    ).toEqual(
      siteConfig.navigation.groups.map((group) => ({
        label: "label" in group ? group.label : undefined,
        pageId: group.pageId,
        childPageIds: group.children,
      })),
    );
    expect(featuredHomepagePages.map((page) => page.pageId)).toEqual(
      siteConfig.homepage.featuredPageIds,
    );
  });

  it("fails navigation resolution instead of filtering a disabled page", () => {
    const excludedPage = enabledPageCatalog[0];
    const config = defineGameConfig({
      ...siteConfig,
      navigation: { groups: [{ pageId: excludedPage.pageId }] },
    });

    expect(() =>
      resolveNavigationGroups(
        config.navigation.groups,
        enabledPageCatalog.filter(
          (page) => page.pageId !== excludedPage.pageId,
        ),
      ),
    ).toThrow(new RegExp(`${excludedPage.pageId}.*enabled catalog`, "i"));
  });

  it("keeps legal and error routes out of the homepage content directory", () => {
    expect(homepageBrowsePages.map((page) => page.pageId)).toEqual(
      enabledPageCatalog
        .filter(
          (page) =>
            page.visibility === "public" &&
            !["home", "privacy", "terms", "not-found"].includes(
              page.pageType,
            ),
        )
        .map((page) => page.pageId),
    );
  });
});
