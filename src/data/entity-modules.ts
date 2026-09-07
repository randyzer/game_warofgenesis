import {
  parseHeroFacts,
  parseItemFacts,
  parseMapFacts,
  parseWeaponFacts,
} from "./schemas/facts";

export interface EntityModuleDefinitionContract {
  module: string;
  entityType: string;
  routeSegment: string;
  singularLabel: string;
  pluralLabel: string;
  parse: (input: unknown) => unknown[];
}

export function createEntityModuleIndex<
  const TDefinitions extends readonly EntityModuleDefinitionContract[],
>(definitions: TDefinitions) {
  type Definition = TDefinitions[number];

  return {
    definitions,
    byModule: new Map(
      definitions.map((definition) => [definition.module, definition]),
    ) as Map<Definition["module"], Definition>,
  };
}

export const entityModuleDefinitions = [
  {
    module: "heroes",
    entityType: "hero",
    routeSegment: "heroes",
    singularLabel: "Hero",
    pluralLabel: "Heroes",
    parse: parseHeroFacts,
  },
  {
    module: "weapons",
    entityType: "weapon",
    routeSegment: "weapons",
    singularLabel: "Weapon",
    pluralLabel: "Weapons",
    parse: parseWeaponFacts,
  },
  {
    module: "items",
    entityType: "item",
    routeSegment: "items",
    singularLabel: "Item",
    pluralLabel: "Items",
    parse: parseItemFacts,
  },
  {
    module: "maps",
    entityType: "map",
    routeSegment: "maps",
    singularLabel: "Map",
    pluralLabel: "Maps",
    parse: parseMapFacts,
  },
] as const satisfies readonly EntityModuleDefinitionContract[];

export type RegisteredEntityModuleDefinition =
  (typeof entityModuleDefinitions)[number];
export type EntityFactModule = RegisteredEntityModuleDefinition["module"];
export type EntityType = RegisteredEntityModuleDefinition["entityType"];
export type EntityFactsFor<TModule extends EntityFactModule> = ReturnType<
  Extract<RegisteredEntityModuleDefinition, { module: TModule }>["parse"]
>;

export const entityModuleIndex = createEntityModuleIndex(
  entityModuleDefinitions,
);
export const entityModuleKeys = entityModuleDefinitions.map(
  (definition) => definition.module,
) as [EntityFactModule, ...EntityFactModule[]];
export const entityTypeKeys = entityModuleDefinitions.map(
  (definition) => definition.entityType,
) as [EntityType, ...EntityType[]];

export function getEntityModuleDefinition<TModule extends EntityFactModule>(
  module: TModule,
): Extract<RegisteredEntityModuleDefinition, { module: TModule }> {
  return entityModuleIndex.byModule.get(module) as Extract<
    RegisteredEntityModuleDefinition,
    { module: TModule }
  >;
}
