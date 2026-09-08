import type { Provenance } from "../data/schemas/provenance";

export interface PublicSource {
  sourceUrl: string;
  sourceType: Provenance["sourceType"];
  sourceTypeLabel: string;
  host: string;
  accessedAt: string;
  publishedAt?: string;
}

export function projectPublicSources(sources: Provenance[]): PublicSource[] {
  return sources.map((source) => ({
    sourceUrl: source.sourceUrl,
    sourceType: source.sourceType,
    sourceTypeLabel: source.sourceType.replaceAll("-", " "),
    host: new URL(source.sourceUrl).hostname.replace(/^www\./, ""),
    accessedAt: source.accessedAt,
    ...(source.publishedAt ? { publishedAt: source.publishedAt } : {}),
  }));
}
