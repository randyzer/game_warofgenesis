import type { GameConfig } from "../config/schema";
import type { PageInventoryEntry } from "../data/schemas/page-inventory";

export function buildEnabledPageCatalog(
  config: GameConfig,
  inventory: PageInventoryEntry[],
) {
  return inventory.filter(
    (page) =>
      page.visibility === "public" &&
      page.publicationStatus === "published" &&
      (!page.feature || config.features[page.feature]),
  );
}
