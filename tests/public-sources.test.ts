import { describe, expect, it } from "vitest";

import { projectPublicSources } from "../src/core/public-sources";
import type { Provenance } from "../src/data/schemas/provenance";

const source: Provenance = {
  sourceUrl: "https://example.com/reviewed-source",
  sourceType: "official",
  accessedAt: "2026-09-08",
  publishedAt: "2026-09-01",
  evidenceNote: "INTERNAL_EVIDENCE_NOTE_MARKER retained for validation only.",
};

describe("public source projection", () => {
  it("retains evidenceNote internally while omitting it from public source fields", () => {
    expect(source.evidenceNote).toContain("INTERNAL_EVIDENCE_NOTE_MARKER");

    const [publicSource] = projectPublicSources([source]);

    expect(publicSource).toEqual({
      sourceUrl: "https://example.com/reviewed-source",
      sourceType: "official",
      sourceTypeLabel: "official",
      host: "example.com",
      accessedAt: "2026-09-08",
      publishedAt: "2026-09-01",
    });
    expect(JSON.stringify(publicSource)).not.toContain("INTERNAL_EVIDENCE_NOTE_MARKER");
    expect("evidenceNote" in publicSource).toBe(false);
  });
});
