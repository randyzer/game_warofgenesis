import { describe, expect, it } from "vitest";

import { getStaticPageCopy } from "../src/core/static-page-copy";

describe("getStaticPageCopy", () => {
  it("provides an evidence-led editorial method for the about page", () => {
    const copy = getStaticPageCopy("about");

    expect(copy.sections.map((section) => section.heading).join(" ")).toMatch(
      /sources|publishing|facts/i,
    );
    expect(copy.reviewNotice).toBeUndefined();
  });

  it.each(["privacy", "terms"] as const)(
    "publishes truthful %s copy without template instructions",
    (pageType) => {
      const copy = getStaticPageCopy(pageType);
      const visibleCopy = JSON.stringify(copy);

      expect(copy.reviewNotice).toBeUndefined();
      expect(visibleCopy).not.toMatch(
        /draft|replace|add your|todo|tbd|placeholder|operator action required/i,
      );
    },
  );

  it("does not invent operator, contact, or retention facts", () => {
    const legalCopy = JSON.stringify({
      privacy: getStaticPageCopy("privacy"),
      terms: getStaticPageCopy("terms"),
    });

    expect(legalCopy).not.toMatch(
      /street address|complaint department|legal representative|retain (?:logs|data) for \d+|retention (?:period )?(?:is|of) \d+/i,
    );
  });
});
