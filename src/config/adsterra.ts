const ADSTERRA_KEY_PATTERN = /^[0-9a-f]{32}$/;
const DEFAULT_ADSTERRA_DOMAIN = "pl31468463.profitableratecpmnetwork.com";

export interface AdsterraUnit {
  key: string;
  domain: string;
  scriptSrc: string;
  containerId: string;
}

/**
 * Reads one public build-time variable.
 * Astro/Vite exposes `import.meta.env`; Node-side build scripts that import this
 * module directly only have `process.env`, so both sources are supported.
 */
function readEnv(name: string): string {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, unknown> }).env;
  const value =
    viteEnv?.[name] ??
    (typeof process !== "undefined" ? process.env?.[name] : undefined);
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeAdsterraDomain(rawDomain: string): string | null {
  const candidate = rawDomain.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  if (!candidate) return null;
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(candidate) ? candidate.toLowerCase() : null;
}

/**
 * Builds one Adsterra unit from public identities only.
 * Returns null when the key or domain is missing or malformed, so ads fail closed.
 */
export function buildAdsterraUnit(
  rawKey: string,
  rawDomain: string = DEFAULT_ADSTERRA_DOMAIN,
): AdsterraUnit | null {
  const key = rawKey.trim().toLowerCase();
  if (!ADSTERRA_KEY_PATTERN.test(key)) return null;

  const domain = normalizeAdsterraDomain(rawDomain) ?? DEFAULT_ADSTERRA_DOMAIN;

  return {
    key,
    domain,
    scriptSrc: `https://${domain}/${key}/invoke.js`,
    containerId: `container-${key}`,
  };
}

/** Reads the Adsterra unit from public build-time environment variables. */
export function adsterraUnitFromEnv(): AdsterraUnit | null {
  const key = readEnv("PUBLIC_ADSTERRA_KEY");
  if (!key) return null;
  return buildAdsterraUnit(key, readEnv("PUBLIC_ADSTERRA_DOMAIN") || DEFAULT_ADSTERRA_DOMAIN);
}

export { DEFAULT_ADSTERRA_DOMAIN };
