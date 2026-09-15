export const canonicalAdPlacements = ["home-primary", "before-footer"] as const;

// Add reviewed project-specific literal placements here. Keep the list small.
export const projectAdPlacements = [] as const satisfies readonly string[];

export type CanonicalAdPlacement = (typeof canonicalAdPlacements)[number];
export type ProjectAdPlacement = (typeof projectAdPlacements)[number];
export type AdPlacement = CanonicalAdPlacement | ProjectAdPlacement;

export interface AdPlacementDefinition {
  enabled: boolean;
  instanceId: string;
  publicSlotId: string;
  width?: number;
  height?: number;
}

export interface AdsConfig<Placement extends string = AdPlacement> {
  enabled: boolean;
  placements: Partial<Record<Placement, AdPlacementDefinition>>;
}

const knownPlacements = new Set<string>([
  ...canonicalAdPlacements,
  ...projectAdPlacements,
]);

export function defineAdsConfig<const Placement extends AdPlacement>(
  config: AdsConfig<Placement>,
): AdsConfig<Placement> {
  const enabledInstances = new Set<string>();

  for (const [placement, definition] of Object.entries(config.placements) as Array<
    [string, AdPlacementDefinition]
  >) {
    if (!knownPlacements.has(placement)) {
      throw new Error(`Unknown semantic ad placement: ${placement}`);
    }
    if (!definition.enabled) continue;

    if (!definition.instanceId.trim()) {
      throw new Error(`Enabled ad placement ${placement} requires an instance identity.`);
    }
    if (!definition.publicSlotId.trim()) {
      throw new Error(`Enabled ad placement ${placement} requires a public slot identity.`);
    }
    if (enabledInstances.has(definition.instanceId)) {
      throw new Error(`Duplicate ad instance identity: ${definition.instanceId}`);
    }
    enabledInstances.add(definition.instanceId);

    const hasWidth = definition.width !== undefined;
    const hasHeight = definition.height !== undefined;
    const validDimensions =
      !hasWidth &&
      !hasHeight ||
      hasWidth &&
        hasHeight &&
        Number.isFinite(definition.width) &&
        Number.isFinite(definition.height) &&
        definition.width! > 0 &&
        definition.height! > 0;
    if (!validDimensions) {
      throw new Error(
        `Enabled ad placement ${placement} dimensions must be positive width and height together.`,
      );
    }
  }

  return config;
}

export function resolveAdPlacement<Placement extends string>(
  config: AdsConfig<Placement>,
  placement: Placement,
  localEnabled = true,
): AdPlacementDefinition | null {
  if (!localEnabled || !config.enabled) return null;
  const definition = config.placements[placement];
  return definition?.enabled ? definition : null;
}

export const adsConfig: AdsConfig = defineAdsConfig({
  enabled: false,
  placements: {},
});
