import { findAffectedPageIds, parsePatchImpactArgs } from "../src/core/patch-impact";
import { pageInventory } from "../src/core/site-data";

try {
  const reference = parsePatchImpactArgs(process.argv.slice(2));
  const pageIds = findAffectedPageIds(pageInventory, [reference]);

  if (pageIds.length === 0) {
    console.log(
      `No inventory pages reference ${reference.entityType}:${reference.entityId}.`,
    );
  } else {
    console.log(`Affected pages for ${reference.entityType}:${reference.entityId}:`);
    for (const pageId of pageIds) console.log(`- ${pageId}`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Patch impact failed: ${message}`);
  process.exitCode = 1;
}
