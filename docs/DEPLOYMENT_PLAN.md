# War of Genesis 重构部署方案

状态：APPROVED；准备时间：2026-10-12T02:51:33.580017+00:00。用户已确认具体方案；执行结果将记录在部署报告。

## 已核对的项目与分支

- 重构工作目录：`/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis`。
- GitHub：`https://github.com/randyzer/game_warofgenesis.git`；只推送 `origin/codex/template-rebuild`。
- 当前 HEAD：`ae6ac45c9a37a59cdef5ee451a5f38c5d0009c9c`；远端重构分支：`15da8b9401e80e8f881eb0bbb1ef814a871a0a67`；领先2、落后0、无分叉。
- 原始 `main` 为 `3784e8852ffb3c17cdea79d721adfaf1db1bc70c`，不修改、不合并到它。
- 保留已有2个未推送提交：`dbf068e`（清理旧站）、`ae6ac45`（导入temp5）；再提交当前已审核的内容、UI、SEO及政策改动。
- 提议提交信息：`feat: publish War of Genesis rebuilt guide site`。
- 当前站点源码指纹：`af6c304b7168957947c73c349b429c7f510246606c6949f64ca9a223f178d830`，逐文件SHA256见JSON；提交后按同一源码复验发布结论。

## 构建、运行与核验

- Next.js 16.3.7、React19.3.0、pnpm12.6.0、Node22；需要Next服务器支持动态410，不能当作Astro dist或静态导出部署。
- 当前类型检查、lint和生产构建通过。生产预览14页面、14条sitemap URL、17资源、2个410、根目录/favicon.ico全部通过；无断链、密钥模式或模板身份残留。
- 最新上线门禁：`docs/prelaunch/20261012-091039/PRELAUNCH_ACCEPTANCE.json`，结论“可以上线”，未关闭P0/P1/P2均为0。
- 没有额外必需环境变量；GA4 Measurement ID及已确认广告嵌入是公开标识，复用已有代码。
- 备选：自行托管Node22运行 `pnpm build` / `pnpm start` 并配置HTTPS。未配置服务器，不属于本次执行；Cloudflare Pages静态托管不适合当前410实现。

## Vercel与域名

- 复用团队 `randyzers-projects`、项目 `game-warofgenesis`，ID `prj_ZIiDRbpa7XEzaggJmJNYdmpIJ3SZ`。当前CLI与浏览器均取得已有账号访问。
- 现有生产分支 `main`，现有构建为Astro / `npm run build` / `dist`。拟改Next.js / Node22.x / `pnpm install --frozen-lockfile` / `pnpm build` / 输出目录自动检测 / 仓库根目录。
- 先保持生产分支main，推送重构分支触发Preview。Preview核验通过后，将Settings → Environments → Production → Branch Tracking改为 `codex/template-rebuild`，再提升已验证预览至生产。以后该分支的推送自动触发生产部署。
- 正式地址与canonical：`https://war-of-genesis.wiki`；www保持308到apex。Spaceship注册、Cloudflare DNS，NS为nola/sage.ns.cloudflare.com。
- Vercel已验证域名、配置无误；DNS变更清单为空，保留已有A/CNAME、邮件/TXT和其他记录，不改NS。
- 当前Hobby；用户已明确选择继续Hobby，不升级Pro、不新增付费资源或更改账单。官方现行商业用途规则将广告列为商业使用，作为已披露记录保留；本次不再浏览套餐规则。当前Hobby基础费$0，包含每月100GB传输/100万函数调用、Runtime Logs可见1小时；Pro未选用，其基础费$20/月，含1部署席位及$20用量额度，额外使用及税费另计。具体出处见JSON及下方参考。

## 执行步骤

1. Recheck remote heads and exact source digest; stage only the 68 listed paths, inspect staged diff and credentials scan.
2. Commit pending approved source/doc changes with the proposed message; preserve the two existing unpushed commits and original main checkout. Revalidate the prelaunch disposition against this commit and source digest before push.
3. Update existing Vercel project to the proposed Next.js settings, keeping main as production branch during preview. No billing or DNS changes.
4. Push HEAD to origin refs/heads/codex/template-rebuild with temporary proxy and HTTP/1.1 flags. This creates a Preview deployment while main remains production.
5. Inspect Preview READY status and exact Git commit, all 14 routes, 308 redirects, 410 handlers, sitemap/robots/favicons/assets, browser navigation/mobile behavior and absence of production analytics/ads on preview.
6. After Preview passes, change Production Branch Tracking from main to codex/template-rebuild in existing project Settings > Environments > Production; promote the verified preview using vercel promote <deployment-id> --scope randyzers-projects --yes. Official CLI rebuilds preview for production; verify the new production deployment uses the same commit and is READY.
7. Verify apex HTTPS and www redirect, all published routes/SEO/assets and production GA4/Adsterra tag loading; do not click ads. Record actual results and rollback in DEPLOYMENT_REPORT.md/json. Google account writes remain a separate subsequent step.

执行Git时只在单次命令中使用已有代理 `http://127.0.0.1:7897` 和HTTP/1.1；不更改持久Git设置。需核对命令为 `git -c http.proxy=http://127.0.0.1:7897 -c http.version=HTTP/1.1 ls-remote origin refs/heads/codex/template-rebuild refs/heads/main`；获批推送命令为 `git -c http.proxy=http://127.0.0.1:7897 -c http.version=HTTP/1.1 push origin HEAD:refs/heads/codex/template-rebuild`。若远端改变、部署源不同或验证失败则暂停，不force-push。

## 精确提交清单（68项）

54项站点源码/资源（含删除）、7项内容及政策文档、5项最新门禁摘要、2项部署方案。逐路径显式暂存，禁止git add . / -A。

- `.gitignore`
- `app/globals.css`
- `app/guides/[slug]/page.tsx`
- `app/guides/page.tsx`
- `app/icon.svg`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/page.tsx`
- `components/article-shell.tsx`
- `components/faq-list.tsx`
- `components/mobile-menu.tsx`
- `components/site-footer.tsx`
- `components/site-header.tsx`
- `content/guides/controls.mdx`
- `content/guides/gear-forging.mdx`
- `content/guides/getting-started.mdx`
- `content/guides/how-to-play.mdx`
- `content/guides/overview.mdx`
- `content/guides/squad-building.mdx`
- `content/guides/world-progress.mdx`
- `lib/articles.ts`
- `lib/site-data.ts`
- `next-env.d.ts`
- `next.config.mjs`
- `public/illustrations/guide-cover.svg`
- `public/illustrations/hero-grid.svg`
- `public/illustrations/map-panel.svg`
- `app/cookies/page.tsx`
- `app/guides/farming/route.ts`
- `app/guides/gear/route.ts`
- `app/privacy/page.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/terms/page.tsx`
- `components/legal-page.tsx`
- `components/site-services.tsx`
- `content/guides/classes.mdx`
- `content/guides/discord.mdx`
- `content/guides/in-app-purchases.mdx`
- `content/guides/market-buying.mdx`
- `content/guides/market.mdx`
- `content/guides/player-count.mdx`
- `content/guides/profile.mdx`
- `content/guides/vs-path-of-idle.mdx`
- `lib/legal-pages.ts`
- `lib/page-metadata.ts`
- `lib/retired-guide.ts`
- `public/android-chrome-192x192.png`
- `public/android-chrome-512x512.png`
- `public/apple-touch-icon.png`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/favicon.ico`
- `public/site.webmanifest`
- `docs/CONTENT_GAPS.md`
- `docs/CONTENT_INTEGRATION_REPORT.md`
- `docs/CONTENT_PAGE_MANIFEST.json`
- `docs/CONTENT_PROVENANCE.md`
- `docs/LEGAL_CONTENT_DRAFT.md`
- `docs/LEGAL_FACT_CHECK.md`
- `docs/LEGAL_PAGE_MANIFEST.json`
- `docs/prelaunch/20261012-091039/PRELAUNCH_ACCEPTANCE_REPORT.md`
- `docs/prelaunch/20261012-091039/PRELAUNCH_ACCEPTANCE.json`
- `docs/prelaunch/20261012-091039/CHECK_RESULTS.json`
- `docs/prelaunch/20261012-091039/REPAIR_MANIFEST.md`
- `docs/prelaunch/20261012-091039/SOURCE_RECHECK.json`
- `docs/DEPLOYMENT_PLAN.md`
- `docs/DEPLOYMENT_PLAN.json`

排除 `.env*`、凭据、node_modules、.next、out、tsbuildinfo、.DS_Store及历史截图/原始审计资料。未列入清单的本地资料保留，不删除；JSON列明全部历史资料排除路径。门禁摘要引用的完整截图仍保存在本地目录。

## 测量及政策范围

- 已批准GA4 `G-K0NGHRYPZ3` 与Adsterra公开完整嵌入，仅正式canonical源直接加载；预览不产生生产统计或广告请求。不重复安装标签、不点击广告。
- 部署后检查标签请求；GA4标签被检测到与Realtime收到数据分别记录。已有GA4 property/stream内部ID和GSC账号状态尚未核实。
- GSC拟复用域名property `sc-domain:war-of-genesis.wiki`、提交 `https://war-of-genesis.wiki/sitemap.xml`。本方案不批准创建Google property、修改Google设置、DNS验证、提交sitemap或请求索引；后续独立核对并确认。
- 隐私政策的30天日志/邮件期限已获确认；不把政策文案视为实际后台留存或自动删除设置完成。

## 风险与回滚

- Official commercial-use guidance classifies ad-supported sites as commercial and limits Hobby to non-commercial use; user explicitly requested remaining on Hobby after disclosure. No paid upgrade is authorized.
- Project-level Next.js settings also affect future builds from other branches; avoid deploying Astro main under Next.js settings. Original live deployment stays current until the verified production promotion.
- Preview promotion creates a new production build: require successful build, same commit and live HTTP recheck before claiming success.
- GA4 Realtime/Adsterra real delivery and GSC ownership/indexing not proven by deployment.
- 30-day log/email retention is confirmed site policy; external provider/email deletion settings are not configured or independently verified.
- Historical research dates and unverified Discord join/X destination remain disclosed notes.

- Existing production deployment dpl_8BYpy1D2Cfe81z3sAvRuRaErWjJK at https://game-warofgenesis-d3r4fwhij-randyzers-projects.vercel.app must remain available.
- If post-switch checks fail, point production traffic back to the saved old production deployment using vercel promote <old-production-id> --scope randyzers-projects --yes; verify apex/www.
- Restore Production Branch Tracking to main and project settings to Astro / Node22.x / npm run build / output dist / install auto / root repo. Do not revert or rewrite Git history, delete DNS or overwrite original main checkout.

## 待确认的具体范围

确认本文件68项提交清单、提交信息及已有2个未推送提交；仅推送指定GitHub重构分支并触发Preview；允许复用Vercel项目改Next构建设置，在预览通过后切换生产分支并提升至正式域名；继续已有Hobby；允许同次执行必要的暂时代理Git命令。无需DNS变更，不升级套餐，不改Google账号。

依据已调用的Skill：“Never commit, push, or deploy before the user confirms the concrete plan.” 在确认上述具体范围前不提交、推送或部署。

## 官方依据（本轮已核实）

- https://vercel.com/docs/git#customizing-the-production-branch
- https://vercel.com/docs/cli/promote
- https://vercel.com/docs/plans/hobby
- https://vercel.com/docs/plans/pro-plan
- https://vercel.com/docs/limits/fair-use-guidelines

用户已明确回复“确认，按方案部署”；批准点详见JSON。
