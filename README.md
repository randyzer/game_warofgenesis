# GAME_SITE_STARTER v2.5.0

Starter v2.5.0 is a static-first Astro foundation for media-rich game wikis. It
keeps the proven publication, fact, SEO, route, search, and reconciliation core
while providing a player-facing Wiki portal, grouped navigation, Wiki articles,
local media, optional FAQ content, neutral theme defaults, and restrained
page-family accents.

The default repository is a small generic adoption example. It deliberately
does not ship fictional game facts, screenshots, news, or entity databases.

## Version provenance

These three artifacts have different responsibilities:

- `GAME_SOP v2.5` is the production methodology. It decides what a competitive
  game wiki should cover and which human research/release gates apply.
- `GAME_SITE_STARTER v2.5.0` is the reusable technical implementation that makes
  approved coverage easy to publish consistently.
- Historical Master Prompt files and Starter 2.0 reports are provenance
  artifacts. Do not treat those stale references as current Starter identity.

Starter v2.5.0 follows the approved implementation scope in
[`docs/STARTER_V2.5_CHANGE_PROPOSAL.md`](docs/STARTER_V2.5_CHANGE_PROPOSAL.md)
while preserving the Starter 2.0 architecture baseline recorded in
[`docs/STARTER_2.0_ARCHITECTURE_PROPOSAL.md`](docs/STARTER_2.0_ARCHITECTURE_PROPOSAL.md).

## Requirements and first build

- Node.js `22.22.0` from `.nvmrc`
- npm with lockfile support

```bash
nvm use
npm ci
npm run validate
npm run check
npm run build
npm run preview
```

The production output is `dist/`. `npm run build` validates configuration,
content, facts, and media; generates static Astro pages; reconciles every HTML
route exactly with Runtime Page Inventory; creates the Pagefind index; and audits
generated HTML, links, SEO, sitemap, robots, media markup, and size budgets.

## Practical architecture

| Authority | Owns | Does not own |
| --- | --- | --- |
| `src/data/page-inventory.json` | Page existence, route, publication state, visibility, indexability, titles, relationships, source basis | Article body, media placement, FAQ, layout |
| `game.config.ts` | Brand/site values, feature flags, navigation groups/order, featured page IDs | Duplicate routes or publication state |
| `src/content/**` | Narrative guide/meta/news content and optional authored FAQ | Page identity or publishing decisions |
| `src/data/facts/**` | Validated patch-sensitive structured facts and provenance | Routes or presentation labels |
| `src/data/media/media.json` | Local image/local video/YouTube assets and `hero`/`gallery`/`trailer` page mappings | Page publication or arbitrary layout slots |
| `src/styles/theme.css` | Game-wide palette and page-family role tokens | Arbitrary per-component family keys |
| Components | Presentation of already resolved data | A second publication or content database |

The implementation uses:

- Astro 7 static output, strict TypeScript, Zod, and Tailwind CSS 4;
- MDX Content Collections for guides, meta pages, and patch/news articles;
- React Islands only for Pagefind search, entity filtering, calculators, and
  planners;
- Pagefind for local static search, with no external search service;
- deterministic feature filtering and exact output reconciliation.

## Adopt for a real game

1. Record the source Starter commit, `GAME_SOP v2.5` commit, and current Master
   Prompt version in the new project's brief.
2. Complete the SOP research and human planning gates before changing page
   scope. The Starter does not decide whether a game needs heroes, tier lists,
   maps, tools, or any other content family.
3. Replace the example brand, canonical HTTPS URL, SEO defaults, social handle,
   feature flags, grouped navigation, and featured IDs in `game.config.ts`.
4. Review `src/data/page-inventory.json`. Add each approved route there before
   writing its content or data.
5. Add narrative content under `src/content/`, facts under `src/data/facts/`,
   tools under `src/data/tools/`, and reviewed local media under `public/media/`.
6. Replace the neutral fallback palette in `src/styles/theme.css` after game
   visual identity research. Footer colors derive from shared theme tokens.
7. Run the complete workflow in
   [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md) before any deployment.

Projects upgrading from Starter 1.0 or a 2.1-based copy should follow
[`docs/STARTER_2.0_MIGRATION.md`](docs/STARTER_2.0_MIGRATION.md).

## Presentation contracts

### Grouped navigation

`navigation.groups` stores grouping and order using Page IDs. Runtime Page
Inventory remains the source of routes, titles, and enabled state.
`src/core/site-data.ts` is the sole Page ID → enabled page resolver and exports
`resolvedNavigationGroups`; desktop/mobile components only render that result.

The legacy `navigation.primaryPageIds` input is accepted as a migration adapter
and normalized to childless groups. New projects should author only
`navigation.groups`.

### WikiArticle and EditorialArticle

Guide articles use `WikiArticle`: player-facing dates, optional media and Quick
Facts, body-renderer H2/H3 TOC, optional FAQ, Related Pages, and Sources &
Verification. Internal Priority, Confidence, Search Signal, tags, and editorial
briefs are not rendered.

`EditorialArticle` remains the deliberate layout for meta/tier and patch/news
content. It keeps player-friendly publication/verification information without
reintroducing research-report metadata.

### Homepage heading

The homepage H1 uses `homepage.displayHeading` when it is explicitly authored
and non-blank. If omitted, it falls back to `brand.name`. The default Starter
config intentionally omits `displayHeading`; projects should author their real
game-facing heading during adoption. `brand.tagline` remains supporting copy,
not an automatic H1.

When homepage hero media is absent, the desktop hero renders as an intentional
single-column layout. When hero media exists, the desktop split layout remains.
Mobile remains one column in both states.

### Media V2.5.0

Media v2.5.0 supports only:

- local image files under `public/media/`, referenced as `/media/...`;
- validated 11-character YouTube IDs rendered through `youtube-nocookie.com`;
- local `.mp4` and `.webm` files under `public/media/`, with optional local
  poster images.

Native local videos render with controls, `playsinline`, `preload="metadata"`,
and the same 16:9 responsive wrapper as YouTube embeds. The manifest provides
only `hero`, `gallery`, and `trailer` placements. Guide and entity articles may
render all fixed placements; hubs render hero media only. Remote images,
arbitrary iframes, uploads, dimensions/crops, a placement DSL, DAM, CDN
abstraction, transcoding, and image/video processing are not supported. Every
asset requires an HTTPS `sourceUrl` for provenance; that URL does not prove
legal reuse rights.

Build audit may emit a non-blocking advisory for unusually large local video
files. The advisory is an implementation-local heuristic, not a universal byte
limit; project budgets and observed delivery behavior remain authoritative.

See [`public/media/README.md`](public/media/README.md) for the exact contract.

### Page-family accents

The family key is the controlled Runtime Page Inventory `module`. BaseLayout
exposes that value and `src/styles/page-families.css` maps it to
`--page-accent`. Game-specific color values belong only in `theme.css`; an
unconfigured family falls back to `--color-accent`.

Components must not invent keys such as `beginner-guides`, `early-game`, or
`hero-detail`.

### Wiki Portal homepage and FAQ

The homepage has a fixed portal composition. It derives featured/start pages,
categories, systems, updates, Browse All, and optional media from existing
authorities; empty sections render nothing. It is not a Homepage CMS or block
builder.

FAQ items are optional authored Content fields. They are visible when supplied,
render nothing when empty, do not enter Page Inventory, and currently emit no
FAQ JSON-LD. QuickFacts is a presentation primitive: projects map validated
Fact values to `{ label, value }` without adding display labels to Fact schemas.

## Feature flags

All flags are explicit in `game.config.ts`: `guides`, `heroes`, `weapons`,
`items`, `maps`, `tierLists`, `news`, `search`, `calculator`, and `planner`.

A disabled feature removes its owned pages from the enabled catalog and every
derived surface: routes, grouped navigation, homepage collections, related
links, sitemap, Pagefind, and generated HTML. Enabling an entity or tool without
its required validated data fails validation rather than publishing a partial
module.

Entity-family definitions live in `src/data/entity-modules.ts`. Extending the
supported families requires an explicit reviewed implementation and tests; this
is not a plugin system.

## Documentation

- [Starter v2.5.0 change proposal](docs/STARTER_V2.5_CHANGE_PROPOSAL.md)
- [Starter 2.0 architecture baseline](docs/STARTER_2.0_ARCHITECTURE_PROPOSAL.md)
- [Content and data boundaries](docs/CONTENT_AND_DATA_GUIDE.md)
- [Starter 1.0 → 2.0 migration](docs/STARTER_2.0_MIGRATION.md)
- [Release QA checklist](docs/QA_CHECKLIST.md)
- [Patch workflow](docs/PATCH_WORKFLOW.md)
- [Deployment boundary](docs/DEPLOYMENT.md)
- [Starter 2.0 release audit](docs/STARTER_2.0_RELEASE_AUDIT.md)

## Commercial-use boundary

The Starter architecture is suitable for commercial projects, but it grants no
rights to a game's name, logo, screenshots, official art, APIs, third-party wiki
content, scraped data, or community submissions. The adopter remains responsible
for factual review, licenses, platform terms, attribution, privacy, analytics,
advertising, legal copy, and the final human release decision.

No analytics, telemetry, accounts, database, CMS, ad scripts, or automatic
content/media selection are included by default.
