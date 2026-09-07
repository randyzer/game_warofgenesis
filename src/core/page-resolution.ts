import type { PageInventoryEntry } from "../data/schemas/page-inventory";

export interface ContentEntryReference<TContent = unknown> {
  collection: string;
  id: string;
  data: {
    pageId: string;
  };
  body?: TContent;
}

export function resolveContentPages<
  TEntry extends ContentEntryReference,
>(inventory: PageInventoryEntry[], contentEntries: TEntry[]) {
  const inventoryByPageId = new Map(
    inventory.map((page) => [page.pageId, page]),
  );
  const resolvedPageIds = new Set<string>();

  return contentEntries.map((content) => {
    const { pageId } = content.data;

    if (resolvedPageIds.has(pageId)) {
      throw new Error(`Duplicate content entry for pageId: ${pageId}`);
    }

    const page = inventoryByPageId.get(pageId);
    if (!page) {
      throw new Error(`Content references an unknown pageId: ${pageId}`);
    }

    if (
      !page.contentRef ||
      page.contentRef.collection !== content.collection ||
      page.contentRef.slug !== content.id
    ) {
      throw new Error(
        `Content entry does not match contentRef for pageId: ${pageId}`,
      );
    }

    resolvedPageIds.add(pageId);
    return { page, content };
  });
}
