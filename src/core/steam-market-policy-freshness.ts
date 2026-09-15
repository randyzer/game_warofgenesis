import { STEAM_MARKET_POLICY } from "./steam-market-fees";

const REVIEW_INTERVAL_MS = 90 * 24 * 60 * 60 * 1000;

export function getSteamMarketPolicyFreshness(
  nowMs = Date.now(),
  verifiedAt: string = STEAM_MARKET_POLICY.verifiedAt,
): { fresh: boolean; expiresAtMs: number | null } {
  const verifiedAtMs = /^\d{4}-\d{2}-\d{2}$/.test(verifiedAt)
    ? Date.parse(`${verifiedAt}T00:00:00Z`)
    : Number.NaN;

  if (
    !Number.isFinite(verifiedAtMs) ||
    new Date(verifiedAtMs).toISOString().slice(0, 10) !== verifiedAt
  ) {
    return { fresh: false, expiresAtMs: null };
  }

  const expiresAtMs = verifiedAtMs + REVIEW_INTERVAL_MS;

  // Date-only verification is UTC; the next review is due at day 90 itself.
  return {
    fresh: Number.isFinite(nowMs) && nowMs >= verifiedAtMs && nowMs < expiresAtMs,
    expiresAtMs,
  };
}
