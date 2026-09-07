import { describe, expect, it } from "vitest";

import {
  findAffectedPageIds,
  parsePatchImpactArgs,
} from "../src/core/patch-impact";
import { pageInventory } from "../src/core/site-data";

describe("findAffectedPageIds", () => {
  it("finds direct and related entity consumers without mutating workflow state", () => {
    const heroPage = pageInventory.find(
      (page) => page.pageId === "hero.demo-sentinel",
    );
    if (!heroPage) {
      throw new Error("Expected demo hero inventory fixture.");
    }
    const guidePage = {
      ...pageInventory.find((page) => page.pageId === "guide.getting-started")!,
      pageId: "guide.hero-counter",
      route: "/guides/hero-counter/",
      primaryKeyword: "demo hero counter",
      relatedEntityRefs: [
        { entityType: "hero" as const, entityId: "demo-sentinel" },
      ],
    };
    const before = {
      updatedAt: guidePage.updatedAt,
      needsUpdate: guidePage.needsUpdate,
    };

    expect(
      findAffectedPageIds([heroPage, guidePage], [
        { entityType: "hero", entityId: "demo-sentinel" },
      ]),
    ).toEqual(["hero.demo-sentinel", "guide.hero-counter"]);
    expect({
      updatedAt: guidePage.updatedAt,
      needsUpdate: guidePage.needsUpdate,
    }).toEqual(before);
  });

  it("parses an explicit entity type and ID for the CLI", () => {
    expect(
      parsePatchImpactArgs([
        "--entity-type",
        "hero",
        "--entity-id",
        "demo-sentinel",
      ]),
    ).toEqual({ entityType: "hero", entityId: "demo-sentinel" });
    expect(() => parsePatchImpactArgs(["--entity-type", "hero"])).toThrow(
      /entity-id/i,
    );
    expect(() =>
      parsePatchImpactArgs([
        "--entity-type",
        "account",
        "--entity-id",
        "demo-sentinel",
      ]),
    ).toThrow(/entity-type/i);
  });
});
