# War of Genesis 内容整合报告

## 输入解析

- 游戏：War of Genesis: Idle Loot，Steam App 4891320。
- 目标：`/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis`。
- 调研根目录：现有 `background_information/`。
- 首页：`background_information/WarofGenesis首页调研信息.md`，2026-10-09 快照。
- 图标：`background_information/WarofGenesis图标.zip`，7 个预期成员，ZIP 完整性及路径校验通过。
- 关键词及素材：`background_information/keyword-materials/keywords.json`，61 个最终词，各有唯一素材。
- 模板记录：`docs/TEMPLATE_SELECTION_REPORT.md`、`docs/template-copy-manifest.json`，导入目标与当前目录一致。
- 首次预检因首页文件名没有“攻略站”未自动匹配；在唯一候选确认后使用 `--homepage-research` 显式指定，预检通过。没有重命名原始资料。

## Git 基线和工作范围

- 分支：`codex/template-rebuild`；基线提交 `ae6ac45`，开始时工作树干净。
- 只修改重构 worktree；原始 main 目录、268 份调研文件及模板源库保持原样。
- 沿用 temp5；未重新选模板、导入补充模块、进行事实调研或部署。
- 本轮改动保留为可审阅的未提交改动。模板导入记录继续保存原始复制时的哈希；后续整合改变的文件由本报告记录。

## 模板与内容模型

Next.js 16.3.7 App Router，React 19.3.0，现有 MDX 静态导入注册表 `lib/articles.ts`。

- `/guides/` 沿用模板的概览文章入口。
- `/guides/[slug]` 仅注册 9 个已发布独立页面；沿用模板的注册表查找与 `notFound()` 排除其他 slug。
- 类别字段改为实际关键词分类，保留元数据、日期、slug、章节和 FAQ 校验。
- 关联内容使用有界手动关系，每页 3 项已发布内容。
- 模板没有安全的公开草稿系统：草稿只保留 manifest、内容框架及缺失证据，没有 MDX 文件和公开路由。
- 没有 test 脚本、viewport 测试或独立 category 路由；未新增依赖或另建路由/内容系统。

## 首页字段映射

| 调研字段 | 现有落点 | 实施范围 |
| --- | --- | --- |
| 游戏身份、Hero、主 CTA | `app/page.tsx` hero；`lib/site-data.ts` | 独立粉丝站、桌面玩法、入门与职业入口 |
| 基础资料与开发商 | stats、overview、quickFacts | 发行日期、三职业、Windows；免费标签带快照日期 |
| Start Here | featured-guides、quick-start | 已发布入门、职业、Profile、内购与市场；未承诺未核实配装/刷取路线 |
| 分类与浏览 | categoryCards、browseLinks、header/footer | 仅显示有已发布内容的 5 类及 10 个内页入口 |
| 官方更新 | 既有 update-grid | 带公告日期的历史精选，明确不是实时更新源 |
| 阅读推荐 | 既有 popular-list | 改为编辑建议阅读，不宣称热门、趋势或访问排名 |
| Codes | overview 文本卡片和首页 FAQ | 2026-10-09 未确认 Steam 版公开兑换码，不使用 Idle Heroes 礼包码 |
| FAQ、Final CTA | 既有 FAQ 和末尾 CTA | 仅有证据的问答；进入入门页或官方 Steam 页 |
| 主题色 | `app/globals.css` 中央变量 | 深蓝灰、金色、铜橙 HSL；未添加主题切换器 |
| 官方入口 | overview、footer、正文链接 | Steam、公告、市场、Discord 邀请、X、官方游戏客服 |

调研建议的韩语、日语、葡语仍为路线图；本轮仅有英语页面。未验证官方 YouTube 频道，未添加“官方视频”标签或使用视频元数据作为机制证据。

## 身份、图标及媒体

- Header、Footer、404、页面 TDH、Open Graph 文本、webmanifest 改为目标游戏身份。
- 图标 ZIP 的预期成员安装到 `public/`；metadata 使用真实存在的图标及 manifest 路径。
- 图标仅称独立攻略站图标，不称官方 Logo；首页显示原比例图标和文字。
- 删除假游戏 `app/icon.svg`、3 份 SVG 示意图及 5 篇旧 MDX；覆盖两篇旧 MDX，新增 8 篇目标游戏 MDX。
- 文章不再显示假游戏封面。元数据 cover 保留存在的站点图标路径，以兼容既有模型。
- 未添加未经授权截图、下载媒体或虚构法律/联系内容。

## 内页处理结果

| 状态 | 数量 | 处理 |
| --- | ---: | --- |
| PUBLISHED | 10 | 足以独立回答有界意图的已核实资料；含 1 个 `/guides/` 概览、9 个独立 slug |
| DRAFT | 45 | 素材不足、版本/数值未复核或核心意图未完整回答；只存内部框架和缺口 |
| BLOCKED | 6 | 上游阻断继续保留；不创建公开文件或路由 |
| 合计 | 61 | 每个最终关键词唯一记录 |

所有 10 个发布页的标题都含精确最终词，长度为 49–57 字符；描述为 143–152 字符。文章长度按证据密度保持约 300–600 词，未为达到 800 词而重复或填充。首页文案也只承诺当前有材料支持的范围。

`PARTIAL` 仅按独立有用的核实范围提升；上游状态未改写。职业角色意见明确归于 September Early Access；不发布统一当前排名。市场到账采用较新的 September 17 Inventory 说明；一周限制只适用于记录中的 Special Jewel of Strife。玩家数是带准确时间的历史快照，不是当前值或增长判断。未发布金条估计掉率、最优构筑、客户端关闭后的奖励、未验证移动端/置顶设置或开发商市场收入。

详细来源及冲突处理见 `CONTENT_PROVENANCE.md`；每词的框架、缺口与安全下一步见 `CONTENT_GAPS.md`。

## 模板残留检查

- 公开源文件、内容和构建页面检查目标：Emberdeep、Northlamp、旧示意图、旧攻略路径、假统计和热门文案。
- 检查发现移动菜单底部残留旧 `how-to-play` 路径；已改为已发布的 `getting-started`，修复后重测。
- 原始模板名称可保留在选择/导入/来源报告中。根 `package.json` 的包标识 `emberdeep-codex` 属于不公开的代码标识，按技能保留标识规则未做替换。
- 不把通用 `field` 标识符、ARIA `controls` 或单词 `unresolved` 误判为游戏实体。

## 命令及验证

使用 Node 22.16.0，满足声明的 `^22.13.0 || >=24.0.0`，pnpm 12.6.0。

pnpm 初始入口是 10.14.0 启动器，其自动管理尝试直接执行缓存的 12.6.0 无 shebang 文本入口，在 macOS 返回 ENOEXEC / error -8。通过 `sh` 执行同一 12.6.0 入口修复启动；没有更换包管理器、升级或重装工具。依赖安装获用户确认后执行，457 包从缓存复用，下载 0 包，锁文件保持原样。

```bash
python3 /Users/randyz/.codex/skills/game-site-content-integrator/scripts/preflight.py --game "War of Genesis" --workspace "/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis" --homepage-research "/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis/background_information/WarofGenesis首页调研信息.md"
sh /Users/randyz/Library/pnpm/.tools/pnpm/12.6.0/bin/pnpm install --frozen-lockfile
sh /Users/randyz/Library/pnpm/.tools/pnpm/12.6.0/bin/pnpm typecheck
sh /Users/randyz/Library/pnpm/.tools/pnpm/12.6.0/bin/pnpm lint
NEXT_TELEMETRY_DISABLED=1 sh /Users/randyz/Library/pnpm/.tools/pnpm/12.6.0/bin/pnpm build
python3 /Users/randyz/.codex/skills/game-site-content-integrator/scripts/validate_integration.py --game "War of Genesis" --workspace "/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis" --demo-term "Emberdeep" --demo-term "Northlamp"
```

| 检查 | 结果 |
| --- | --- |
| 输入预检 | PASS |
| 类型检查 | PASS（修复移动菜单后重跑） |
| lint | PASS（修复移动菜单后重跑） |
| test | NOT CONFIGURED |
| 生产构建 | PASS；移动菜单修复后重测通过，11 个公开页面（首页＋10 内页） |
| 技能整合验证 | PASS，61 词计数/覆盖一致，0 errors、0 warnings |
| 内部链接、TOC、metadata 和资源路径 | PASS，76 处源文件中的字面链接引用；所有发布页的章节、标题与描述校验通过 |
| 构建路由与本地 HTTP 检查 | PASS，11 页 HTTP 200，538 处渲染后的内部链接、15 项资源；51 个未发布候选路径与 6 个旧/未知路径均为 HTTP 404 |
| 移动端/视觉交互 | 本模板未配置视口测试；本轮不声称已完成 UI/UX 验收 |
| 外部入口当前可用性 | 本轮未联网重查；使用原调研中的已核实入口 |
| 调研、模板、原始目录完整性 | PASS，最终哈希校验通过；268 调研文件、38 模板源文件不变，原始 main 目录及锁文件不变 |

生产预览使用项目的 `start` 脚本，实际地址 `http://127.0.0.1:3217`；检查结束关闭临时服务，没有保留后台预览。HTTP 检查只访问本地站点，没有重查外部游戏事实。生成静态参数与生产输出都只包含 PUBLISHED 项；未注册 slug 通过 `notFound()` 返回 404。

首次 404 探测时，新增的 `dynamicParams = false` 在 Next.js 16.3.7 中为未注册 slug 记录 `NoFallbackError`，虽然响应为 404。移除该新增标志，保留模板已有的注册表白名单与 `notFound()`；修复后重新构建、进行完整 HTTP 探测，并检查服务日志。

最终重测仍为 11 页 200、57 个探测路径 404；服务日志 `NoFallbackError` 和 `Error:` 均为 0。类型检查、lint、构建与整合验证也在该修复后通过。最后关闭预览导致命令正常中断退出，不计为构建或页面错误。

计算主题变量对 elevated surface 的对比度：正文 12.49:1、muted 文本 7.13:1、焦点/品牌色 7.37:1。此计算仅覆盖这几组变量，不替代浏览器逐元素或移动端视觉验收。

额外本地验证检查图标资源、webmanifest 成员路径、精确关键词、单 H1、TOC 锚点、旧模板残留、MDX 文件集合与发布清单一致；`git diff --check` 通过。一次临时 metadata 解析器因用分号切割 JSON 字符串而失败，已改为 JSON decoder 解析并重跑通过；这是验证脚本问题，项目构建没有因此失败。

## 文件改动

- `.gitignore`：新增 Next.js 输出忽略规则。
- `next-env.d.ts`：Next.js 生产构建自动将类型引用从 `.next/dev/types/` 更新到 `.next/types/`；不是手写更改。
- `app/page.tsx`、`app/layout.tsx`、`app/globals.css`、`app/not-found.tsx`、`app/guides/page.tsx`、`app/guides/[slug]/page.tsx`。
- `components/site-header.tsx`、`components/site-footer.tsx`、`components/mobile-menu.tsx`、`components/article-shell.tsx`、`components/faq-list.tsx`。
- `lib/site-data.ts`、`lib/articles.ts`。
- `content/guides/`：10 篇目标游戏 MDX，旧假游戏文章移除。
- `public/`：7 个图标包成员，webmanifest 适配；移除 3 个演示 SVG；移除 `app/icon.svg`。
- `docs/CONTENT_INTEGRATION_REPORT.md`、`docs/CONTENT_PAGE_MANIFEST.json`、`docs/CONTENT_PROVENANCE.md`、`docs/CONTENT_GAPS.md`。

## 剩余阻断与最终状态

内容整合阶段状态：**PARTIAL**。61 词已全部得到明确处理，但 45 项草稿、6 项阻断仍不能公开；不是所有目标内容均已具备证据。

域名/canonical/sitemap、运营者/联系方式/法律政策、正式媒体和完整多语言材料仍未齐全。构建通过不代表可以上线；本报告不做上线结论、不部署。下一步建议人工审阅页面和状态，再确认是否执行独立 UI/UX 审计。
