export interface SteamMarketFeeBreakdown {
  buyerPaysCents: number;
  sellerReceivesCents: number;
  steamFeeCents: number;
  gameFeeCents: number;
  totalFeeCents: number;
}

export type ExactSteamMarketFeeBreakdown = SteamMarketFeeBreakdown & {
  exact: true;
};

export interface UnreachableBuyerTotal {
  exact: false;
  requestedBuyerPaysCents: number;
  lowerValidResult: SteamMarketFeeBreakdown;
  upperValidResult: SteamMarketFeeBreakdown;
}

export type BuyerPaysResult =
  | ExactSteamMarketFeeBreakdown
  | UnreachableBuyerTotal;

export const STEAM_MARKET_POLICY = {
  version: "wog-steam-market-usd-2026-09-15",
  currency: "USD",
  verifiedAt: "2026-09-15",
  steamRateNumerator: 5,
  gameRateNumerator: 10,
  rateDenominator: 100,
  componentMinimumCents: 1,
  buyerMinimumCents: 3,
  inputMaximumCents: 50_000,
  quantityMinimum: 1,
  quantityMaximum: 999,
} as const;

export type ParseUsdResult =
  | { ok: true; cents: number }
  | { ok: false; error: string };

export type ParseQuantityResult =
  | { ok: true; quantity: number }
  | { ok: false; error: string };

function componentFee(
  sellerReceivesCents: number,
  rateNumerator: number,
): number {
  return Math.max(
    STEAM_MARKET_POLICY.componentMinimumCents,
    Math.floor(
      (sellerReceivesCents * rateNumerator) /
        STEAM_MARKET_POLICY.rateDenominator,
    ),
  );
}

export function calculateFromSellerReceives(
  sellerReceivesCents: number,
): SteamMarketFeeBreakdown {
  if (!Number.isInteger(sellerReceivesCents) || sellerReceivesCents < 1) {
    throw new Error("Seller proceeds must be a positive integer number of cents.");
  }

  const steamFeeCents = componentFee(
    sellerReceivesCents,
    STEAM_MARKET_POLICY.steamRateNumerator,
  );
  const gameFeeCents = componentFee(
    sellerReceivesCents,
    STEAM_MARKET_POLICY.gameRateNumerator,
  );

  return {
    buyerPaysCents:
      sellerReceivesCents + steamFeeCents + gameFeeCents,
    sellerReceivesCents,
    steamFeeCents,
    gameFeeCents,
    totalFeeCents: steamFeeCents + gameFeeCents,
  };
}

export function calculateFromBuyerPays(
  buyerPaysCents: number,
): BuyerPaysResult {
  if (
    !Number.isInteger(buyerPaysCents) ||
    buyerPaysCents < STEAM_MARKET_POLICY.buyerMinimumCents
  ) {
    throw new Error("Buyer total must be at least $0.03 in whole cents.");
  }
  if (buyerPaysCents > STEAM_MARKET_POLICY.inputMaximumCents) {
    throw new Error(
      "Buyer total exceeds the calculator product cap of $500.00, not Steam's official global maximum.",
    );
  }

  let low = 1;
  let high = buyerPaysCents - 2;
  let best: SteamMarketFeeBreakdown | undefined;

  while (low <= high) {
    const midpoint = low + Math.floor((high - low) / 2);
    const candidate = calculateFromSellerReceives(midpoint);

    if (candidate.buyerPaysCents <= buyerPaysCents) {
      best = candidate;
      low = midpoint + 1;
    } else {
      high = midpoint - 1;
    }
  }

  if (!best) {
    throw new Error("No valid seller proceeds exist for this buyer total.");
  }

  if (best.buyerPaysCents !== buyerPaysCents) {
    return {
      exact: false,
      requestedBuyerPaysCents: buyerPaysCents,
      lowerValidResult: best,
      upperValidResult: calculateFromSellerReceives(
        best.sellerReceivesCents + 1,
      ),
    };
  }

  return { exact: true, ...best };
}

export function parseUsdInput(input: string): ParseUsdResult {
  const normalized = input.trim();
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);

  if (!match) {
    return {
      ok: false,
      error: "Enter a positive USD amount with no more than two decimal places.",
    };
  }

  const wholeCents = Number(match[1]) * 100;
  const fractionCents = Number((match[2] ?? "").padEnd(2, "0"));
  const cents = wholeCents + fractionCents;

  if (!Number.isSafeInteger(cents)) {
    return { ok: false, error: "Enter a valid USD amount." };
  }
  if (cents < STEAM_MARKET_POLICY.buyerMinimumCents) {
    return { ok: false, error: "Enter at least $0.03." };
  }
  if (cents > STEAM_MARKET_POLICY.inputMaximumCents) {
    return {
      ok: false,
      error:
        "Enter no more than $500.00. This is the calculator product cap, not Steam's official global maximum.",
    };
  }

  return { ok: true, cents };
}

export function parseQuantity(input: string): ParseQuantityResult {
  const normalized = input.trim();
  if (!/^\d+$/.test(normalized)) {
    return { ok: false, error: "Enter a whole-number quantity from 1 to 999." };
  }

  const quantity = Number(normalized);
  if (
    !Number.isSafeInteger(quantity) ||
    quantity < STEAM_MARKET_POLICY.quantityMinimum ||
    quantity > STEAM_MARKET_POLICY.quantityMaximum
  ) {
    return { ok: false, error: "Enter a whole-number quantity from 1 to 999." };
  }

  return { ok: true, quantity };
}

export function multiplyBreakdownForQuantity(
  perItem: SteamMarketFeeBreakdown,
  quantity: number,
): SteamMarketFeeBreakdown {
  if (
    !Number.isInteger(quantity) ||
    quantity < STEAM_MARKET_POLICY.quantityMinimum ||
    quantity > STEAM_MARKET_POLICY.quantityMaximum
  ) {
    throw new Error("Quantity must be a whole number from 1 to 999.");
  }

  return {
    buyerPaysCents: perItem.buyerPaysCents * quantity,
    sellerReceivesCents: perItem.sellerReceivesCents * quantity,
    steamFeeCents: perItem.steamFeeCents * quantity,
    gameFeeCents: perItem.gameFeeCents * quantity,
    totalFeeCents: perItem.totalFeeCents * quantity,
  };
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
