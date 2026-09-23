import { adsterraUnitFromEnv, type AdsterraUnit } from "./adsterra";

export const canonicalAdPlacements = ["home-primary", "before-footer"] as const;

// Add reviewed project-specific literal placements here. Keep the list small.
export const projectAdPlacements = ["article-after-intro"] as const satisfies readonly string[];

export type CanonicalAdPlacement = (typeof canonicalAdPlacements)[number];
export type ProjectAdPlacement = (typeof projectAdPlacements)[number];
export type AdPlacement = CanonicalAdPlacement | ProjectAdPlacement;

export interface AdProviderDefinition {
  /** Provider bootstrap script URL. Public by design; never a private credential. */
  scriptSrc: string;
  /** DOM id the provider script fills with its creative. */
  containerId: string;
  /** Stable audit identity for the bootstrap resource. */
  bootstrapId: string;
}

export interface AdPlacementDefinition {
  enabled: boolean;
  instanceId: string;
  publicSlotId: string;
  width?: number;
  height?: number;
  provider?: AdProviderDefinition;
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

/**
 * Maps one Adsterra unit onto the semantic placements that carry it.
 * Each route renders at most one placement, so the single provider container id
 * and bootstrap resource stay unique per page.
 */
export function buildAdsterraAdsConfig(unit: AdsterraUnit | null): AdsConfig {
  if (!unit) return defineAdsConfig({ enabled: false, placements: {} });

  const provider: AdProviderDefinition = {
    scriptSrc: unit.scriptSrc,
    containerId: unit.containerId,
    bootstrapId: `adsterra-${unit.key}`,
  };

  return defineAdsConfig({
    enabled: true,
    placements: {
      "home-primary": {
        enabled: true,
        instanceId: "adsterra-home-primary",
        publicSlotId: unit.containerId,
        provider,
      },
      "article-after-intro": {
        enabled: true,
        instanceId: "adsterra-article-after-intro",
        publicSlotId: unit.containerId,
        provider,
      },
    },
  });
}

export const adsConfig: AdsConfig = buildAdsterraAdsConfig(adsterraUnitFromEnv());
