# GAME_SITE_STARTER v2.5.0 Release QA Checklist

Use this checklist after changing config, Runtime Page Inventory, content,
facts, tools, media, theme, dependencies, or presentation components.

Automated checks establish deterministic structural correctness. They do **not**
prove that content is useful or accurate, that media is visually appropriate,
or that the operator has legal reuse rights. Human review remains a release
gate.

## Record provenance first

- [ ] Record the source Starter commit and working branch.
- [ ] Record the `GAME_SOP v2.5` commit used for production methodology.
- [ ] Record the current Master Prompt version.
- [ ] Record any known version mismatch instead of silently rewriting upstream
      documents.
- [ ] Confirm the v2.5 scope authority is
      `docs/STARTER_V2.5_CHANGE_PROPOSAL.md`.
- [ ] Confirm the working tree contains no unrelated or secret files.

## AUTOMATED / DETERMINISTIC gate

Run with Node `22.22.0` from `.nvmrc` and the committed lockfile:

```bash
nvm use
npm ci
npm run validate
npm run check
npm run build
git diff --check
```

Do not continue to release review if any command exits non-zero.

### Configuration and publication

- [ ] Zod accepts `game.config.ts`, Inventory, content, facts, tools, and media.
- [ ] Every feature flag is explicit.
- [ ] Page IDs, routes, normalized primary keywords, content references, media
      IDs, and page media mappings satisfy their uniqueness rules.
- [ ] Enabled Catalog contains only public, published pages whose feature owner
      is enabled.
- [ ] Page Inventory remains the publication SSOT and contains no media, layout,
      slot, or route-level visual decision fields.
- [ ] No broad catch-all route such as `src/pages/[...path].astro` exists.
- [ ] Draft/private/unlisted/scheduled/archived/feature-disabled pages do not
      leak into routes, navigation, homepage, related links, sitemap, or search.
- [ ] Enabling an entity module without its required valid fact file fails.
- [ ] Enabling a tool page without its required valid definition fails.

### Navigation

- [ ] `navigation.groups` references only existing enabled Page IDs.
- [ ] Navigation-tree Page IDs are unique inside the primary/secondary tree.
- [ ] `children: []` resolves as a childless group with no empty dropdown.
- [ ] `src/core/site-data.ts` remains the sole Page ID → enabled page resolver.
- [ ] Header/DesktopNav/MobileNav consume `resolvedNavigationGroups` without a
      second lookup or publication filter.
- [ ] Legacy `primaryPageIds`, when tested for migration, normalizes to
      childless groups and is not authored together with `groups`.

### Content and player-facing metadata

- [ ] Every enabled editorial Inventory `contentRef` has exactly one matching
      Content entry.
- [ ] Guide pages render through WikiArticle; meta/news retain EditorialArticle.
- [ ] WikiArticle TOC includes only content-renderer H2/H3 headings.
- [ ] FAQ, QuickFacts, Sources, Related Pages, navigation/layout headings, H1,
      and H4+ do not enter the TOC.
- [ ] Public HTML does not expose Priority, internal Confidence, Search Signal,
      tags, editorial briefs, or evidence-ledger UI.
- [ ] Empty QuickFacts and FAQ inputs emit no heading, wrapper, or gap.
- [ ] No FAQ JSON-LD exists unless a separately reviewed implementation reuses
      the exact visible FAQ data.

### Media

- [ ] Asset IDs and page mappings are unique; every referenced asset/page exists.
- [ ] `hero`/`gallery` reference images and `trailer` references a video.
- [ ] Image `src` starts with `/media/`, cannot traverse directories, and maps
      to a real regular file under `public/media/`.
- [ ] Local video `src` starts with `/media/`, uses `.mp4` or `.webm`, cannot
      traverse directories, and maps to a real regular file under
      `public/media/`.
- [ ] Local video posters are optional, local image files only, and fail
      validation when missing or unsafe.
- [ ] Remote image URLs are rejected.
- [ ] Every asset has HTTPS provenance `sourceUrl`.
- [ ] Informative images have meaningful alt text; decorative images use exactly
      `alt: ""` only by intentional human decision.
- [ ] YouTube `src` is an 11-character ID; iframe uses
      `youtube-nocookie.com`, a non-empty title, lazy loading, limited
      permissions, and fullscreen support.
- [ ] Native local video renders with controls, `playsinline`,
      `preload="metadata"`, a 16:9 wrapper, source provenance, and no autoplay.
- [ ] Hub pages render manifest hero media only; they do not automatically
      render gallery or trailer placements.
- [ ] Static wiki media support, if used, accepts explicit page input and fixed
      placements only; it does not own routing or publication.
- [ ] Empty manifest/no page mapping emits no media section or placeholder.
- [ ] A broken media reference fails validation rather than falling back.
- [ ] No build-time media network probe occurs.
- [ ] Any local video size message is an advisory only and is not treated as a
      universal SOP byte limit.

### Theme and homepage

- [ ] Every controlled Inventory module has one reviewed page-family token or
      explicit `--color-accent` fallback mapping.
- [ ] `data-page-family` comes exactly from `page.module`; components do not
      invent family keys.
- [ ] Raw game-specific colors remain in `theme.css`.
- [ ] Starter fallback colors remain neutral and installable, not a shippable
      generic brand identity.
- [ ] Footer colors, borders, muted text, and links derive from theme tokens.
- [ ] Homepage consumes the enabled catalog, existing featured IDs, optional
      Fact mapping, Content FAQ, and Phase B Media only.
- [ ] Homepage H1 uses authored `homepage.displayHeading` when supplied and
      falls back to `brand.name` when omitted; blank values fail validation.
- [ ] The default Starter config omits `homepage.displayHeading`.
- [ ] No polished generic Starter hero slogan is present in rendered HTML.
- [ ] Homepage section order remains fixed code; no block array, section
      registry, Page Builder, or Homepage CMS exists.
- [ ] Homepage de-duplication is deterministic and Browse All contains only
      eligible enabled pages.
- [ ] Empty/minimal data leaves a coherent Hero with no dead anchor, empty
      heading, shell, card, or placeholder.
- [ ] Desktop no-media homepage Hero is a deliberate single-column layout;
      desktop media Hero keeps the split layout; mobile remains one column.

### Generated output, SEO, and budgets

`npm run build` must complete each stage:

- [ ] configuration/content/fact/media validation;
- [ ] Astro static generation;
- [ ] exact Runtime Page Inventory ↔ HTML output reconciliation;
- [ ] Pagefind indexing;
- [ ] generated HTML, internal-link, canonical, robots, JSON-LD, sitemap, image
      alt, media, and orphan-page audit;
- [ ] per-page HTML ≤ 80 KB;
- [ ] referenced CSS ≤ 64 KB;
- [ ] referenced JavaScript ≤ 230 KB;
- [ ] Pagefind output ≤ 800 KB.

Also inspect the final output directly:

- [ ] Canonical URLs use the configured production HTTPS origin.
- [ ] Indexable pages use `index, follow, max-image-preview:large` and one
      `data-pagefind-body` region.
- [ ] Noindex pages are absent from sitemap and Pagefind body.
- [ ] `robots.txt` references the configured sitemap index.
- [ ] Sitemap URLs equal enabled indexable Inventory routes.
- [ ] Every page has one H1, non-empty title/description, valid JSON-LD, and no
      broken internal link.
- [ ] Ordinary static pages do not hydrate client JavaScript; islands appear
      only on Search/entity-filter/calculator/planner pages that use them.

## Feature-off and fallback matrix

Use unit fixtures or isolated repository copies. Do not edit production
Inventory merely to manufacture a state.

| State | Deterministic expectation | Evidence to record |
| --- | --- | --- |
| Guides OFF | No guide Hub/article static paths; unrelated Search may remain if enabled | Optional-route test or isolated build routes |
| Search OFF | No `/search/` output, nav reference, sitemap entry, or Pagefind body | Optional-route test or isolated build routes |
| Entity modules OFF | No entity Hub/database/detail output or required fact file read | Catalog/fact-loader tests and build tree |
| News OFF | No patch route or Latest Updates section | Page-model/homepage tests and output |
| Tools OFF | No calculator/planner route or island reference | Page-model test and output assets/HTML |
| Empty Media | Valid build; no media wrapper/placeholder | Default manifest build |
| No FAQ | Valid article; no FAQ heading/wrapper | Component/build/browser inspection |
| No applicable Quick Facts | No QuickFacts heading/wrapper | Homepage/article inspection |
| Minimal homepage | Hero remains coherent; optional sections absent | Pure model + browser fixture |
| 20+ page homepage | Deterministic de-duplication; all eligible pages discoverable | Model + browser fixture |
| Media-rich page/home | Fixed placements render responsively | Isolated manifest build + browser fixture |
| Local MP4/WebM video | Native video renders controls, playsinline, metadata preload and source link | Media rendering test + build audit |
| Hub hero media | Hub renders only configured hero and no gallery/trailer wrappers | Component/build inspection |

## Starter adoption smoke test

Use a disposable isolated copy, never the canonical working tree:

- [ ] Copy the Starter at the candidate baseline commit.
- [ ] Install exactly the committed dependencies with `npm ci`.
- [ ] Replace basic brand/site/SEO values.
- [ ] Author grouped navigation using Page IDs.
- [ ] Keep or edit Inventory and add one reviewed guide row/contentRef.
- [ ] Add one matching MDX guide.
- [ ] Optionally add one local file under `public/media/` and its manifest
      mapping/provenance.
- [ ] Run `npm run validate`, `npm run check`, and `npm run build`.
- [ ] Confirm exact output reconciliation and expected route count.
- [ ] Confirm the disposable content/media never enters the canonical Starter.

## HUMAN / QUALITATIVE release gate

Automation cannot approve the following items.

### Content, facts, and game fit

- [ ] Each page solves a real player task and is useful beyond a rewritten
      search snippet.
- [ ] Titles, descriptions, headings, FAQ, and internal links match visible
      content and actual player intent.
- [ ] Factual claims, game versions, patch labels, formulas, and observations
      have been manually checked against the cited source.
- [ ] Sources are authoritative enough for the claim and their access dates are
      current.
- [ ] Competitive coverage, content-family selection, P0/P1/P2 scope, and game
      fit satisfy `GAME_SOP v2.5` and project research.
- [ ] Internal review/update flags are cleared only by an authorized human.

### Media and rights

- [ ] Every image/video is useful at its placement and represents the correct
      game/version/UI.
- [ ] Cropping, compression, caption, alt text, and visual quality are acceptable
      on real devices.
- [ ] The operator has reviewed copyright, license, platform terms, attribution,
      trademark, privacy, and commercial-use requirements.
- [ ] `sourceUrl` provenance is not mistaken for legal permission.
- [ ] YouTube privacy/consent and regional availability are acceptable for the
      target audience.
- [ ] Local videos meet the project's own performance budget and observed
      delivery behavior; Starter advisory text is not treated as a release rule.

### Responsive, keyboard, and accessibility review

Inspect at minimum `390 × 844`, `768 × 1024`, and `1440 × 1000`:

- Homepage, Guide, Guide Hub, Search;
- media-rich and no-media pages;
- FAQ-rich and no-FAQ pages;
- Entity, Update, and Tool fixtures if those families are disabled by default.

At every size verify:

- [ ] navigation hierarchy, parent Hub links, dropdown/expand controls, active
      state, focus order, Escape/Enter/Space behavior, and 44–48 px touch targets;
- [ ] one clear H1, readable hierarchy, prose width, cards, TOC, tables, and no
      page-level horizontal overflow;
- [ ] Hero/gallery/captions scale naturally and video remains 16:9;
- [ ] FAQ questions and expanded answers remain readable; component headings do
      not appear in the article TOC;
- [ ] page-family accents are restrained, consistent, and do not reduce text
      contrast;
- [ ] browser console has no unexpected warning/error;
- [ ] no unexpected third-party request occurs beyond an intentionally embedded
      YouTube video;
- [ ] reduced-motion mode keeps content visible and usable.

Before commercial release, repeat representative checks in current Safari,
Chrome, and Firefox, on real touch hardware and with a screen reader where
practical.

### Live delivery and legal

- [ ] Replace `gameatlas.example`, Starter legal copy, and placeholder brand
      values before deployment.
- [ ] Validate representative live URLs with Schema.org Validator and Google
      Rich Results Test.
- [ ] Verify HTTPS, redirects, custom 404, cache/compression headers, robots,
      sitemap, and Pagefind from outside authenticated development systems.
- [ ] Run Lighthouse/Core Web Vitals on the real deployed corpus and target
      devices.
- [ ] Review analytics, cookies, advertising, privacy, terms, and jurisdictional
      requirements for the actual deployment.
- [ ] Obtain explicit authorization before upload, production alias, domain, or
      DNS changes.

## Expected non-blocking warnings

Astro reports no files matching `src/content/meta/**/*.{md,mdx}` and
`src/content/news/**/*.{md,mdx}` while those optional features are disabled and
the collections intentionally contain no articles. This is expected only in
that state. Do not add fake content to silence the message.

## Release evidence record

Record, at minimum:

- baseline commit, SOP commit, branch, Node/npm versions;
- files changed and architecture-drift audit;
- test file/test counts and command exit status;
- enabled pages, generated routes, sitemap/Pagefind counts, size budgets;
- feature-off/fallback/adoption smoke results;
- responsive viewport/page matrix and console state;
- known warnings, non-blocking limitations, and unresolved human checks;
- dependency/lockfile diff;
- final verdict: `READY FOR HUMAN RELEASE REVIEW` or
  `NOT READY — BLOCKERS FOUND`.

The automated agent does not declare the Starter released. A human owns the
final release decision.
