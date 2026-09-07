import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const componentUrls = {
  wikiArticle: new URL(
    "../src/components/wiki/WikiArticle.astro",
    import.meta.url,
  ),
  editorialArticle: new URL(
    "../src/components/EditorialArticle.astro",
    import.meta.url,
  ),
  entityDetail: new URL(
    "../src/components/EntityDetail.astro",
    import.meta.url,
  ),
  guideRoute: new URL(
    "../src/pages/guides/[...slug].astro",
    import.meta.url,
  ),
  toolShell: new URL(
    "../src/components/ToolShell.astro",
    import.meta.url,
  ),
};

function source(url: URL) {
  return readFileSync(url, "utf8");
}

function template(url: URL) {
  return source(url).split("---").slice(2).join("---");
}

describe("player-facing metadata", () => {
  it("keeps internal research labels out of public article and entity markup", () => {
    const forbiddenLabels =
      /Priority|Confidence|Search Signal|>Signal<|Internal tags|Filed under|Editorial brief|Evidence ledger|Provenance ledger|Current fact set|Formula ledger|before this route is published/i;

    for (const url of Object.values(componentUrls)) {
      expect(template(url)).not.toMatch(forbiddenLabels);
    }
  });

  it("removes internal sorting fields from the Guide Hub presentation", () => {
    const guideRoute = template(componentUrls.guideRoute);

    expect(guideRoute).not.toMatch(
      /guide\.priority|guide\.primaryKeyword|guide\.cluster/,
    );
    expect(guideRoute).toContain("Guide library");
    expect(guideRoute).toContain("Last updated");
  });

  it("uses shared player-facing primitives for editorial and entity pages", () => {
    const editorial = source(componentUrls.editorialArticle);
    const entity = source(componentUrls.entityDetail);

    expect(editorial).toContain("<Sources");
    expect(editorial).toContain("<RelatedPages");
    expect(editorial).not.toContain("sectionDescription");
    expect(entity).toContain("<QuickFacts");
    expect(entity).toContain("<Sources");
    expect(entity).toContain("<RelatedPages");
  });
});
