import { describe, expect, it } from "vitest";

import { getSteamMarketPolicyFreshness } from "../src/core/steam-market-policy-freshness";

describe("Steam Market fee policy freshness", () => {
  it("allows calculations on the verified date and before day 90", () => {
    for (const now of ["2026-09-15T00:00:00Z", "2026-12-13T23:59:59.999Z"]) {
      expect(getSteamMarketPolicyFreshness(Date.parse(now))).toEqual({
        fresh: true,
        expiresAtMs: Date.parse("2026-12-14T00:00:00Z"),
      });
    }
  });

  it.each([
    "2026-12-14T00:00:00Z",
    "2026-12-14T00:00:00.001Z",
    "2026-12-15T12:00:00Z",
  ])("requires review at or after the UTC 90-day boundary: %s", (now) => {
    expect(getSteamMarketPolicyFreshness(Date.parse(now))).toEqual({
      fresh: false,
      expiresAtMs: Date.parse("2026-12-14T00:00:00Z"),
    });
  });

  it.each(["", "invalid", "2026-02-30", "2026-9-15", "2026-09-15T12:00:00Z"])(
    "fails closed for a missing or invalid verification date: %s",
    (verifiedAt) => {
      expect(getSteamMarketPolicyFreshness(Date.parse("2026-09-15T12:00:00Z"), verifiedAt))
        .toEqual({ fresh: false, expiresAtMs: null });
    },
  );

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "fails closed for an invalid current timestamp: %s",
    (now) => {
      expect(getSteamMarketPolicyFreshness(now).fresh).toBe(false);
    },
  );

  it("does not accept a verification date in the future", () => {
    expect(getSteamMarketPolicyFreshness(Date.parse("2026-09-14T23:59:59.999Z")).fresh)
      .toBe(false);
  });
});
