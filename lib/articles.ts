import type { MDXContent } from "mdx/types";

import ControlsContent, {
  metadata as controlsMetadata,
} from "@/content/guides/controls.mdx";
import GearForgingContent, {
  metadata as gearForgingMetadata,
} from "@/content/guides/gear-forging.mdx";
import GettingStartedContent, {
  metadata as gettingStartedMetadata,
} from "@/content/guides/getting-started.mdx";
import HowToPlayContent, {
  metadata as howToPlayMetadata,
} from "@/content/guides/how-to-play.mdx";
import OverviewContent, {
  metadata as overviewMetadata,
} from "@/content/guides/overview.mdx";
import SquadBuildingContent, {
  metadata as squadBuildingMetadata,
} from "@/content/guides/squad-building.mdx";
import WorldProgressContent, {
  metadata as worldProgressMetadata,
} from "@/content/guides/world-progress.mdx";

export interface ArticleSection {
  id: string;
  label: string;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleMetadata {
  slug: string;
  title: string;
  description: string;
  category: "Guides";
  publishedAt: string;
  cover: string;
  coverAlt: string;
  sections: ArticleSection[];
  faqs: ArticleFaq[];
}

export interface ArticleRecord {
  metadata: ArticleMetadata;
  Content: MDXContent;
}

interface ArticleRegistryEntry {
  article: ArticleRecord;
  source: string;
}

const SAFE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNonEmptyString(
  record: Record<PropertyKey, unknown>,
  field: string,
  source: string,
): string {
  const value = record[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${source}: metadata.${field} must be a non-empty string`);
  }

  return value;
}

function readObjectArray<T>(
  record: Record<PropertyKey, unknown>,
  field: "sections" | "faqs",
  source: string,
  parseItem: (
    item: Record<PropertyKey, unknown>,
    itemSource: string,
    index: number,
  ) => T,
): T[] {
  const value = record[field];

  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${source}: metadata.${field} must be a non-empty array`);
  }

  const items: T[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const itemSource = `${source}: metadata.${field}[${index}]`;

    if (!Object.hasOwn(value, index)) {
      throw new Error(`${itemSource} must be present`);
    }

    const item = value[index];
    if (!isRecord(item)) {
      throw new Error(`${itemSource} must be an object`);
    }

    items.push(parseItem(item, itemSource, index));
  }

  return items;
}

export function parseArticleMetadata(
  value: unknown,
  source: string,
): ArticleMetadata {
  if (!isRecord(value)) {
    throw new Error(`${source}: metadata must be an object`);
  }

  const slug = readNonEmptyString(value, "slug", source);
  if (!SAFE_SLUG_PATTERN.test(slug)) {
    throw new Error(
      `${source}: metadata.slug must contain lowercase letters, numbers, and single hyphens only`,
    );
  }

  const category = readNonEmptyString(value, "category", source);
  if (category !== "Guides") {
    throw new Error(`${source}: metadata.category must be exactly "Guides"`);
  }

  const publishedAt = readNonEmptyString(value, "publishedAt", source);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    throw new Error(`${source}: metadata.publishedAt must use YYYY-MM-DD`);
  }

  const parsedDate = new Date(`${publishedAt}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== publishedAt
  ) {
    throw new Error(`${source}: metadata.publishedAt must be a valid date`);
  }

  const cover = readNonEmptyString(value, "cover", source);
  if (
    !cover.startsWith("/") ||
    cover.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(cover)
  ) {
    throw new Error(
      `${source}: metadata.cover must be a site-absolute path with one leading "/" and no backslashes or control characters; received ${JSON.stringify(cover)}`,
    );
  }

  const sectionIdIndexes = new Map<string, number>();
  const sections = readObjectArray(
    value,
    "sections",
    source,
    (item, itemSource, index) => {
      const id = readNonEmptyString(item, "id", itemSource);

      if (!SAFE_SLUG_PATTERN.test(id)) {
        throw new Error(
          `${itemSource}.id must be a safe fragment slug; received ${JSON.stringify(id)}`,
        );
      }

      const firstIndex = sectionIdIndexes.get(id);
      if (firstIndex !== undefined) {
        throw new Error(
          `${itemSource}.id duplicates ${JSON.stringify(id)} first declared at metadata.sections[${firstIndex}].id`,
        );
      }

      sectionIdIndexes.set(id, index);

      return {
        id,
        label: readNonEmptyString(item, "label", itemSource),
      };
    },
  );
  const faqs = readObjectArray(value, "faqs", source, (item, itemSource) => ({
    question: readNonEmptyString(item, "question", itemSource),
    answer: readNonEmptyString(item, "answer", itemSource),
  }));

  return {
    slug,
    title: readNonEmptyString(value, "title", source),
    description: readNonEmptyString(value, "description", source),
    category,
    publishedAt,
    cover,
    coverAlt: readNonEmptyString(value, "coverAlt", source),
    sections,
    faqs,
  };
}

function createRegistryEntry(
  metadata: unknown,
  Content: MDXContent,
  source: string,
): ArticleRegistryEntry {
  return {
    article: {
      metadata: parseArticleMetadata(metadata, source),
      Content,
    },
    source,
  };
}

function assertUniqueArticleSlugs(
  entries: readonly ArticleRegistryEntry[],
): void {
  const slugSources = new Map<string, string>();

  for (const entry of entries) {
    const { slug } = entry.article.metadata;
    const firstSource = slugSources.get(slug);

    if (firstSource !== undefined) {
      throw new Error(
        `duplicate article slug ${JSON.stringify(slug)} in ${entry.source}; first declared in ${firstSource}`,
      );
    }

    slugSources.set(slug, entry.source);
  }
}

const overviewEntry = createRegistryEntry(
  overviewMetadata,
  OverviewContent,
  "content/guides/overview.mdx",
);

const guideEntries: readonly ArticleRegistryEntry[] = [
  createRegistryEntry(
    howToPlayMetadata,
    HowToPlayContent,
    "content/guides/how-to-play.mdx",
  ),
  createRegistryEntry(
    gettingStartedMetadata,
    GettingStartedContent,
    "content/guides/getting-started.mdx",
  ),
  createRegistryEntry(
    controlsMetadata,
    ControlsContent,
    "content/guides/controls.mdx",
  ),
  createRegistryEntry(
    squadBuildingMetadata,
    SquadBuildingContent,
    "content/guides/squad-building.mdx",
  ),
  createRegistryEntry(
    gearForgingMetadata,
    GearForgingContent,
    "content/guides/gear-forging.mdx",
  ),
  createRegistryEntry(
    worldProgressMetadata,
    WorldProgressContent,
    "content/guides/world-progress.mdx",
  ),
];

assertUniqueArticleSlugs([overviewEntry, ...guideEntries]);

export const guideOverview: ArticleRecord = overviewEntry.article;

const unsortedGuideArticles: readonly ArticleRecord[] = guideEntries.map(
  (entry) => entry.article,
);

export const guideArticles: readonly ArticleRecord[] = [
  ...unsortedGuideArticles,
].sort((left, right) =>
  right.metadata.publishedAt.localeCompare(left.metadata.publishedAt),
);

export function getGuideBySlug(slug: string): ArticleRecord | undefined {
  return guideArticles.find((article) => article.metadata.slug === slug);
}

export function getRelatedGuides(slug: string, limit = 6): ArticleRecord[] {
  if (!Number.isFinite(limit)) {
    throw new RangeError("getRelatedGuides limit must be a finite number");
  }

  const safeLimit = Math.max(0, Math.floor(limit));

  return guideArticles
    .filter((article) => article.metadata.slug !== slug)
    .slice(0, safeLimit);
}
