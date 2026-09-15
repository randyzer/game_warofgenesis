import { describe, expect, it } from "vitest";

import {
  calculateFromBuyerPays,
  calculateFromSellerReceives,
  multiplyBreakdownForQuantity,
  parseQuantity,
  parseUsdInput,
} from "../src/core/steam-market-fees";

const POLICY_VECTORS = [
  { buyerPaysCents: 3, sellerReceivesCents: 1, steamFeeCents: 1, gameFeeCents: 1 },
  { buyerPaysCents: 5, sellerReceivesCents: 3, steamFeeCents: 1, gameFeeCents: 1 },
  { buyerPaysCents: 10, sellerReceivesCents: 8, steamFeeCents: 1, gameFeeCents: 1 },
  { buyerPaysCents: 100, sellerReceivesCents: 88, steamFeeCents: 4, gameFeeCents: 8 },
  { buyerPaysCents: 500, sellerReceivesCents: 436, steamFeeCents: 21, gameFeeCents: 43 },
  { buyerPaysCents: 1_000, sellerReceivesCents: 870, steamFeeCents: 43, gameFeeCents: 87 },
  { buyerPaysCents: 1_340, sellerReceivesCents: 1_166, steamFeeCents: 58, gameFeeCents: 116 },
  { buyerPaysCents: 3_001, sellerReceivesCents: 2_610, steamFeeCents: 130, gameFeeCents: 261 },
  { buyerPaysCents: 19_360, sellerReceivesCents: 16_836, steamFeeCents: 841, gameFeeCents: 1_683 },
] as const;

describe("approved War of Genesis Steam Market fee vectors", () => {
  it.each(POLICY_VECTORS)(
    "decomposes buyer total $buyerPaysCents cents exactly",
    (vector) => {
      expect(calculateFromBuyerPays(vector.buyerPaysCents)).toEqual({
        exact: true,
        buyerPaysCents: vector.buyerPaysCents,
        sellerReceivesCents: vector.sellerReceivesCents,
        steamFeeCents: vector.steamFeeCents,
        gameFeeCents: vector.gameFeeCents,
        totalFeeCents: vector.steamFeeCents + vector.gameFeeCents,
      });
    },
  );

  it.each(POLICY_VECTORS)(
    "reconstructs buyer total from $sellerReceivesCents seller cents",
    (vector) => {
      expect(calculateFromSellerReceives(vector.sellerReceivesCents)).toEqual({
        buyerPaysCents: vector.buyerPaysCents,
        sellerReceivesCents: vector.sellerReceivesCents,
        steamFeeCents: vector.steamFeeCents,
        gameFeeCents: vector.gameFeeCents,
        totalFeeCents: vector.steamFeeCents + vector.gameFeeCents,
      });
    },
  );
});

describe("buyer-total reachability", () => {
  it("returns both adjacent totals instead of approximating $30.00", () => {
    expect(calculateFromBuyerPays(3_000)).toEqual({
      exact: false,
      requestedBuyerPaysCents: 3_000,
      lowerValidResult: {
        buyerPaysCents: 2_999,
        sellerReceivesCents: 2_609,
        steamFeeCents: 130,
        gameFeeCents: 260,
        totalFeeCents: 390,
      },
      upperValidResult: {
        buyerPaysCents: 3_001,
        sellerReceivesCents: 2_610,
        steamFeeCents: 130,
        gameFeeCents: 261,
        totalFeeCents: 391,
      },
    });
  });

  it.each([2_999, 3_001])("keeps adjacent total %i reachable", (buyerPaysCents) => {
    expect(calculateFromBuyerPays(buyerPaysCents).exact).toBe(true);
  });

  it("rejects buyer totals outside the product input range", () => {
    expect(() => calculateFromBuyerPays(2)).toThrow(/at least.*\$0\.03/i);
    expect(() => calculateFromBuyerPays(50_001)).toThrow(/product cap.*\$500\.00/i);
  });

  it("rejects invalid internal seller amounts", () => {
    expect(() => calculateFromSellerReceives(0)).toThrow(/positive integer/i);
    expect(() => calculateFromSellerReceives(1.5)).toThrow(/positive integer/i);
  });
});

describe("calculator input validation", () => {
  it.each([
    ["0.03", 3],
    ["1", 100],
    ["1.2", 120],
    ["500.00", 50_000],
    [" 13.40 ", 1_340],
  ])("parses %j into integer cents", (input, cents) => {
    expect(parseUsdInput(input)).toEqual({ ok: true, cents });
  });

  it.each(["", " ", "abc", "NaN", "Infinity", "1e2", "1.234", "-1", "0"])(
    "rejects invalid USD input %j",
    (input) => {
      expect(parseUsdInput(input).ok).toBe(false);
    },
  );

  it("distinguishes the product cap from an official Steam maximum", () => {
    expect(parseUsdInput("500.01")).toEqual({
      ok: false,
      error: "Enter no more than $500.00. This is the calculator product cap, not Steam's official global maximum.",
    });
  });

  it.each([
    ["1", 1],
    ["999", 999],
  ])("accepts quantity %j", (input, quantity) => {
    expect(parseQuantity(input)).toEqual({ ok: true, quantity });
  });

  it.each(["", "0", "1.5", "1000", "-1", "abc"])(
    "rejects quantity %j",
    (input) => {
      expect(parseQuantity(input).ok).toBe(false);
    },
  );
});

describe("quantity totals", () => {
  it("multiplies a per-item fee decomposition without recalculating aggregate fees", () => {
    const perItem = calculateFromSellerReceives(88);

    expect(multiplyBreakdownForQuantity(perItem, 3)).toEqual({
      buyerPaysCents: 300,
      sellerReceivesCents: 264,
      steamFeeCents: 12,
      gameFeeCents: 24,
      totalFeeCents: 36,
    });
  });

  it.each([0, 1.5, 1_000])("rejects invalid quantity %j", (quantity) => {
    const perItem = calculateFromSellerReceives(88);
    expect(() => multiplyBreakdownForQuantity(perItem, quantity)).toThrow(/quantity/i);
  });
});
