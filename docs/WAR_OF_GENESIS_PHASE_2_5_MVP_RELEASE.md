# War of Genesis — Phase 2.5 Full MVP Release Review

Historical blocked-review snapshot. Its P1 is resolved by the authorized Phase 2.5-R1 repair below; the original findings and no-mutation statements remain a record of Phase 2.5, not the later release state.

## A. Executive Summary

**BLOCKED — FEE POLICY IMPLEMENTATION DRIFT**

The complete launch inventory, current fee arithmetic, tests, build, SEO, and desktop/mobile presentation pass review. The release is blocked by one P1: the approved Phase 1 calculator contract requires calculations to stop when the fee policy expires, but the current implementation does not enforce the policy's 90-day review interval. An isolated future-date experiment reproduced continued results after expiration.

No production code, page, feature, existing approved artifact, or fee rule was changed. This report is the only repository file added during Phase 2.5. No staging, commit, push, tag, deployment, Vercel connection, or Cloudflare change was performed. Existing approved changes remain intact and uncommitted.

Review date: 2026-09-15, Asia/Taipei. Fresh official function replay timestamp: `2026-09-15T08:38:06.654Z`.

## B. Workspace Preflight

The first shell command of this request was `pwd`, with no auto-cd. It returned exactly:

```text
/Users/randyz/work/coding/hot_words_web/gameweb/game_warofgenesis
```

`git rev-parse --show-toplevel` returned the same path.

- Branch: `main`.
- Pre-release/current HEAD: `340b82ea5ed1c32fa4330d10540bbc0413e2b026`.
- Origin: `https://github.com/randyzer/game_warofgenesis.git`.
- Initial index: empty.
- Initial changes: 24 tracked paths and 17 untracked files, all within the approved Phase 1/fee-policy/2A/2B scope.

## C. Approved Artifact Review

Read all four authoritative documents completely:

1. `docs/WAR_OF_GENESIS_PHASE_1_IA_SEO_PLAN.md` — 563 lines; route, product, evidence, navigation, and calculator failure-behavior authority.
2. `docs/WAR_OF_GENESIS_STEAM_MARKET_FEE_POLICY.md` — 369 lines; USD rates, minimums, independent flooring, vectors, and 90-day/earlier re-verification triggers.
3. `docs/WAR_OF_GENESIS_PHASE_2A_MVP_IMPLEMENTATION.md` — 149 lines; eight implemented launch routes and focused fee calculator.
4. `docs/WAR_OF_GENESIS_PHASE_2B_LAUNCH_MVP_COMPLETION.md` — complete A–R report; four remaining routes and explicit changed-file list. Its statement that other pre-existing changes belong to approved Phase 1/2A was reconciled with the actual diffs, not used to approve arbitrary new paths.

The current review overrides earlier completion claims where direct evidence disagrees. In particular, the Phase 2A report mentions stale/missing-policy test coverage, but the current fee-engine and calculator UI tests contain no expiration test or runtime expiration guard.

## D. Route Reconciliation

The launch set was independently extracted from the Phase 1 Section F P0/P1 Launch table and reconciled with the enabled catalog and actual built HTML files.

| Launch route | Phase | Built |
| --- | --- | --- |
| `/` | 2A | Yes |
| `/guides/` | 2A | Yes |
| `/guides/beginner-guide/` | 2A | Yes |
| `/guides/farming/` | 2A | Yes |
| `/guides/gear/` | 2B | Yes |
| `/builds/` | 2A | Yes |
| `/market/` | 2A | Yes |
| `/market/best-items-to-sell/` | 2B | Yes |
| `/market/how-to-sell-items/` | 2B | Yes |
| `/market/steam-market-fees/` | 2B | Yes |
| `/tools/` | 2A | Yes |
| `/tools/steam-market-fee-calculator/` | 2A | Yes |

Planned **12**, implemented **12**, missing **0**, unexpected **0**, orphan **0**. Five inherited operational pages remain: Search, About, Privacy, Terms, and 404; total built pages **17**.

Orphan methodology: all launch pages are reachable through rendered internal links. Additionally, every non-home launch page has an inbound link from another launch page's `<main>`, excluding breadcrumbs and global header/footer. Home is the navigation root and is linked by the global logo and article breadcrumbs; it is not incorrectly treated as an orphan because its non-breadcrumb contextual count is zero. Non-home contextual inbound counts: Guides 5, Beginner 4, Farming 8, Gear 10, Builds 5, Market 10, Best Items 7, Tools 2, Calculator 9, How-to 4, Fees 4.

Codes, Patch Notes, Troubleshooting, duplicate Classes routes, the old Getting Started route, and duplicate Steam Market guides are absent from built routes.

## E. Content Consistency

Reviewed source and rendered semantic content for all 12 launch pages. Positioning remains a connected progression/farming/gear/market decision-support wiki, not a thin entity database.

- Farming, Gear, and Builds use bounded qualitative criteria, not asserted drop rates, universal winners, or numeric optimization.
- Best Items is explicitly a screening framework, not a current-price ranking.
- Listing guidance is a cautious checklist with current Steam eligibility/confirmation screens authoritative, not a claim of a submitted or guaranteed transaction.
- Fee explanations and calculator examples use only the approved, freshly replayed policy.
- No fabricated prices/codes, unsupported tier claims, unsupported troubleshooting fixes, or conflicting fee guidance found.
- Unsupported confident claims found: **0**.

No current-demand, liquidity, profitability, or market-size conclusion was made. The newly observed market results establish app identity/activity only. No player-performance study was performed.

## F. Steam Fee Re-verification

Used the `web-access` skill's connected real Chrome browser and CDP Proxy; dependency check reported browser connection and Proxy ready. Official pages were opened in new background tabs, not user-owned tabs. No public-search, third-party calculator/API, or anonymous fallback after a failed preferred tool was used. No trade, listing, purchase, credential extraction, or account mutation occurred.

Fresh primary evidence:

- [Steam Support Community Market FAQ](https://help.steampowered.com/en/faqs/view/61F0-72B7-9A18-C70B): Steam fee still 5%, USD minimum still $0.01; buyer pays; Wallet funds cannot be withdrawn/transferred; item eligibility must be checked individually.
- [App 4891320 Market results](https://steamcommunity.com/market/search?appid=4891320): identifies `[WoG] War of Genesis: Idle Loot`, displays USD prices and **767 results**. Active listings reconfirmed. First-page observations were $0.19–$28.31; this is a partial-page observation, not the market's complete range, a value ranking, or a price recommendation. The old 762-result observation was not treated as current.
- [High-Grade Jewel of Strife listing](https://steamcommunity.com/market/listings/4891320/High-Grade%20Jewel%20of%20Strife): the freshly loaded app-specific `g_fPubFee_Rate` remains `0.100000001490116119`, representing 10%.
- Listing-page USD currency metadata: `strCode: USD`, `eCurrencyCode: 1`, `bWholeUnitsOnly: false`, decimal separator `.`.
- Currently loaded [Valve economy_common.js](https://community.akamai.steamstatic.com/public/javascript/economy_common.js?v=TSVmDS2fQKJu&l=english&_cdn=akamai), version `TSVmDS2fQKJu`: actual loaded `CalculateFee` calls `ToValidMarketPrice(Math.floor(base_amt * pct), rgWallet)`; the helper applies `wallet_market_minimum`, defaulting to one minor unit, and currency increments. `GetTotalWithFees` invokes publisher and Steam components independently. `GetItemPriceFromTotal` recomputes the forward function rather than treating simple division as exact.
- Currently loaded [Valve market.js](https://community.akamai.steamstatic.com/public/javascript/market.js?v=BTKz8kuIPqit&l=english&_cdn=akamai), version `BTKz8kuIPqit`; unchanged from the approved evidence version.

USD, Steam 5%, game 10%, independent one-cent minimums, and floor-before-minimum behavior: **PASS**. No critical fee rule changed. The publisher USD minimum follows the same independently invoked Valve helper, the USD minor-unit metadata, and the FAQ's one-cent minimum; it is not inferred from another game's rate.

Evidence boundary: the current browser pages did not provide a signed-in Steam wallet configuration (`g_rgWalletInfo` was null). The replay explicitly used public USD policy fields and the freshly observed WoG publisher rate. It is behavioral policy verification against actual loaded official functions, not an account-specific confirmation or completed transaction. No credentials or balances were read.

## G. Calculator Consistency

`src/core/steam-market-fees.ts` uses integer cents, independently floors each component, applies its one-cent minimum, and uses monotonic integer reverse search. No buyer-dollar `/ 1.15` shortcut was introduced. Quantity multiplication remains per-item-based.

All nine authoritative vectors were replayed in both directions against the **currently loaded Valve functions**, using the fresh app publisher rate, and independently passed the existing local tests:

| Buyer cents | Seller cents | Steam cents | Game cents | Fresh replay |
| ---: | ---: | ---: | ---: | --- |
| 3 | 1 | 1 | 1 | PASS |
| 5 | 3 | 1 | 1 | PASS |
| 10 | 8 | 1 | 1 | PASS |
| 100 | 88 | 4 | 8 | PASS |
| 500 | 436 | 21 | 43 | PASS |
| 1000 | 870 | 43 | 87 | PASS |
| 1340 | 1166 | 58 | 116 | PASS |
| 3001 | 2610 | 130 | 261 | PASS |
| 19360 | 16836 | 841 | 1683 | PASS |

Nine/nine PASS. Fresh Valve forward outputs: seller 2609 cents → buyer 2999; seller 2610 → buyer 3001. Reverse lookup for buyer 3000 recomputes to 2999, confirming no exact 3000 total. Local tests and actual UI show an unreachable result instead of a fabricated breakdown.

**Contract gate: FAIL.** Phase 1 line 393 requires no calculation when the policy is missing, expired, or inconsistent. The policy's Section P requires 90-day or earlier re-verification. Current `verifiedAt` is only displayed; neither the engine nor the UI evaluates its age or suppresses expired results.

Isolated reproduction: rendered the real calculator with React server rendering in a separate Node process, mocking that process's Date to `2026-12-15T12:00:00Z`. No repository source or system clock changed. Policy age was **91.5 days**; fee decomposition and `$0.88` seller result still rendered; expiration/re-verification warning was absent. Source tracing confirmed the calculation memo depends only on mode, price, and quantity.

The first standalone experiment failed because tsx used classic JSX without a React global, unlike the project's Vite test transform. Supplying React only in that experiment process resolved the harness error; the succeeding experiment reproduced the actual expiration gap. This is not a production JSX failure. No fix was implemented during this review.

## H. Tests / Validate / Check / Build

Fresh full commands completed successfully on this unchanged implementation:

| Command / gate | Result |
| --- | --- |
| `npm test` | PASS — 43 files, 564 tests |
| `npm run validate` | PASS — 17 enabled pages, 3 content entries |
| `npm run check` | PASS — Astro 139 files, 0 errors, 0 warnings, 0 hints; 564 tests |
| `npm run build` | PASS — 17 pages |
| Static route reconciliation | PASS — 17 inventory routes matched |
| Pagefind | PASS — 13 indexed pages, English |
| Pagefind normalization | PASS — 257420 B required payload |
| Generated build audit | PASS — all 17 pages |
| `git diff --check` | PASS |

The two inherited loader notices about empty disabled meta/news collections remain; Astro diagnostic totals are 0/0/0. Tests passing do not cover or excuse the separately reproduced P1.

## I. SEO

Independent built-HTML review and the existing HTML audit found zero errors, zero duplicate titles, zero duplicate descriptions, and one H1 on every launch page. All 12 canonicals match `https://war-of-genesis.wiki` plus their inventory routes. Heading levels were reviewed; article/calculator breadcrumbs and structured data are present where intended. Guides/Tools use their existing hub presentation without article breadcrumbs.

Internal targets resolve against the approved inventory and build output. This is not a claim that the undeployed production domain was uptime-tested. SEO presentation: **PASS**; orphan pages: **0**.

## J. Visual Review

Used `browser-skill` in a bounded isolated bsk session against a local production build preview, not a hosted preview deployment. Reviewed all 12 launch pages at desktop 1440px and iPhone 14 emulation 390×844, including semantic content and screenshots.

- Desktop client/scroll widths matched: 1440 or 1425px depending on scrollbar state.
- Mobile client/scroll widths matched at 390px for every launch page.
- Broken images and empty decision/index cards: zero.
- Reviewed title wrapping, typography, spacing, visible breadcrumbs, hub cards, expanded mobile Market menu, and desktop/mobile footer.
- Fees formula is contained in its own horizontal scroll area without page overflow.
- Calculator buyer $30.00 shows the unreachable notice and $29.99/$30.01 neighbors.
- Seller $1.00, quantity 3 gives buyer $1.15 / seller $1.00 / Steam $0.05 / game $0.10 / fees $0.15 per item; totals $3.45 / $3.00 / $0.15 / $0.30 / $0.45.
- Console contained browser-extension invalid-resource noise only; no site-origin runtime error observed.

Some bsk mobile PNGs retained physical-window padding outside the measured emulated viewport. Review used the actual rendered 390px area and DOM widths; this was not misreported as page overflow. Footer screenshots were recaptured after instant scrolling and settling; early screenshots taken during smooth scrolling were not relied upon as footer evidence.

Presentation gate: **PASS**. This does not waive calculator freshness behavior. Screenshots are temporary `/tmp/wog-phase25-*` artifacts, not release files. The isolated session, owned official-evidence tabs, and local preview are closed/stopped at handoff; the pre-existing browser Proxy and user tabs are preserved.

## K. Output Safety

Scanned 34 textual build artifacts for common private-key/token patterns, local `/Users/` or `/home/` paths, evidence-only markers, debug output, and Starter/game-confusion residue. No critical leakage found. All 17 HTML pages contain no ad-provider activation. Monetary and percentage references in launch HTML are approved fee examples, policy rates/minimums, product limits, or effective-fee output; no item-price claims were injected.

Reviewed exceptions, not silent exclusions:

- Pagefind's official `options.verbose`-conditional loggers in `pagefind.js` and `pagefind-worker.js` are inherited third-party runtime, not project debug output; the site does not enable verbose logging.
- `dist/media/README.md` is inherited static framework documentation and includes the old Getting Started pageId in a marked syntax example. It creates no page/asset/route. Recorded as NIT-1, not a secret or player-facing obsolete route.

Critical leakage: **0**. This scan is bounded to known patterns, not a guarantee against every possible secret format.

## L. Deferred Scope

No live market API/crawler, historical prices, bulk item/stage pages, alerts, accounts, UGC/voting, multilingual expansion, advanced DPS, P2W calculator, or other deferred product was added. New market/build/tool source contains no fetch/WebSocket/EventSource integration. Ads remain disabled in `src/config/ads.ts`; no ad config/provider/slot change occurred.

Deferred scope preserved: **Yes**.

## M. Approved Fileset

The **41 existing changed paths** below are the exact scope-reconciled release candidate set, not permission to stage a failing implementation. Phase 2A lacks a standalone exhaustive path table, so its implemented surfaces and the Phase 2B pre-existing-worktree statement were reconciled with every actual diff, including test fixtures. No broader set was invented.

| Path | Classification |
| --- | --- |
| `docs/WAR_OF_GENESIS_PHASE_1_IA_SEO_PLAN.md` | APPROVED PHASE 1 PLAN |
| `docs/WAR_OF_GENESIS_STEAM_MARKET_FEE_POLICY.md` | APPROVED FEE POLICY |
| `docs/WAR_OF_GENESIS_PHASE_2A_MVP_IMPLEMENTATION.md` | REPORT / TEST / CONFIG — 2A report |
| `docs/WAR_OF_GENESIS_PHASE_2B_LAUNCH_MVP_COMPLETION.md` | APPROVED PHASE 2B — report |
| `game.config.ts` | APPROVED PHASE 2A + APPROVED PHASE 2B |
| `src/components/Footer.astro` | APPROVED PHASE 2A + APPROVED PHASE 2B |
| `src/components/SteamMarketFeeTool.astro` | APPROVED PHASE 2A |
| `src/components/islands/SteamMarketFeeCalculator.tsx` | APPROVED PHASE 2A — P1 prevents release |
| `src/content/guides/beginner-guide.mdx` | APPROVED PHASE 2A |
| `src/content/guides/farming.mdx` | APPROVED PHASE 2A |
| `src/content/guides/gear.mdx` | APPROVED PHASE 2B |
| `src/content/guides/getting-started.mdx` | APPROVED PHASE 2A — deliberate stub deletion |
| `src/core/optional-routes.ts` | APPROVED PHASE 2A + APPROVED PHASE 2B |
| `src/core/site-validation.ts` | APPROVED PHASE 2A + APPROVED PHASE 2B |
| `src/core/steam-market-fees.ts` | APPROVED PHASE 2A |
| `src/data/page-inventory.json` | APPROVED PHASE 2A + APPROVED PHASE 2B |
| `src/data/schemas/page-inventory.ts` | APPROVED PHASE 2A — explicit module support |
| `src/pages/builds/index.astro` | APPROVED PHASE 2A |
| `src/pages/market/[...slug].astro` | APPROVED PHASE 2A + APPROVED PHASE 2B |
| `src/pages/tools/[slug].astro` | APPROVED PHASE 2A |
| `src/pages/tools/index.astro` | APPROVED PHASE 2A |
| `src/styles/global.css` | APPROVED PHASE 2A + APPROVED PHASE 2B |
| `src/styles/page-families.css` | APPROVED PHASE 2A |
| `src/styles/theme.css` | APPROVED PHASE 2A |
| `tests/config.test.ts` | REPORT / TEST / CONFIG — 2A capabilities |
| `tests/fixtures/media/media-decision-table-sop-v2.6.1.md` | REPORT / TEST / CONFIG — project fixture pageId migration |
| `tests/fixtures/media/media-rich.json` | REPORT / TEST / CONFIG — project fixture pageId migration |
| `tests/media-build.test.ts` | REPORT / TEST / CONFIG — 2A route/feature migration |
| `tests/media-readiness.test.ts` | REPORT / TEST / CONFIG — pageId migration only |
| `tests/media-rendering.test.ts` | REPORT / TEST / CONFIG — pageId migration |
| `tests/optional-routes.test.ts` | REPORT / TEST / CONFIG — 2A routes |
| `tests/patch-impact.test.ts` | REPORT / TEST / CONFIG — pageId migration |
| `tests/phase-2a-routes.test.ts` | REPORT / TEST / CONFIG — 2A positives retained, 2B boundary migration |
| `tests/phase-2b-launch.test.ts` | APPROVED PHASE 2B — regression tests |
| `tests/project-identity.test.ts` | REPORT / TEST / CONFIG — 2A feature/content migration |
| `tests/seo.test.ts` | REPORT / TEST / CONFIG — pageId migration |
| `tests/site-validation.test.ts` | REPORT / TEST / CONFIG — capabilities/pageId migration |
| `tests/steam-market-calculator-ui.test.ts` | REPORT / TEST / CONFIG — 2A UI tests |
| `tests/steam-market-fees.test.ts` | REPORT / TEST / CONFIG — 2A fee vectors/edges |
| `tests/theme.test.ts` | REPORT / TEST / CONFIG — explicit new family tokens |
| `tests/wiki-article.test.ts` | REPORT / TEST / CONFIG — pageId migration |

This task's additional expected path is `docs/WAR_OF_GENESIS_PHASE_2_5_MVP_RELEASE.md`, classified REPORT / TEST / CONFIG. It is an uncommitted blocked-review artifact, not a post-release claim. Total expected changed paths after review: **42**; unexpected paths: **0**.

`dist/`, `.astro/`, test temporary build artifacts, and `/tmp` screenshots remain GENERATED / EXCLUDED. No governance file was created. Existing project tests and fixture adaptations are not mutations to the external frozen framework repositories.

Inspected `git status --short`, all untracked paths, `git diff --name-status`, `git diff --stat`, all tracked diffs, new production/test files, and `git diff --check`. Tracked diff: 1018 insertions, 100 deletions across 24 files. New files are separately included above; ordinary `git diff` does not include their content automatically.

## N. Explicit Staging

Not performed because the P1 gate failed. Index remains empty; staged file count **0**. Neither `git add .` nor `git add -A` was used. Exact-index-to-fileset verification is **not applicable/not performed**, not falsely reported as a 41-path staging PASS.

## O. MVP Commit

Not created. Required future message remains `feat: complete War of Genesis launch MVP`. `MVP_RELEASE_COMMIT` and `MVP_RELEASE_TREE`: **not created**. No amend or tag. Commit verification: **not performed**.

## P. Main Push

Not attempted. No remote history was mutated or overwritten. The test/contract gate must pass before any staging, commit, or `git push origin main`.

## Q. Remote Verification

Read-only `git ls-remote origin refs/heads/main` independently returned `340b82ea5ed1c32fa4330d10540bbc0413e2b026`. Local `refs/remotes/origin/main` matches that baseline. This is a review-time baseline snapshot, not a pre-push freshness guarantee for a later task and not verification of an MVP commit.

At handoff: main and HEAD unchanged; index empty; working tree intentionally not clean because all approved candidate changes plus this report remain uncommitted. Remote-MVP equality/post-push checks are not applicable.

## R. Framework Integrity

Read-only checks of the actual external repositories under `/Users/randyz/work/coding/hot_words_web/Repo_hotgameweb` found expected HEAD/tree and clean worktrees:

| Frozen repository | HEAD | Tree |
| --- | --- | --- |
| `GAME_SOP_V2.6.5` | `9a13b7314b9cb102b0c440d9677ab22400109e8f` | `e485499deac3dafea83391000d9cfa6e37d4a0c3` |
| `GAME_CODEX_MASTER_PROMPT_V2.6.5` | `f655a0e08529060be8b716330ffcecf489a4484d` | `6adc7107c498459ed92696cb189cfc1ec9915258` |
| `GAME_SITE_STARTER_BASED_gamesop2.6.5` | `29b25559cf2af859bca359c7f7fda686a4803c95` | `0920c9de216ada5601f681d81e4345cf69fb65e8` |

All match the Phase 0 provenance baseline. No commands modified these repositories. V2.6.5 framework untouched: **Yes**.

## S. Findings

- **P0: 0**.
- **P1: 1 — policy expiration does not fail closed.** `src/components/islands/SteamMarketFeeCalculator.tsx:79` starts calculations after validating only user inputs; `src/core/steam-market-fees.ts:27` declares `verifiedAt` without checking it. The approved Phase 1 line 393 and fee policy Section P require otherwise. Future-date reproduction still produces results after 91.5 days. Arithmetic today is correct, but compliance and post-expiration safety are not.
- **P2: 0** new release-review findings.
- **NIT: 2**. NIT-1: inherited media README syntax example retains an obsolete guide pageId, without creating public content/routes. NIT-2: Builds contains player-visible implementation-phase wording (“This Phase 2A hub”); optional copy polish, not an unsupported mechanic or blocker.

Minimal proposed fix, **not implemented**: centralize policy validity/age checks and gate both directions before producing results; show an inline re-verification error and suppress fee totals/share-state updates when stale. Cover current, expired, invalid/missing verification date, and inconsistent policy cases with deterministic tests. Review stale-build indexability/unavailability against the approved policy. Keep rates, rounding, currency, vectors, routes, and feature scope unchanged. Update the historical test-coverage claim only after real coverage exists.

## T. Verdict

**BLOCKED — FEE POLICY IMPLEMENTATION DRIFT**

The drift is the approved calculator's policy-validity failure behavior, not newly changed Steam rates or incorrect numeric vectors. Fresh fee policy verification PASS does not satisfy the separate implementation gate. P1 must be resolved and the full release checks rerun before persistence to main.

## U. Exact Next Step

Obtain explicit authorization for the bounded P1 calculator-validity fix and its regression tests. Do not stage the current candidate. After that fix is reviewed, rerun all Phase 2.5 gates, recheck current official fee evidence and remote main immediately before mutation, reconcile the updated explicit fileset, create the one prescribed commit, push main without force, and independently verify remote commit/tree and final local state. Deployment remains a separate next task only after a successful main release; no Vercel/Cloudflare/domain/tag/release work is authorized here.

### Required Output Snapshot

| # | Field | Actual result |
| ---: | --- | --- |
| 1 | Verdict | BLOCKED — FEE POLICY IMPLEMENTATION DRIFT |
| 2 | Actual pwd | `/Users/randyz/work/coding/hot_words_web/gameweb/game_warofgenesis` |
| 3 | Pre-Release HEAD | `340b82ea5ed1c32fa4330d10540bbc0413e2b026` |
| 4 | Launch Planned | 12 |
| 5 | Launch Implemented | 12 |
| 6 | Missing Routes | 0 |
| 7 | Unexpected Routes | 0 |
| 8 | Orphan Routes | 0; Home root, 11 non-home contextual inbound checks PASS |
| 9 | Unsupported Confident Claims | 0 found |
| 10 | Steam Market Active? | Yes; App 4891320, fresh 767-result view |
| 11 | Steam Fee | 5% |
| 12 | Game Fee | 10% |
| 13 | Minimum Fees | $0.01 independently for each component |
| 14 | Rounding Rule | Integer cents; independently floor, then minimum |
| 15 | Fee Re-verification PASS? | Yes; current loaded official function evidence, no account transaction |
| 16 | 9/9 Vectors PASS? | Yes; official replay and local tests |
| 17 | $30.00 Unreachable PASS? | Yes; $29.99 and $30.01 reachable |
| 18 | Tests | PASS; 43 files, 564 tests |
| 19 | Validate | PASS; 17 pages, 3 entries |
| 20 | Check | PASS; Astro 0/0/0 and 564 tests |
| 21 | Build | PASS; 17 pages, reconciliation, Pagefind, generated audit |
| 22 | SEO PASS? | Yes |
| 23 | Visual Review PASS? | Yes, presentation only; does not waive P1 |
| 24 | Ads Enabled? | No |
| 25 | Output Safety PASS? | Yes; critical leakage 0, documented README NIT |
| 26 | Deferred Scope Preserved? | Yes |
| 27 | Unexpected Files | 0 |
| 28 | Blind git add . Used? | No; no staging command at all |
| 29 | Staged File Count | 0 |
| 30 | Staged Paths Correct? | N/A; staging withheld |
| 31 | Commit Message | Prescribed only: `feat: complete War of Genesis launch MVP` |
| 32 | MVP Release Commit | Not created |
| 33 | MVP Release Tree | Not created |
| 34 | Commit Verification PASS? | N/A; no release commit |
| 35 | Main Push Result | Not attempted |
| 36 | Remote Main | `340b82ea5ed1c32fa4330d10540bbc0413e2b026` |
| 37 | Remote Main Correct? | Baseline matches; MVP equality N/A |
| 38 | Working Tree Clean? | No; 41 existing approved-scope paths plus this report |
| 39 | Index Empty? | Yes |
| 40 | V2.6.5 Framework Untouched? | Yes; three clean external repos, expected HEAD/tree |
| 41 | Deployment Performed? | No; local preview only, stopped |
| 42 | Tag Created? | No |
| 43 | P0 | 0 |
| 44 | P1 | 1 |
| 45 | P2 | 0 |
| 46 | NIT | 2 |
| 47 | Report | `docs/WAR_OF_GENESIS_PHASE_2_5_MVP_RELEASE.md`; uncommitted blocked-review artifact |
| 48 | Exact Next Step | Authorize bounded policy-validity fix/tests, then rerun release gates; no deployment |

## Phase 2.5-R1 — Authorized P1 Resolution

Repair date: 2026-09-15. The user authorized the narrow expiry guard and its tests, followed by the original single-commit main release if every gate passes. This section records pre-commit evidence; it does not claim a push has already happened.

- Confirmed the original root cause with deterministic UI tests before production edits: 5 failed / 5 passed, with missing review warnings, retained totals, and retained unreachable-price neighbors at expired dates.
- Added `src/core/steam-market-policy-freshness.ts`; the verified UTC date is valid for ages in `[0, 90 days)`. Review is due at exactly day 90, the conservative interpretation of “every 90 days.” The approved policy prose is unchanged.
- Gated both UI directions before input parsing/calculation. An inline alert replaces all breakdowns, effective-rate output, unreachable neighbors, and quantity totals. Inputs are retained. A capped exact timeout is re-armed for long intervals; focus/visibility refresh covers a resumed or time-shifted page.
- Preserved `src/core/steam-market-fees.ts` byte-for-byte and kept all nine vectors, USD scope, rates, component floors/minimums, reverse reachability, quantity rules, and limits unchanged.
- Targeted freshness/UI/fee tests: 73/73 PASS. Full tests: 44 files, 583/583 PASS. Validate: 17 pages, 3 entries. Check: 141 Astro files, 0 errors / 0 warnings / 0 hints, 583 tests PASS. Final build: 17 pages, 13 Pagefind-indexed pages, normalized 257420 B payload, generated audit PASS.
- Fresh official Chrome replay at `2026-09-15T09:13:04.012Z`: nine vectors PASS both directions; $30.00 unreachable with $29.99/$30.01 neighbors. App 4891320 has 770 results; live price-sort views showed $0.04 low / $193.60 high starting prices, supporting the unchanged $500 product cap. Steam 5%, WoG 10%, USD one-cent component minimums and independent flooring remain verified; script versions `TSVmDS2fQKJu` / `BTKz8kuIPqit` are unchanged. These observations are evidence snapshots, not rankings or a price feed.
- Real production-preview browser: desktop automatically crossed the 90-day deadline; mobile simulated 91.5 days and refreshed on focus. Both retained price 1.00 and quantity 3, with 0 fee breakdowns / 0 quantity totals and the required re-verification alert. Desktop width/scroll 1425/1425; mobile 390/390.
- Independently reconciled 12/12 launch routes with 0 missing / unexpected / orphan pages; all metadata/internal targets PASS. Reviewed all launch main content; unsupported confident claims found: 0. Scanned 34 textual build artifacts; known critical leakage patterns found: 0. Ads remain disabled. All three external V2.6.5 framework repositories retain their expected clean HEAD/tree.
- Exact release candidate: the original 42 paths plus the helper and its test, 44 paths total; unexpected paths 0. The UI tests and this historical report are modifications within that set.
- Independent read-only code review: no Critical or Important findings. The two historical NITs remain untouched. One additional non-blocking test-coverage NIT: static UI tests do not exercise a single mounted instance's lifecycle; actual browser transition checks supply current evidence. Detection-time guard is not a guarantee against old pre-rendered HTML before client execution, or in a no-JS browser.

The original P1 is resolved; current repair findings are P0 0 / P1 0 / P2 0 / NIT 3. The permitted post-release artifact `docs/WAR_OF_GENESIS_PHASE_2_5_R1_FEE_EXPIRY_FIX_AND_RELEASE.md` will record staging, the prescribed one commit, tree, push and independent remote verification. It is intentionally outside that commit to avoid circular self-hash reporting. No deployment or tag is authorized.
