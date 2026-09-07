import type { GameConfig } from "../config/schema";

export interface BrandPresentation {
  mark: string;
  logoPath?: string;
  descriptor: string;
  coordinateLabel: string;
}

export function buildBrandPresentation(
  config: Pick<GameConfig, "brand" | "site">,
): BrandPresentation {
  return {
    mark: config.brand.mark,
    ...(config.brand.logoPath ? { logoPath: config.brand.logoPath } : {}),
    descriptor: config.brand.tagline,
    coordinateLabel: `${config.brand.shortName.toLocaleUpperCase("en")} / ${config.site.locale.toLocaleUpperCase("en")}`,
  };
}
