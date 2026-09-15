import { existsSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SteamMarketFeeCalculator from "../src/components/islands/SteamMarketFeeCalculator";

const toolRouteUrl = new URL("../src/pages/tools/[slug].astro", import.meta.url);
const toolShellUrl = new URL(
  "../src/components/SteamMarketFeeTool.astro",
  import.meta.url,
);

describe("Steam Market fee calculator page", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the focused Steam fee tool instead of the generic scalar calculator", () => {
    const route = readFileSync(toolRouteUrl, "utf8");

    expect(existsSync(toolShellUrl)).toBe(true);
    expect(route).toContain("SteamMarketFeeTool");
    expect(route).toContain('record.slug === "steam-market-fee-calculator"');
  });

  it("renders the complete per-item fee decomposition and quantity totals", () => {
    const html = renderToStaticMarkup(createElement(SteamMarketFeeCalculator, {
      initialPrice: "1.00",
      initialQuantity: "3",
    }));

    expect(html).toContain("Buyer pays");
    expect(html).toContain("Seller receives");
    expect(html).toContain("Steam fee");
    expect(html).toContain("Game/publisher fee");
    expect(html).toContain("Total fees");
    expect(html).toContain("3-item totals");
    expect(html).toContain("$3.00");
    expect(html).toContain("$2.64");
    expect(html).toContain('aria-live="polite"');
  });

  it("shows the exact unreachable-price message and both adjacent totals", () => {
    const html = renderToStaticMarkup(createElement(SteamMarketFeeCalculator, {
      initialPrice: "30.00",
    }));

    expect(html).toContain(
      "This exact buyer price is not reachable under the current fee model.",
    );
    expect(html).toContain("Nearest lower");
    expect(html).toContain("$29.99");
    expect(html).toContain("Nearest upper");
    expect(html).toContain("$30.01");
    expect(html).not.toContain("Seller receives per item");
  });

  it("supports seller-receives input with exact integer-cent output", () => {
    const html = renderToStaticMarkup(createElement(SteamMarketFeeCalculator, {
      initialMode: "seller",
      initialPrice: "1.00",
    }));

    expect(html).toContain("Desired seller proceeds per item");
    expect(html).toContain("$1.15");
    expect(html).toContain("$0.05");
    expect(html).toContain("$0.10");
  });

  it("calculates until just before the 90-day review boundary", () => {
    vi.setSystemTime(new Date("2026-12-13T23:59:59.999Z"));
    const html = renderToStaticMarkup(createElement(SteamMarketFeeCalculator));

    expect(html).toContain("Fee decomposition");
    expect(html).toContain("$0.88");
  });

  // A review every 90 days is due at, not after, the UTC 90-day anniversary.
  it.each([
    ["exactly 90 days", "2026-12-14T00:00:00Z"],
    ["over 90 days", "2026-12-14T00:00:00.001Z"],
    ["91.5 days", "2026-12-15T12:00:00Z"],
  ])("blocks both directions at %s and requests re-verification", (_, now) => {
    vi.setSystemTime(new Date(now));
    for (const initialMode of ["buyer", "seller"] as const) {
      const html = renderToStaticMarkup(createElement(SteamMarketFeeCalculator, {
        initialMode,
        initialPrice: "1.00",
        initialQuantity: "3",
      }));

      expect(html).toContain(
        "Fee policy needs re-verification before calculations can be shown.",
      );
      expect(html).toContain('role="alert"');
      expect(html).toContain('value="1.00"');
      expect(html).toContain('value="3"');
      expect(html).not.toContain("Fee decomposition");
      expect(html).not.toContain('class="fee-breakdown"');
      expect(html).not.toContain("3-item totals");
      expect(html).not.toContain("Effective fees:");
      expect(html).not.toContain("$0.88");
    }
  });

  it("does not render a previous valid result once expiry is detected", () => {
    const props = { initialPrice: "1.00", initialQuantity: "3" };
    const valid = renderToStaticMarkup(createElement(SteamMarketFeeCalculator, props));
    expect(valid).toContain("$2.64");

    vi.setSystemTime(new Date("2026-12-15T12:00:00Z"));
    const expired = renderToStaticMarkup(createElement(SteamMarketFeeCalculator, props));
    expect(expired).not.toContain("$2.64");
    expect(expired).not.toContain("Fee decomposition");
  });

  it("hides unreachable-price neighbors when the policy expires", () => {
    vi.setSystemTime(new Date("2026-12-15T12:00:00Z"));
    const html = renderToStaticMarkup(createElement(SteamMarketFeeCalculator, {
      initialPrice: "30.00",
    }));

    expect(html).toContain("Fee policy needs re-verification");
    expect(html).not.toContain("Nearest lower");
    expect(html).not.toContain("$29.99");
    expect(html).not.toContain("$30.01");
  });
});
