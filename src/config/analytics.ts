const GA4_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,20}$/i;

export const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-K0NGHRYPZ3";

export interface GoogleAnalyticsConfig {
  measurementId: string;
  scriptSrc: string;
  initScript: string;
}

function readEnv(name: string): string {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, unknown> }).env;
  const value =
    viteEnv?.[name] ??
    (typeof process !== "undefined" ? process.env?.[name] : undefined);
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeGoogleAnalyticsMeasurementId(rawId: string): string | null {
  const measurementId = rawId.trim().toUpperCase();
  return GA4_MEASUREMENT_ID_PATTERN.test(measurementId) ? measurementId : null;
}

export function buildGoogleAnalyticsConfig(rawId: string): GoogleAnalyticsConfig | null {
  const measurementId = normalizeGoogleAnalyticsMeasurementId(rawId);
  if (!measurementId) return null;

  return {
    measurementId,
    scriptSrc: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    initScript: [
      "window.dataLayer = window.dataLayer || [];",
      "function gtag(){window.dataLayer.push(arguments);}",
      "gtag('js', new Date());",
      `gtag('config', '${measurementId}');`,
    ].join("\n"),
  };
}

export const googleAnalyticsConfig = buildGoogleAnalyticsConfig(
  readEnv("PUBLIC_GA_MEASUREMENT_ID") || GOOGLE_ANALYTICS_MEASUREMENT_ID,
);
