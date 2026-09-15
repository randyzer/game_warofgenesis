# War of Genesis — Steam Community Market Fee Policy

Status: qualified for Phase 2A calculator implementation

- Policy version: `wog-steam-market-usd-2026-09-15`
- Game: `[WoG] War of Genesis: Idle Loot`
- Steam App ID: `4891320`
- Calculator target: `/tools/steam-market-fee-calculator/`
- Verification date: `2026-09-15`
- MVP currency: `USD`

## A. Scope

This policy defines the single-currency fee model required by the Phase 2A Steam Market fee and net-proceeds calculator. It covers the relationship between a seller's item price, Steam's transaction fee, the War of Genesis publisher fee, and the buyer-facing total.

The policy does not authorize live price ingestion, currency conversion, tax calculation, account access, listing submission, or calculator implementation. All amounts in the implementation contract are integer US cents.

## B. Verification Date

The policy was verified on `2026-09-15` against the live Steam Community Market, Steam Support, and the versioned JavaScript served by Steam's current legacy Community Market UI.

This is a point-in-time policy. Steam's confirmation dialog remains authoritative for an actual transaction.

## C. Sources

### Primary official sources

1. [Steam Support — Community Market FAQ](https://help.steampowered.com/en/faqs/view/61F0-72B7-9A18-C70B), accessed `2026-09-15`.
   - States that the Steam transaction fee is currently 5%, with a USD minimum of `$0.01`.
   - States that the buyer pays the Steam transaction fee, calculated from item cost and shown before purchase.
   - States that market transactions use Steam Wallet funds, which cannot be withdrawn or transferred.
   - States that the current per-item maximum is approximately equivalent to `$1,800 USD`, subject to change.
2. [Steam Community Market — War of Genesis results](https://steamcommunity.com/market/search?appid=4891320), accessed `2026-09-15`.
   - Identifies the game as `[WoG] War of Genesis: Idle Loot` and returned 762 results during verification.
   - The USD view showed current listings from `$0.04` through `$193.60` when sorted by price.
3. [Steam Community Market — High-Grade Jewel of Strife](https://steamcommunity.com/market/listings/4891320/High-Grade%20Jewel%20of%20Strife), accessed `2026-09-15`.
   - The App 4891320 page embedded `g_fPubFee_Rate = 0.100000001490116119`, the floating-point representation of 10%.
4. [Steam Community Market — High-Grade Jewel of Valor](https://steamcommunity.com/market/listings/4891320/High-Grade%20Jewel%20of%20Valor), accessed `2026-09-15`.
   - The live Beta listing payload identified `publisherFeeApp: 4891320` and `publisherFeePct: 0.10000000149011612`.
   - A JPY listing separated `unSteamFee` and `unPublisherFee`, confirming that the two fee components are calculated independently.
5. [Steam `economy_common.js`, version `TSVmDS2fQKJu`](https://community.akamai.steamstatic.com/public/javascript/economy_common.js?v=TSVmDS2fQKJu&l=english&_cdn=akamai), accessed `2026-09-15` through the script URL loaded by the official listing page.
   - Defines `ToValidMarketPrice`, `CalculateFee`, `GetTotalWithFees`, and `GetItemPriceFromTotal`.
6. [Steam `market.js`, version `BTKz8kuIPqit`](https://community.akamai.steamstatic.com/public/javascript/market.js?v=BTKz8kuIPqit&l=english&_cdn=akamai), accessed `2026-09-15` through the script URL loaded by the official listing page.
   - Uses default publisher and Steam rates of 10% and 5%.
   - Defines the minimum buyer-facing commodity price as three times `wallet_market_minimum`.
   - Calls the shared integer-unit helpers for both calculation directions.

### Evidence boundaries

- The Steam Support FAQ is authoritative for the Steam rate, USD Steam minimum, fee payer, Wallet treatment, and approximate global listing cap.
- The live App 4891320 pages are authoritative for the WoG publisher fee and active market status.
- Steam's currently served scripts are authoritative behavioral evidence for component separation, integer-unit calculations, flooring, minimum application, and reverse lookup.
- No forum post, third-party calculator, historical article, or assumed industry default is used as policy evidence.

## D. WoG Market Confirmation

App ID `4891320` had an active Steam Community Market on `2026-09-15`.

The game-filtered market returned 762 results. Representative USD listing observations were:

| Price band | Example observed | Purpose |
| --- | ---: | --- |
| Low | `$0.04`, `$0.05` | Confirms active low-price WoG listings and cent-denominated USD display |
| Medium | `$13.40` | Confirms a normal higher-value listing and a formula-reachable buyer total |
| Higher | `$193.60` | Confirms the current upper observed WoG price band and a formula-reachable buyer total |

These observations verify policy behavior only. They are not a price database, price recommendation, or claim that the same prices remain current after the verification date.

## E. Supported Currency

The MVP supports exactly one currency:

| Field | Value |
| --- | --- |
| Currency | `USD` |
| Steam currency code | `1` |
| Minor unit | `$0.01` |
| Internal unit | one integer cent |
| Decimal places accepted | exactly zero, one, or two user-entered decimal places; normalize display to two |

Steam's current currency metadata marks USD as a non-whole-unit currency using `.` as the decimal separator. Multi-currency support is deferred because minimums, increments, formatting, and rounding differ by currency.

## F. Steam Fee

- Rate: `5%` of seller receives/item cost.
- Fee payer: buyer.
- USD minimum: `$0.01` per item.
- Integer formula: `max(1, floor(seller_receives_cents * 0.05))`.

The result is one independently calculated component. Do not calculate a combined 15% fee and split it afterward.

## G. Game/Publisher Fee

- Publisher fee app: `4891320`.
- Rate: `10%` of seller receives/item cost.
- USD minimum: `$0.01` per item.
- Integer formula: `max(1, floor(seller_receives_cents * 0.10))`.

The rate is verified from the live WoG listing page and payload, not inferred from other games. The USD minimum follows the current Valve code path: publisher and Steam fees both call the same `CalculateFee` function, which applies the USD `wallet_market_minimum` independently to each component.

## H. Minimum Fees

| Component | USD minimum | Evidence |
| --- | ---: | --- |
| Steam transaction fee | `$0.01` | Steam Support FAQ and Valve calculation code |
| WoG publisher fee | `$0.01` | Valve calculation code applies the same USD market minimum independently |

The minimum buyer-facing total for a marketable WoG item under this policy is `$0.03`:

```text
seller receives  $0.01
Steam fee        $0.01
publisher fee    $0.01
buyer pays       $0.03
```

No live `$0.03` WoG listing was observed during verification. The lowest current listings observed were `$0.04`; `$0.03` is the verified policy floor, not a current-price claim.

## I. Rounding Rules

For USD, perform all calculations in integer cents.

For each fee component, independently and in this order:

1. Multiply seller-receives cents by the component rate.
2. Apply `floor` to discard the fractional cent.
3. Apply the component minimum of 1 cent.
4. Add the two independently calculated fees to seller receives.

In compact form:

```text
steam_fee_cents = max(1, floor(seller_receives_cents * 0.05))
game_fee_cents  = max(1, floor(seller_receives_cents * 0.10))
buyer_pays_cents = seller_receives_cents
                 + steam_fee_cents
                 + game_fee_cents
```

This is truncation/flooring, not ceiling and not round-to-nearest. The minimum is applied after flooring. Rounding only a combined 15% fee is incorrect.

## J. Calculation Directions

### Seller receives to buyer pays

This is the direct calculation:

```text
INPUT: seller_receives_cents >= 1
steam_fee_cents = max(1, floor(seller_receives_cents * 5 / 100))
game_fee_cents  = max(1, floor(seller_receives_cents * 10 / 100))
buyer_pays_cents = seller_receives_cents
                 + steam_fee_cents
                 + game_fee_cents
OUTPUT: buyer_pays_cents and both fee components
```

Use integer multiplication and integer division in production, so the implementation does not depend on binary floating-point behavior:

```text
steam_fee_cents = max(1, (seller_receives_cents * 5) div 100)
game_fee_cents  = max(1, (seller_receives_cents * 10) div 100)
```

### Buyer pays to seller receives

The reverse is not an algebraic division by `1.15`. Component flooring and minimums make the forward function stepwise, and some buyer totals are unreachable.

Use a monotonic integer search:

1. Reject totals below 3 cents.
2. Search integer `seller_receives_cents` in `[1, buyer_pays_cents - 2]`.
3. Find the largest seller amount whose forward-calculated total is less than or equal to the requested total.
4. Recompute the forward total for that seller amount.
5. If it equals the requested buyer total, return the exact fee breakdown.
6. If it does not equal the requested total, mark the buyer total as unreachable and return the nearest valid total below and the next valid total above. Do not silently present the lower total as an exact match.

A binary search or a bounded integer iteration is valid. The implementation must verify the candidate by running the forward function before displaying a result.

Example: `$30.00` is unreachable under the verified policy. A seller amount of `$26.09` yields `$29.99`; `$26.10` yields `$30.01`. The calculator must not label either result as an exact `$30.00` transaction.

## K. Integer Minor-Unit Model

Parse dollars into integer cents before calculation:

```text
$1.23 -> 123 cents
```

Integer cents are required because:

- Steam applies fees and minimums at currency-unit boundaries.
- Binary floating-point cannot represent many decimal prices exactly.
- Each fee component must floor independently.
- Reverse lookup must compare exact reachable integer totals.

Never use floating-point dollars as the source of truth. Format dollars only after the integer result is complete.

## L. Input Limits

### Phase 2A MVP validation

| Input | Policy |
| --- | --- |
| Buyer-facing price | Required; USD; finite positive decimal; at most two decimal places |
| Lower bound | `$0.03` |
| Product safety cap | `$500.00` |
| Quantity | Integer `1–999`, as already approved in Phase 1 |
| Reachability | Buyer price must be an exact forward-function result |

`$500.00` is a product-level calculator limit, not Steam's official maximum. It is above the highest WoG listing observed on the verification date (`$193.60`) while remaining well below Steam Support's changeable, approximate `$1,800` per-item cap. The cap can be raised only after policy re-verification and explicit product review.

Quantity multiplies the already calculated per-item values. Fees are calculated per unit; do not calculate one fee against the aggregate quantity total.

## M. Verified Examples

All examples use the current Valve functions with the verified USD policy fields. Live-listing cross-checks are identified separately.

| Buyer input | Result | Verification note |
| ---: | --- | --- |
| `$0.03` | Exact: seller `$0.01`, Steam `$0.01`, game `$0.01` | Valve minimum and rounding functions; no live `$0.03` WoG listing observed |
| `$0.04` | Exact: seller `$0.02`, Steam `$0.01`, game `$0.01` | Matches current lowest observed WoG listing price |
| `$0.05` | Exact: seller `$0.03`, Steam `$0.01`, game `$0.01` | Matches current low-price WoG listings |
| `$0.10` | Exact: seller `$0.08`, Steam `$0.01`, game `$0.01` | Valve function replay |
| `$1.00` | Exact: seller `$0.88`, Steam `$0.04`, game `$0.08` | Valve function replay |
| `$5.00` | Exact: seller `$4.36`, Steam `$0.21`, game `$0.43` | Valve function replay |
| `$10.00` | Exact: seller `$8.70`, Steam `$0.43`, game `$0.87` | Valve function replay |
| `$13.40` | Exact: seller `$11.66`, Steam `$0.58`, game `$1.16` | Exact forward recomputation; `$13.40` observed on live WoG results |
| `$30.00` | Not reachable; adjacent valid totals are `$29.99` and `$30.01` | Negative edge case from the Valve stepwise function |
| `$30.01` | Exact: seller `$26.10`, Steam `$1.30`, game `$2.61` | Valve function replay; representative `$30+` case |
| `$193.60` | Exact: seller `$168.36`, Steam `$8.41`, game `$16.83` | Exact forward recomputation; `$193.60` observed on live WoG results |

The values are fee-policy examples, not market recommendations, profit estimates, or predictions.

## N. Test Vectors

The following nine exact vectors are approved for Phase 2A unit tests. Values are per item.

| Buyer Pays | Seller Receives | Steam Fee | Game Fee | Total Fee | Evidence / Verification Method |
| ---: | ---: | ---: | ---: | ---: | --- |
| `$0.03` | `$0.01` | `$0.01` | `$0.01` | `$0.02` | Steam FAQ minimum + current Valve functions |
| `$0.05` | `$0.03` | `$0.01` | `$0.01` | `$0.02` | Current Valve functions; live WoG low-price band |
| `$0.10` | `$0.08` | `$0.01` | `$0.01` | `$0.02` | Current Valve functions |
| `$1.00` | `$0.88` | `$0.04` | `$0.08` | `$0.12` | Current Valve functions |
| `$5.00` | `$4.36` | `$0.21` | `$0.43` | `$0.64` | Current Valve functions |
| `$10.00` | `$8.70` | `$0.43` | `$0.87` | `$1.30` | Current Valve functions |
| `$13.40` | `$11.66` | `$0.58` | `$1.16` | `$1.74` | Current Valve functions + live WoG listing total |
| `$30.01` | `$26.10` | `$1.30` | `$2.61` | `$3.91` | Current Valve functions; reachable `$30+` case |
| `$193.60` | `$168.36` | `$8.41` | `$16.83` | `$25.24` | Current Valve functions + live WoG listing total |

Required negative tests:

- Reject buyer prices below `$0.03`.
- Reject more than two USD decimal places.
- Reject blank, non-numeric, non-finite, zero, and negative values.
- Reject buyer total `$30.00` as unreachable; identify `$29.99` and `$30.01` as adjacent valid totals.
- Reject values above the product cap of `$500.00` with wording that distinguishes it from Steam's official limit.
- Reject quantities outside integer range `1–999`.

## O. Disclaimer

Recommended launch copy:

> Estimate based on Steam Community Market fee behavior verified on September 15, 2026. Steam may change its fees, minimums, currency rules, rounding, or listing limits. Verify the final amount in Steam's confirmation dialog before listing. Steam Wallet funds are not withdrawable cash. This tool is not financial or investment advice. War of Genesis Wiki is independent and is not affiliated with or endorsed by Valve or the game publisher.

## P. Re-verification Policy

Re-verify this policy:

- immediately before the calculator is first published;
- before any change to currencies, input limits, calculation direction, or fee presentation;
- every 90 days while the game has an active market; and
- sooner if Steam changes its Market UI, the referenced script versions, the FAQ wording, or the WoG listing payload.

Re-verification must confirm:

1. App 4891320 still has active listings.
2. The WoG publisher fee is still 10%.
3. The Steam fee is still 5% with a `$0.01` USD minimum.
4. Both components still use independent flooring and minimums.
5. The minimum buyer total and selected test vectors still match Steam behavior.
6. The `$500.00` product cap remains appropriate for the observed WoG market range.

Record the new access date, official URLs, script version identifiers, observed listing bands, and any changed test vectors. A failed critical check makes the calculator policy stale and the calculator must become non-indexable/unavailable until reviewed.

## Q. Implementation Pseudocode

```text
POLICY = {
  version: "wog-steam-market-usd-2026-09-15",
  currency: "USD",
  minorUnit: 1 cent,
  steamRateNumerator: 5,
  publisherRateNumerator: 10,
  rateDenominator: 100,
  steamMinimumCents: 1,
  publisherMinimumCents: 1,
  buyerMinimumCents: 3,
  buyerMaximumCents: 50000,
  quantityMinimum: 1,
  quantityMaximum: 999,
  verifiedAt: "2026-09-15"
}

function componentFee(baseCents, rateNumerator, minimumCents):
  rawFeeCents = (baseCents * rateNumerator) div 100
  return max(minimumCents, rawFeeCents)

function fromSellerReceives(baseCents):
  require integer baseCents >= 1
  steamFee = componentFee(baseCents, 5, 1)
  gameFee = componentFee(baseCents, 10, 1)
  buyerPays = baseCents + steamFee + gameFee
  return { baseCents, steamFee, gameFee, buyerPays }

function fromBuyerPays(targetCents):
  require integer targetCents in [3, 50000]

  low = 1
  high = targetCents - 2
  best = null

  while low <= high:
    mid = low + ((high - low) div 2)
    candidate = fromSellerReceives(mid)

    if candidate.buyerPays <= targetCents:
      best = candidate
      low = mid + 1
    else:
      high = mid - 1

  require best is not null

  if best.buyerPays == targetCents:
    return { exact: true, ...best }

  next = fromSellerReceives(best.baseCents + 1)
  return {
    exact: false,
    requestedBuyerPays: targetCents,
    lowerValidResult: best,
    upperValidResult: next
  }

function forQuantity(perItemResult, quantity):
  require integer quantity in [1, 999]
  return multiply every per-item integer-cent output by quantity
```

The implementation must not silently coerce an unreachable buyer total, must not use `buyerPrice / 1.15`, and must not calculate fees once against an aggregate quantity total.

## R. Open Questions

No P0 or P1 policy questions remain for the approved USD-only Phase 2A calculator.

Non-blocking future questions:

1. Whether later product versions should accept an unreachable buyer total and offer a one-click choice between adjacent valid totals, or require the user to edit the input manually.
2. Whether the product cap should be raised above `$500.00` if future WoG listings materially exceed the range observed on `2026-09-15`.
3. How non-USD currency increments, whole-unit currencies, local taxes, and cross-currency conversion should be modeled if multi-currency support is ever approved.

These questions do not affect the Phase 2A USD fee calculation contract.

## S. Verdict

**PASS — WAR OF GENESIS STEAM MARKET FEE POLICY VERIFIED**

The live WoG market, USD currency model, Steam rate, WoG publisher rate, separate fee minimums, calculation order, rounding behavior, both calculation directions, input range, disclaimers, re-verification policy, and deterministic test vectors are sufficiently defined for Phase 2A implementation. No calculator or page code was changed.
