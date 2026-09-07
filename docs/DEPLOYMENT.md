# Deployment

Builds are static and produce `dist/`. Always replace the example canonical
domain in `game.config.ts` before a public deployment.

## Authorization and provider state

Every deployment upload requires explicit operator authorization. A command
name or CLI flag is not evidence of the resulting provider target: in
particular, do not assume that `vercel deploy` or the absence of `--prod`
guarantees a Preview deployment.

After an authorized Vercel upload, inspect the returned deployment URL before
classifying it:

```bash
vercel inspect <deployment-url>
```

Record the provider-reported target and state, and describe the deployment as
Preview or Production only when that result supports the label. Creating or
changing a production alias, attaching a production domain, and changing DNS
are separate external writes that each require explicit authorization. An
upload authorization does not authorize any of those actions.

## Cloudflare Workers static assets

Wrangler 4 is pinned as a development dependency. `wrangler.jsonc` serves only
`dist`, forces the starter's trailing-slash URL policy, and uses the generated
`404.html` instead of an SPA fallback. The committed `send_metrics: false`
setting also disables Wrangler CLI telemetry for this project.

Validate locally without uploading:

```bash
npm run deploy:dry-run
```

When the operator has configured the intended Cloudflare account/project and
is ready to create or update the live Worker, deployment is an explicit manual
step:

```bash
npm run build
npx wrangler deploy
```

Do not store API tokens or account IDs in the repository. Supply credentials
through the operator's environment or Cloudflare-supported authentication.

## Cloudflare Pages alternative

Create a Pages project for the repository with:

- build command: `npm run build`
- build output directory: `dist`
- Node version: `22.22.0`
- root directory: repository root

The included GitHub Actions workflow validates builds only; it intentionally
does not deploy or require secrets.

## Production verification

After DNS and HTTPS are active, verify:

- canonical/OG URLs use the real domain;
- `/robots.txt`, `/sitemap-index.xml`, and `/404.html` return correctly;
- trailing-slash redirects settle on one URL;
- Pagefind assets load from `/pagefind/`;
- cache/compression headers are suitable for hashed `_astro` assets;
- no unpublished, disabled, or example-domain URL is exposed.

Finish `docs/QA_CHECKLIST.md` on the live domain. Local size budgets do not
prove real-network Core Web Vitals or browser compatibility.
