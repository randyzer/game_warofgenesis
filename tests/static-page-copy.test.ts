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
    "marks %s copy as non-legal starter text requiring review",
    (pageType) => {
      const copy = getStaticPageCopy(pageType);

      expect(copy.reviewNotice).toMatch(/starter/i);
      expect(copy.reviewNotice).toMatch(/not legal advice/i);
      expect(copy.reviewNotice).toMatch(/qualified.*review/i);
    },
  );
});
