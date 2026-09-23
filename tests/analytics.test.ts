import { describe, expect, it } from "vitest";

import {
  buildGoogleAnalyticsConfig,
  googleAnalyticsConfig,
  normalizeGoogleAnalyticsMeasurementId,
} from "../src/config/analytics";
import { collectExternalScriptErrors } from "../src/core/html-audit";
import { readFileSync } from "node:fs";

const MEASUREMENT_ID = "G-K0NGHRYPZ3";

describe("Google Analytics configuration", () => {
  it("uses the project measurement ID by default", () => {
    expect(googleAnalyticsConfig?.measurementId).toBe(MEASUREMENT_ID);
  });

  it("normalizes valid GA4 Measurement IDs and rejects malformed values", () => {
    expect(normalizeGoogleAnalyticsMeasurementId(`  ${MEASUREMENT_ID.toLowerCase()} `)).toBe(
      MEASUREMENT_ID,
    );
    for (const invalid of ["", "G-", "UA-123456", "G-INVALID_ID", "javascript:alert(1)"]) {
      expect(normalizeGoogleAnalyticsMeasurementId(invalid)).toBeNull();
    }
  });

  it("builds the exact gtag script URL and initialization", () => {
    const config = buildGoogleAnalyticsConfig(MEASUREMENT_ID);

    expect(config).toEqual({
      measurementId: MEASUREMENT_ID,
      scriptSrc: `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`,
      initScript: expect.stringContaining(`gtag('config', '${MEASUREMENT_ID}');`),
    });
    expect(config?.initScript).toContain("window.dataLayer = window.dataLayer || [];");
  });

  it("fails closed when no ID is configured", () => {
    expect(buildGoogleAnalyticsConfig("")).toBeNull();
  });
});

describe("Google Analytics HTML boundary", () => {
  it("allows only the configured analytics bootstrap through the external-script audit", () => {
    const config = buildGoogleAnalyticsConfig(MEASUREMENT_ID)!;
    const html = `<script async data-analytics-provider="google-analytics" src="${config.scriptSrc}"></script>`;
    const bootstrap = `<script data-analytics-bootstrap="google-analytics">${config.initScript}</script>`;

    expect(collectExternalScriptErrors("/", html, { enabled: false, placements: {} }, config)).toEqual([]);
    expect(collectExternalScriptErrors("/", html.replace("data-analytics-provider=\"google-analytics\"", "data-analytics-provider=\"other\""), { enabled: false, placements: {} }, config)).toEqual([
      "[/] External script reference is not allowed by default.",
    ]);
    expect(bootstrap).toContain(MEASUREMENT_ID);
  });

  it("keeps the global layout conditional on the environment variable", () => {
    const source = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
    expect(source).toContain("googleAnalyticsConfig &&");
    expect(source).toContain("data-analytics-bootstrap=\"google-analytics\"");
  });
});
