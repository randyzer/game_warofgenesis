# Project Brief

Status: Phase 0 identity and scope record; the production site is not deployed.

## Version Provenance

- SOP: `GAME_SOP_v2.6.5` at `9a13b7314b9cb102b0c440d9677ab22400109e8f`
- Master Prompt: `codex-master-prompt-v2.6.5` at `f655a0e08529060be8b716330ffcecf489a4484d`
- Starter: `starter-v2.6.5` at `29b25559cf2af859bca359c7f7fda686a4803c95`
- Starter tree: `0920c9de216ada5601f681d81e4345cf69fb65e8`
- Project repository: `https://github.com/randyzer/game_warofgenesis.git`

## Game Identity

- Site name: War of Genesis Wiki
- Game: [WoG] War of Genesis: Idle Loot
- Platform: Steam
- Steam App ID: `4891320`
- Store URL: `https://store.steampowered.com/app/4891320/` (derived from the supplied App ID; not independently researched in Phase 0)
- Primary locale: `en`

## Site

- Domain and canonical production origin: `https://war-of-genesis.wiki`
- Deployment target: Vercel (record only; not configured or deployed in Phase 0)
- DNS provider: Cloudflare (record only; no DNS change in Phase 0)
- Site type: decision-support wiki and practical tools
- Ads: disabled

## Target Users and Positioning

The primary users are English-reading players who want to improve progression by making better farming, equipment, build, and Steam Market decisions. The site is positioned as a War of Genesis: Idle Loot decision-support wiki and tools product, not a generic AI wiki.

Core user jobs:

- Decide where to farm.
- Decide which equipment to keep or sell.
- Estimate how valuable an item is.
- Compare class and build choices.
- Understand how Steam Market trading affects progression.

## Competitive Position

- Direct competitors: not validated in Phase 0; no market conclusion is made.
- Substitute workflows to validate later with first-party platform samples: Steam Community guides/discussions, creator videos, community chat, and player-maintained spreadsheets.
- Differentiation: combine Steam Market economics with farming decisions, equipment/build decisions, and practical tools in one source-aware workflow.

## MVP Direction

Content candidates, recorded only:

- Beginner Guide
- Classes
- Farming Guide
- Steam Market Guide
- Best Items to Sell
- Builds
- Codes
- Patch Notes

First tool candidate: Steam Market Fee / Net Profit Calculator.

## Deferred Functionality

- Steam Market scraping or API integration
- Price database and item price tracking
- Valuable-drop ranking
- Farming profit estimator
- Equipment comparator
- Build sharing
- P2W value calculator
- Bulk content or database-page generation
- Multilingual content
- Live ads
- Deployment, DNS changes, and custom-domain activation

## Safety Boundaries

- War of Genesis: Idle Loot is not War of Genesis: Idle Heroes.
- Do not import Idle Heroes redeem codes or fabricate codes.
- Do not publish market prices, game mechanics, or recommendations without sourced review.
- Keep inherited V2.6.5 monetization architecture unchanged and disabled until separately approved.
