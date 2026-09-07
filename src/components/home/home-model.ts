import type { ResolvedPageMedia } from "../../data/media/catalog";
import type { PageInventoryEntry } from "../../data/schemas/page-inventory";

export interface HomepageQuickFact {
  label: string;
  value: string;
}

export interface HomepageFaqItem {
  question: string;
  answer: string;
}

export interface HomepageModelInput {
  enabledPages: readonly PageInventoryEntry[];
  featuredPages: readonly PageInventoryEntry[];
  quickFacts?: readonly HomepageQuickFact[];
  faq?: readonly HomepageFaqItem[];
  media?: ResolvedPageMedia;
}

function byPriority(left: PageInventoryEntry, right: PageInventoryEntry) {
  return (
    right.priority - left.priority ||
    left.title.localeCompare(right.title) ||
    left.pageId.localeCompare(right.pageId)
  );
}

function byLatestUpdate(left: PageInventoryEntry, right: PageInventoryEntry) {
  return right.updatedAt.localeCompare(left.updatedAt) || byPriority(left, right);
}

function isDirectoryRoot(page: PageInventoryEntry) {
  return page.pageType === "hub" || page.pageType === "database";
}

function isHomepageDirectoryPage(page: PageInventoryEntry) {
  return !["home", "privacy", "terms", "not-found"].includes(page.pageType);
}

export function buildHomepageModel({
  enabledPages,
  featuredPages,
  quickFacts = [],
  faq = [],
  media = { galleryMedia: [] },
}: HomepageModelInput) {
  const usedPageIds = new Set<string>();
  const heroStartPage = featuredPages[0];
  const startHere = heroStartPage ? [heroStartPage] : [];
  startHere.forEach((page) => usedPageIds.add(page.pageId));

  const categories: PageInventoryEntry[] = [];
  const categoryModules = new Set<PageInventoryEntry["module"]>();
  const rootCandidates = enabledPages
    .filter((page) => isDirectoryRoot(page) && !usedPageIds.has(page.pageId))
    .sort(byPriority);

  for (const page of rootCandidates) {
    if (categoryModules.has(page.module)) continue;
    categories.push(page);
    categoryModules.add(page.module);
    usedPageIds.add(page.pageId);
  }

  const featuredGuides = featuredPages.filter(
    (page) => page.pageType === "guide" && !usedPageIds.has(page.pageId),
  );
  featuredGuides.forEach((page) => usedPageIds.add(page.pageId));

  const importantSystems = rootCandidates.filter(
    (page) => !usedPageIds.has(page.pageId),
  );
  importantSystems.forEach((page) => usedPageIds.add(page.pageId));

  const latestUpdates = enabledPages
    .filter(
      (page) => page.pageType === "patch" && !usedPageIds.has(page.pageId),
    )
    .sort(byLatestUpdate);
  latestUpdates.forEach((page) => usedPageIds.add(page.pageId));

  const browseAll = enabledPages
    .filter(
      (page) =>
        isHomepageDirectoryPage(page) && !usedPageIds.has(page.pageId),
    )
    .sort(byPriority);

  return {
    heroStartPage,
    startHere,
    categories,
    featuredGuides,
    importantSystems,
    latestUpdates,
    browseAll,
    quickFacts: [...quickFacts],
    faq: [...faq],
    media,
  };
}
