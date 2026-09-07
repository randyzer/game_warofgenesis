import type {
  EntityReference,
  PageInventoryEntry,
} from "../data/schemas/page-inventory";
import { entityTypeKeys } from "../data/entity-modules";

export function findAffectedPageIds(
  inventory: PageInventoryEntry[],
  affectedEntities: EntityReference[],
) {
  const affectedKeys = new Set(
    affectedEntities.map(
      (reference) => `${reference.entityType}:${reference.entityId}`,
    ),
  );

  return inventory.flatMap((page) => {
    const references = [
      ...(page.entityRef ? [page.entityRef] : []),
      ...page.relatedEntityRefs,
    ];
    const isAffected = references.some((reference) =>
      affectedKeys.has(`${reference.entityType}:${reference.entityId}`),
    );

    return isAffected ? [page.pageId] : [];
  });
}

export function parsePatchImpactArgs(args: string[]): EntityReference {
  const values = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!flag || !["--entity-type", "--entity-id"].includes(flag)) {
      throw new Error(`Unknown patch-impact argument: ${flag ?? "(missing)"}`);
    }
    if (!value || value.startsWith("--")) {
      throw new Error(`Patch-impact argument ${flag} requires a value.`);
    }
    if (values.has(flag)) {
      throw new Error(`Patch-impact argument ${flag} may be provided only once.`);
    }
    values.set(flag, value);
  }

  const entityType = values.get("--entity-type");
  const entityId = values.get("--entity-id");
  if (!entityType || !entityTypeKeys.includes(entityType as EntityReference["entityType"])) {
    throw new Error(
      `--entity-type must be one of: ${entityTypeKeys.join(", ")}.`,
    );
  }
  if (!entityId || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entityId)) {
    throw new Error("--entity-id is required and must use kebab-case.");
  }

  return {
    entityType: entityType as EntityReference["entityType"],
    entityId,
  };
}
