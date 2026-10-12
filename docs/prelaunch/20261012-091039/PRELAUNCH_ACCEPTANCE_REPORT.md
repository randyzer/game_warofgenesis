# War of Genesis — 政策确认与上线前验收更新

**结论：可以上线（本地上线前验收范围）。** 当前开放P0=0、P1=0、P2=0。PL-004人工确认项已解除；本轮未部署，未改外部账户。

目标 `/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis`；分支 `codex/template-rebuild`；正式域名 https://war-of-genesis.wiki。本轮 `20261012-091039`，audit-and-repair，仅批准政策及其记录的最小修改。Next.js16.3.7/Node22.16.0/pnpm12.6.0；生产预览 http://127.0.0.1:3217 已关闭。

## 覆盖与限制

- 本轮14页HTTP/SEO复测；仅受影响的3政策页新增12组浏览器截图，11内容页完整浏览器/交互/脚本隔离证据沿用上轮，对应源码未改变。
- 用户批准的30天期限为本站运营规则；未配置或核验Vercel/Cloudflare及邮箱实际留存/删除执行，记NOTE，不承诺已经自动删除。
- 没有部署、真实GA4入流、Adsterra投放、增强型衡量后台确认、GSC或线上CWV；这些属于后续部署与测量核验。
- 未重新游戏调研；相同MDX的内容事实及外链证据沿用。Discord入服/X目的页访问限制保持NOTE。
- 基本布局/键盘/命名/图片检查不等同于完整WCAG或法律合规认证。

## 路由与TDH/关键词

框架、内容/政策manifest、构建、sitemap及内部链接清单一致，共14公开页。51未发布关键词无公开路线；候选路径均404。旧站farming/gear无对应新页不算新站缺陷，仅返回已批准410。

| 页面 | Title | Description | H1 | 目标词 | 正文词数 | 命中/密度 | 浏览器证据 |
|---|---|---|---|---|---:|---|---|
| / | War of Genesis: Idle Loot Wiki — Classes & Market | Explore War of Genesis: Idle Loot with verified Steam-game references for classes, profile settings, G-Coins, official communities, and market trading. | War of Genesis:Idle Loot | 未配置 | 1102 | None/NA | 20261012-080455 |
| /guides/getting-started/ | War of Genesis: Idle Loot guide — Getting Started | Use this War of Genesis: Idle Loot guide to understand automatic battles, Blacksmith menus, class choices, and the limits of Early Access advice. | War of Genesis: Idle Loot guide — Getting Started | War of Genesis: Idle Loot guide | 832 | 4/0.0048 | 20261012-080455 |
| /guides/ | War of Genesis: Idle Loot overview — Steam & Gameplay | Read this War of Genesis: Idle Loot overview for the Steam game’s identity, release dates, Windows platform, automatic battles, and trading features. | War of Genesis: Idle Loot overview — Steam & Gameplay | War of Genesis: Idle Loot overview | 668 | 4/0.0060 | 20261012-080455 |
| /guides/vs-path-of-idle/ | War of Genesis: Idle Loot vs Path of Idle Old Gods Rising | Compare War of Genesis: Idle Loot vs Path of Idle Old Gods Rising using official descriptions of desktop play, trading, classes, and town building. | War of Genesis: Idle Loot vs Path of Idle Old Gods Rising | War of Genesis: Idle Loot vs Path of Idle Old Gods Rising | 647 | 4/0.0062 | 20261012-080455 |
| /guides/classes/ | War of Genesis: Idle Loot classes — Names & Roles | Understand War of Genesis: Idle Loot classes: Knight, Ranger, and Wizard, with official names, Early Access role descriptions, and ranking limits. | War of Genesis: Idle Loot classes — Names & Roles | War of Genesis: Idle Loot classes | 684 | 4/0.0058 | 20261012-080455 |
| /guides/player-count/ | War of Genesis: Idle Loot player count — Dated Snapshot | Read the War of Genesis: Idle Loot player count snapshot from October 10, 2026, and distinguish concurrent players, group chat, and the EA peak. | War of Genesis: Idle Loot player count — Dated Snapshot | War of Genesis: Idle Loot player count | 546 | 4/0.0073 | 20261012-080455 |
| /guides/discord/ | War of Genesis: Idle Loot discord — Official Invite | Find the War of Genesis: Idle Loot discord invite cited in official Steam announcements, and distinguish that server link from Discord’s game directory. | War of Genesis: Idle Loot discord — Official Invite | War of Genesis: Idle Loot discord | 566 | 4/0.0071 | 20261012-080455 |
| /guides/profile/ | War of Genesis: Idle Loot profile — User Code & Frames | Use the War of Genesis: Idle Loot profile icon to find your User Code, then read the October 7 update’s explanation of character images and frames. | War of Genesis: Idle Loot profile — User Code & Frames | War of Genesis: Idle Loot profile | 561 | 4/0.0071 | 20261012-080455 |
| /guides/in-app-purchases/ | War of Genesis: Idle Loot in-app purchases — G-Coins | Understand War of Genesis: Idle Loot in-app purchases, the G-Coins Shop entry introduced October 7, and the official Steam Overlay payment FAQ. | War of Genesis: Idle Loot in-app purchases — G-Coins | War of Genesis: Idle Loot in-app purchases | 639 | 4/0.0063 | 20261012-080455 |
| /guides/market/ | War of Genesis: Idle Loot market — Steam Trading Basics | Explore the War of Genesis: Idle Loot market through official Steam links, with eligible-item scope, Steam Wallet funds, and item-specific trade limits. | War of Genesis: Idle Loot market — Steam Trading Basics | War of Genesis: Idle Loot market | 625 | 6/0.0096 | 20261012-080455 |
| /guides/market-buying/ | War of Genesis: Idle Loot market buying — Item Delivery | Understand War of Genesis: Idle Loot market buying: the official Inventory delivery change, order matching, and the limits recorded for one jewel. | War of Genesis: Idle Loot market buying — Item Delivery | War of Genesis: Idle Loot market buying | 629 | 4/0.0064 | 20261012-080455 |
| /privacy/ | Privacy Policy | Privacy information for War of Genesis: Idle Loot Wiki, including analytics, advertising, hosting, browser storage, and contacting the site operator. | Privacy Policy | 未配置 | 371 | None/NA | 20261012-091039 |
| /cookies/ | Cookie Policy | Learn about browser storage, Google Analytics 4, Adsterra advertising, and the browser controls relevant to War of Genesis: Idle Loot Wiki. | Cookie Policy | 未配置 | 238 | None/NA | 20261012-091039 |
| /terms/ | Terms of Use | Read the use information for War of Genesis: Idle Loot Wiki, including independent fan-site status, dated references, third-party links, and contact. | Terms of Use | 未配置 | 206 | None/NA | 20261012-091039 |

正文计数方法见JSON；密度仅用于异常检测，没有目标百分比。3政策页不施加游戏关键词；首页目标词未独立配置仍为NOTE。

## 问题状态

| ID | 优先级 | 页面 | 状态 | 证据 |
|---|---|---|---|---|
| PL-001 | P1 | 全部14公开页 | FIXED | 本轮14/14 canonical唯一且正式origin/最终路径对应；根origin与origin/语义等同。 |
| PL-002 | P1 | /robots.txt | FIXED | 200 text/plain，Allow: /，Sitemap指向正式域名/sitemap.xml。 |
| PL-003 | P1 | /sitemap.xml | FIXED | 本轮200 XML、14唯一正式域名loc，全部映射预览200；排除51未发布项目和410/错误工具路径。 |
| PL-004 | P1 | 站点运营政策确认 | FIXED | 2026-10-12用户明确确认Vercel/Cloudflare请求日志及联系邮件30天留存规则，批准政策文案；隐私文案/政策日期更新，构建及12组布局通过。原人工确认项已关闭；实际账户执行单列NOTE。 |
| PL-005 | NOTE | 旧站6条已验证可访问URL | ACCEPTED_WITH_REASON | 用户明确新站按新内容规划验收，旧路径无对应新页不算缺陷或阻断。另已验证2条语义308和2条410，不要求恢复旧页。 |
| PL-006 | P2 | /guides/getting-started/（同类文章） | FIXED | 10资料页手机目录可见，DOM在正文之前；实际Tab焦点可见、点击/Enter跳转标题无遮挡。 |
| PL-007 | P2 | 全部14公开页 | FIXED | 本轮14/14 OG标题、描述、URL匹配当前页面，使用既有已批准独立粉丝站图标。 |
| PL-008 | NOTE | 全部公开页 | FIXED | 上轮38组完整浏览器覆盖通过；本轮受影响3政策页12组重新通过，其他内容页源码不变。 |
| PL-009 | NOTE | / | OPEN | 重构站没有明确primaryKeyword/targetKeyword字段，首页目标词记为未配置；layout通用keywords数组不能代替唯一目标词配置。 |
| PL-010 | NOTE | Discord与X外链 | NEEDS_CONFIRMATION | Discord入口HTTP200后正文不可读，不能确认入服有效性；X导航16秒超时，没有证据证明目的页失效。其余7外链200且正文可读。 |
| PL-011 | NOTE | GA4与Adsterra | NEEDS_CONFIRMATION | 当前加载分支隔离测试通过，真实生产GA4入流/增强型衡量设置与Adsterra投放尚未验证。 |
| PL-012 | NOTE | 外部平台与联系邮箱 | NEEDS_CONFIRMATION | 30天规则已获用户确认，当前没有Vercel/Cloudflare日志留存或邮箱清理的实际配置证据。本轮未进入外部账户、未设置删除任务。页面如实披露设置未核验。 |

## 检查结果

| 检查 | 状态 | 证据/范围 |
|---|---|---|
| typecheck | PASS | 本轮按现有锁文件/依赖运行对应脚本，退出0；没有安装或升级依赖。 |
| lint | PASS | 本轮按现有锁文件/依赖运行对应脚本，退出0；没有安装或升级依赖。 |
| production-build | PASS | 本轮按现有锁文件/依赖运行对应脚本，退出0；没有安装或升级依赖。 |
| test | NOT CONFIGURED | package.json无test脚本；未安装测试工具、未修改依赖。 |
| published-route-inventory | PASS | 11内容页和3政策页共14；三条政策页独立记录，61关键词计数不变。 |
| draft-and-blocked-exposure | PASS | 51草稿/阻断项目不在sitemap，route/source_file均null，候选404本轮复测。 |
| internal-links-fragments | PASS | 14页内部链接/锚点扫描无失效；19项导航操作记录及独立真实Tab/Enter手机目录复测通过。 |
| external-links | BLOCKED | 沿用20261010T153823Z外链证据（相同源码）：7条可读，Discord入口正文不可读、X超时；未降级或再次平台调研。 |
| tdh-keywords | PASS | 本轮14页TDH/元数据正常，3政策页正文词数按.prose-wiki当前DOM更新；10资料页关键词与正文统计沿用相同MDX。首页主词未配置属NOTE。 |
| content-truth-provenance | PASS | 首页+10资料页对照既有provenance、10份material与8份原始网页记录；未发现已确认事实矛盾。PASS仅针对已发表的限定范围。 相关原检查沿用；本轮公开源码残留扫描无命中，事实文件未改。 |
| canonical | PASS | 本轮14页唯一canonical且匹配正式域名和最终路径。 |
| robots | PASS | 本轮200 text/plain，Allow: /，正式域名sitemap指令。 |
| sitemap | PASS | 本轮14唯一新域名loc：11内容页+3政策页，映射预览均200，51未发布项目排除。 |
| language-public-noindex | PASS | 公开页lang=en，无noindex。404错误响应有noindex；来源模板/localhost未出现在公开SEO字段。 |
| structured-data | NOT CONFIGURED | 公开页没有JSON-LD；不凭此宣称严重SEO错误或已取得富媒体展示资格。 相关原检查沿用；本轮公开源码残留扫描无命中，事实文件未改。 |
| open-graph | PASS | 本轮14页标题/描述/URL分别匹配，既有独立站图标作为分享图。 |
| desktop-layout | PASS | 3政策页1440px本轮复测；11内容页沿用相同源码的上轮完整桌面证据。 |
| mobile-390-and-key-360-768 | PASS | 3政策页360/390/768/1440共12组均无溢出；其余同源码内容页沿用上轮38组中的相应证据。 |
| accessibility | PASS | 本轮政策页H1/语言/链接按钮命名/图片检查通过，无广告或第三方脚本加载；未变导航真实Tab/Enter等证据沿用上轮，不宣称全面WCAG符合性。 |
| performance-local-resources | PASS | 本轮17本地资源200，所有38组无缺失图片；没有线上CWV或真实第三方性能结果。 |
| console-network-all-routes | PASS | 本轮政策页12组及菜单复测无网站自身错误；Chrome扩展资源错误单独记录。其他同源码路由沿用上轮。 |
| favicon | PASS | 根路径/favicon.ico返回200 image/x-icon，15406bytes；资产未改。 |
| template-residue | PASS | public源码扫描未见Emberdeep/Northlamp/bombfarm/gamesop/localhost/placeholder/TODO残留；拆除6模板候选路由全部404；package非公开标识与内部模板报告允许保留。 相关原检查沿用；本轮公开源码残留扫描无命中，事实文件未改。 |
| current-workspace-secrets | PASS | 本轮当前及tracked文本的敏感文件名/常见凭据扫描无命中；不打印秘密、不覆盖Git历史或云端环境。 |
| operator-policy-readiness | PASS | 用户明确批准当前政策文案，并将Vercel/Cloudflare请求日志及联系邮件保存规则设为30天；隐私页已更新且通过构建/12尺寸复测。后台实际执行未核验另列NOTE。 |
| old-site-url-migration | NOT APPLICABLE | 用户明确新站按新内容规划验收，旧路径无对应新页不算缺陷或阻断。另已验证2条语义308和2条410，不要求恢复旧页。 |
| GA4-code | PASS | 上轮SERVICES_ISOLATION_RETEST.json完成加载分支/政策无广告/预览不加载/SPA不重复检查；对应服务源码未改变，沿用。真实收数/广告投放未验证。 |
| Adsterra-code | PASS | 上轮SERVICES_ISOLATION_RETEST.json完成加载分支/政策无广告/预览不加载/SPA不重复检查；对应服务源码未改变，沿用。真实收数/广告投放未验证。 |
| production-measurement | NOT CONFIGURED | 本轮不部署，不改GA4后台或GSC；Realtime/广告实际投放及自动SPA增强型衡量待独立验证。 |

## 修复与确认

用户确认：Vercel/Cloudflare日志及联系邮件保存期限30天；文案确认。Privacy已写入运营者的30天规则，并说明平台/邮箱实际设置尚未核验；没有承诺已配置自动删除，不将30天扩展至GA4或Adsterra。三政策页Last updated改为October 12, 2026。四份政策/内容缺口记录同步确认状态。历史报告未覆盖。

typecheck、lint、生产build本轮退出0。14页HTTP/TDH/canonical/OG复测通过，robots200 Allow:/且正式Sitemap，sitemap200有14唯一正式origin loc，全部映射预览200，排除51未发布及410/错误路由；17资源200，16组重定向/410检查正常，根/favicon.ico200。内部链接/锚点无失效；当前凭据/模板残留扫描无命中（不覆盖历史/云配置）。

3政策页360/390/768/1440共12组无溢出、缺图、匿名链接/按钮；日期及隐私30天文字显示正确，政策无广告，本地不加载第三方服务。手机隐私截图已人工查看。未改变的内容、导航、脚本隔离行为沿用上轮38组完整覆盖和真实键盘证据。没有重做游戏事实调研或绕过Discord/X访问限制。

## 上线结论及下一步

**可以上线**指本地候选已经通过当前约定的上线前验收，原文案/期限人工确认P1已解除。不是已经上线、外部账户设置完成、真实测量成功或法律合规认证。

下一步独立核对Vercel/Cloudflare及邮箱如何落实30天规则，同时准备部署检查清单和确认实际生产分支。按照用户分步骤要求，在取得下一步确认前不部署、不push、不改外部账户。GA4增强型衡量/Realtime、广告实际投放、GSC及线上性能留待获准部署后的测量阶段。
