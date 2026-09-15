# Media Decision Table — v2.6.1

## Purpose

Classify media needs for public P0 routes and reconcile planned media lifecycle against implementation.

For new SOP-aligned projects, the authoritative project artifact path is `docs/MEDIA_DECISION_TABLE.md`.

This artifact references the runtime Page Inventory by `pageId` or route. It does not create routes, control navigation, authorize publication, change sitemap/indexability, or replace the Page Inventory SSOT.

Root `MEDIA_DECISION_TABLE.md` is legacy V2.6 Starter compatibility only. If both root `MEDIA_DECISION_TABLE.md` and `docs/MEDIA_DECISION_TABLE.md` exist, the project has duplicate media-table authority and readiness validation must fail closed until one remains.

## Required Scope

Every public P0 route receives exactly one media need state:

- `HIGH PRIORITY`
- `RECOMMENDED`
- `OPTIONAL`
- `NO MEDIA NEEDED`

`NO MEDIA NEEDED` means the page remains useful, comprehensible, and visually complete without media. It must not mean rights are unresolved.

Do not create media quotas. Text-only and no-media routes are valid when intentional, useful, visually complete, and approved where material.

## Lifecycle States

Media lifecycle:

```text
Media Need
→ Candidate
→ Rights / Human Risk Decision
→ Human Decision
→ Integration
→ Visual Gate
```

Allowed states:

- Media Need: `HIGH PRIORITY`, `RECOMMENDED`, `OPTIONAL`, `NO MEDIA NEEDED`
- Candidate: `NOT FOUND`, `FOUND`, `SEMANTICALLY VERIFIED`
- Rights: `VERIFIED`, `UNRESOLVED`, `HUMAN RISK ACCEPTED`, `NOT REQUIRED FOR EMBED`
- Human Decision: `APPROVED`, `WAIVED`, `REVISE`, `BLOCK`, `PENDING`
- Integration: `NOT INTEGRATED`, `INTEGRATED`, `FALLBACK ONLY`
- Visual Gate: `PENDING`, `PASS`, `REVISE`, `BLOCK`

Unknown or unsupported state values are malformed input. Do not infer lifecycle meaning from free text, substrings, synonyms, or state labels outside the allowed list.

## Runtime Page Inventory Resolution

`pageId_or_route` must resolve against the Runtime Page Inventory.

- Exactly one valid match to an existing Inventory `pageId` or `route` is required.
- Zero matches are a validation error.
- Ambiguous or multiple matches are a validation error.
- A leading `/` may be used only as a parsing hint for route-like values.
- This table cannot create new page identities.
- Runtime Page Inventory remains the publication SSOT.

## Starter Readiness Projection

Starter may read this table only to validate structure, resolve rows against Runtime Page Inventory, and project lifecycle rows into narrow readiness evidence through exact state combinations ordered by precedence.

Starter must not decide rights validity, Human waiver validity, visual quality, publication state, lifecycle ownership, or sitemap/indexability.

Projection decision order:

1. Validate exact enum values against the allowed lifecycle states.
2. Resolve `pageId_or_route` to exactly one Runtime Page Inventory row.
3. Branch first on `media_need`.
4. Apply the ordered state-combination rules for that branch.
5. Produce narrow readiness evidence. Starter must not infer undocumented combinations.

Within a branch, evaluate rows in order. The first matching rule is the single projection outcome. Later rules are not evaluated for that row.

`NO MEDIA NEEDED` branch:

| Precedence | Exact state combination | Narrow readiness projection |
|---|---|---|
| 1 - conflict/revise/block | `rights_state: UNRESOLVED`, `human_decision: REVISE` or `BLOCK`, or `visual_gate_state: REVISE` or `BLOCK` | No-media conflict evidence. Conflict is not downgraded to pending. No-media cannot hide unresolved rights, failed sourcing, unfinished integration, or deferred visual work. |
| 2 - pending Human/visual review | `human_decision: PENDING` or `visual_gate_state: PENDING` | Pending no-media review evidence. Do not classify unresolved merely because `candidate_state: NOT FOUND` or `integration_state: NOT INTEGRATED`. |
| 3 - resolved no-media | non-empty positive `need_rationale`; `candidate_state: NOT FOUND`; `rights_state: NOT REQUIRED FOR EMBED`; `human_decision: APPROVED` or `WAIVED`; `integration_state: NOT INTEGRATED`; `visual_gate_state: PASS` | `priority: NO MEDIA NEEDED`; resolved no-media readiness. `NOT FOUND` and `NOT INTEGRATED` are no-media-compatible in this branch only. |
| 4 - unsupported | any other exact-state combination | Unsupported/malformed lifecycle combination. |

`HIGH PRIORITY`, `RECOMMENDED`, and `OPTIONAL` branch:

| Precedence | Exact state combination | Narrow readiness projection |
|---|---|---|
| 1 - explicit Human/visual revise/block | `human_decision: REVISE` or `BLOCK`, or `visual_gate_state: REVISE` or `BLOCK` | Blocking readiness evidence. |
| 2 - Human-approved waiver/reclassification | `human_decision: WAIVED`; `visual_gate_state: PASS`; `candidate_state: NOT FOUND` or `FOUND` or `SEMANTICALLY VERIFIED`; `rights_state: VERIFIED` or `UNRESOLVED` or `HUMAN RISK ACCEPTED` or `NOT REQUIRED FOR EMBED`; `integration_state: NOT INTEGRATED` or `INTEGRATED` or `FALLBACK ONLY`; non-empty `notes` or `owner_or_defer_reason` explaining waiver/reclassification/debt | Resolved by Human-owned waiver/reclassification evidence. Starter validates the exact allowed combination and recorded explanation; it does not judge whether the Human decision is substantively valid. |
| 3 - normal approved integrated media | `candidate_state: SEMANTICALLY VERIFIED`; `rights_state: VERIFIED` or `HUMAN RISK ACCEPTED` or `NOT REQUIRED FOR EMBED`; `human_decision: APPROVED`; `integration_state: INTEGRATED`; `visual_gate_state: PASS` | Resolved integrated-media readiness. `HIGH PRIORITY` maps to `priority: HIGH PRIORITY`; `RECOMMENDED` and `OPTIONAL` remain non-blocking readiness categories. |
| 4 - pending media review | `human_decision: PENDING` or `visual_gate_state: PENDING` | Pending media readiness evidence. Severity follows `media_need`. |
| 5 - fallback-only without waiver | `integration_state: FALLBACK ONLY` | Fallback-only readiness evidence. `FALLBACK ONLY` is not automatically resolved; severity follows `media_need`. |
| 6 - unsupported | any other exact-state combination | Unsupported/malformed lifecycle combination. |

Combinations not matched by exactly one ordered rule are unsupported for Starter projection and must fail closed as malformed input until the SOP/project records a supported exact combination.

Human waiver/reclassification may alter the methodology outcome only through SOP-owned legal states; Starter may report exact state combinations but must not judge whether the Human decision is substantively correct.

## Route Decisions

| pageId_or_route | page_family | media_need | need_rationale | intended_placement | candidate_state | rights_state | human_decision | integration_state | visual_gate_state | source_or_provenance | owner_or_defer_reason | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| guide.beginner-guide | guide/article | RECOMMENDED | A screenshot helps the player. | inline | FOUND | VERIFIED | WAIVED | NOT INTEGRATED | PASS | first-party | Media owner; Human waiver recorded. | Human-approved media debt. |

## Third-party Media Failure State

For embeds, lazy players, unavailable videos, or blocked iframes that would otherwise look broken:

- [ ] Intentional visible fallback exists.
- [ ] Fallback includes useful title/context.
- [ ] Fallback includes source/play/source-link affordance when appropriate.
- [ ] No large blank or broken-looking rectangle remains.

## Blocking Checks

- [ ] Every public P0 Page Inventory route appears here.
- [ ] `HIGH PRIORITY` routes have semantically verified and integrated media or Human-approved reclassification/waiver recorded with exact legal states.
- [ ] Homepage `HIGH PRIORITY` media unresolved at Human Visual Review is at least `REVISE` unless Human approves a no-media exception.
- [ ] No selected media is broken, unsourced, rights-blocked, semantically mismatched, or copied from competitors by default.
- [ ] `NO MEDIA NEEDED` routes have intentional composition rationale.
- [ ] `NO MEDIA NEEDED` is not used as a substitute for unresolved rights.
- [ ] Deferred recommended/optional media has owner or defer reason.
- [ ] Third-party media failure states look intentional where blank rendering would look broken.
- [ ] Final implementation reconciles with this table before release.

## Release Notes

- Unresolved high-priority media:
- Human-approved no-media exceptions:
- Human-approved media debt:
- Broken media / delivery warnings:
