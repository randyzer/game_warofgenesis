import { useEffect, useMemo, useState } from "react";

import {
  calculateFromBuyerPays,
  calculateFromSellerReceives,
  formatUsd,
  multiplyBreakdownForQuantity,
  parseQuantity,
  parseUsdInput,
  type UnreachableBuyerTotal,
  type SteamMarketFeeBreakdown,
} from "../../core/steam-market-fees";
import { getSteamMarketPolicyFreshness } from "../../core/steam-market-policy-freshness";

type CalculatorMode = "buyer" | "seller";

interface Props {
  initialMode?: CalculatorMode;
  initialPrice?: string;
  initialQuantity?: string;
}

type CalculationState =
  | { kind: "error"; error: string }
  | {
      kind: "unreachable";
      unreachable: UnreachableBuyerTotal;
      quantity: number;
    }
  | { kind: "result"; perItem: SteamMarketFeeBreakdown; quantity: number };

function readFragment() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const mode = params.get("mode");

  return {
    mode: mode === "seller" ? "seller" : "buyer",
    price: params.get("price") ?? "1.00",
    quantity: params.get("quantity") ?? "1",
  } satisfies { mode: CalculatorMode; price: string; quantity: string };
}

function ResultRows({ breakdown }: { breakdown: SteamMarketFeeBreakdown }) {
  return (
    <dl className="fee-breakdown">
      <div>
        <dt>Buyer pays</dt>
        <dd>{formatUsd(breakdown.buyerPaysCents)}</dd>
      </div>
      <div className="fee-breakdown__net">
        <dt>Seller receives</dt>
        <dd>{formatUsd(breakdown.sellerReceivesCents)}</dd>
      </div>
      <div>
        <dt>Steam fee</dt>
        <dd>{formatUsd(breakdown.steamFeeCents)}</dd>
      </div>
      <div>
        <dt>Game/publisher fee</dt>
        <dd>{formatUsd(breakdown.gameFeeCents)}</dd>
      </div>
      <div>
        <dt>Total fees</dt>
        <dd>{formatUsd(breakdown.totalFeeCents)}</dd>
      </div>
    </dl>
  );
}

export default function SteamMarketFeeCalculator({
  initialMode = "buyer",
  initialPrice = "1.00",
  initialQuantity = "1",
}: Props) {
  const [mode, setMode] = useState<CalculatorMode>(initialMode);
  const [price, setPrice] = useState(initialPrice);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [hydrated, setHydrated] = useState(false);
  const [policyCheckedAt, setPolicyCheckedAt] = useState(() => Date.now());
  const { fresh, expiresAtMs } = getSteamMarketPolicyFreshness(Date.now());

  const calculation = useMemo<CalculationState>(() => {
    if (!fresh) {
      return {
        kind: "error",
        error: "Fee policy needs re-verification before calculations can be shown.",
      };
    }

    const parsedPrice = parseUsdInput(price);
    const parsedQuantity = parseQuantity(quantity);
    if (!parsedPrice.ok) return { kind: "error", error: parsedPrice.error };
    if (!parsedQuantity.ok) {
      return { kind: "error", error: parsedQuantity.error };
    }

    if (mode === "buyer") {
      const buyerResult = calculateFromBuyerPays(parsedPrice.cents);
      if (!buyerResult.exact) {
        return {
          kind: "unreachable",
          unreachable: buyerResult,
          quantity: parsedQuantity.quantity,
        };
      }

      return {
        kind: "result",
        perItem: buyerResult,
        quantity: parsedQuantity.quantity,
      };
    }

    return {
      kind: "result",
      perItem: calculateFromSellerReceives(parsedPrice.cents),
      quantity: parsedQuantity.quantity,
    };
  }, [mode, price, quantity, fresh]);

  useEffect(() => {
    const refreshPolicy = () => setPolicyCheckedAt(Date.now());
    window.addEventListener("focus", refreshPolicy);
    document.addEventListener("visibilitychange", refreshPolicy);

    // Browser timers cap at signed 32-bit milliseconds; re-arm long intervals.
    const timer = fresh && expiresAtMs !== null
      ? window.setTimeout(refreshPolicy, Math.min(
          Math.max(0, expiresAtMs - Date.now()),
          2_147_483_647,
        ))
      : undefined;

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("focus", refreshPolicy);
      document.removeEventListener("visibilitychange", refreshPolicy);
    };
  }, [policyCheckedAt, fresh, expiresAtMs]);

  useEffect(() => {
    const fragment = readFragment();
    setMode(fragment.mode);
    setPrice(fragment.price);
    setQuantity(fragment.quantity);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || calculation.kind !== "result") {
      return;
    }

    const params = new URLSearchParams({ mode, price, quantity });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${params.toString()}`,
    );
  }, [calculation, hydrated, mode, price, quantity]);

  const total =
    calculation.kind === "result" && calculation.quantity > 1
      ? multiplyBreakdownForQuantity(calculation.perItem, calculation.quantity)
      : undefined;

  return (
    <div className="steam-fee-calculator" data-policy-version="wog-steam-market-usd-2026-09-15">
      <fieldset className="fee-mode">
        <legend>Calculation direction</legend>
        <label data-active={mode === "buyer" ? "true" : undefined}>
          <input
            type="radio"
            name="fee-mode"
            value="buyer"
            checked={mode === "buyer"}
            onChange={() => setMode("buyer")}
          />
          Buyer pays
        </label>
        <label data-active={mode === "seller" ? "true" : undefined}>
          <input
            type="radio"
            name="fee-mode"
            value="seller"
            checked={mode === "seller"}
            onChange={() => setMode("seller")}
          />
          Seller receives
        </label>
      </fieldset>

      <div className="fee-inputs">
        <label>
          <span>
            {mode === "buyer"
              ? "Buyer-facing price per item"
              : "Desired seller proceeds per item"}
          </span>
          <span className="money-control">
            <b aria-hidden="true">$</b>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={price}
              onChange={(event) => setPrice(event.currentTarget.value)}
              aria-describedby="price-boundary"
            />
            <small>USD</small>
          </span>
          <small id="price-boundary">$0.03–$500.00 calculator input range</small>
        </label>
        <label>
          <span>Quantity</span>
          <span className="quantity-control">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={quantity}
              onChange={(event) => setQuantity(event.currentTarget.value)}
              aria-describedby="quantity-boundary"
            />
          </span>
          <small id="quantity-boundary">Whole number from 1 to 999</small>
        </label>
      </div>

      <div className="fee-results" aria-live="polite">
        {calculation.kind === "error" ? (
          <p className="fee-error" role="alert">{calculation.error}</p>
        ) : calculation.kind === "unreachable" ? (
          <div className="unreachable-result">
            <p className="eyebrow">Exact-price check</p>
            <h2>This exact buyer price is not reachable under the current fee model.</h2>
            <p>No price was silently rounded or selected for you.</p>
            <dl>
              <div>
                <dt>Nearest lower</dt>
                <dd>{formatUsd(calculation.unreachable.lowerValidResult.buyerPaysCents)}</dd>
              </div>
              <div>
                <dt>Nearest upper</dt>
                <dd>{formatUsd(calculation.unreachable.upperValidResult.buyerPaysCents)}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <>
            <div className="fee-results__header">
              <div>
                <p className="eyebrow">Per item / estimated</p>
                <h2>Fee decomposition</h2>
              </div>
              <span>USD · integer cents</span>
            </div>
            <ResultRows breakdown={calculation.perItem} />
            <p className="effective-rate">
              Effective fees: {(
                (calculation.perItem.totalFeeCents * 100) /
                calculation.perItem.sellerReceivesCents
              ).toFixed(2)}% of seller proceeds
            </p>
            {total && (
              <section className="quantity-totals">
                <p className="eyebrow">{calculation.quantity}-item totals</p>
                <ResultRows breakdown={total} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
