# War of Genesis: Idle Loot Template Selection Report

## Decision

- Game: **[WoG] War of Genesis: Idle Loot**，Steam app 4891320。
- Selected main template: **temp5_based_bombfarm.wiki**。
- Template source path: `/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki`。
- Destination path: `/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis`。
- Decision status: **SELECTED**（用户已确认 temp5；基座导入完成）。
- Research date: **2026-10-10，Asia/Taipei**。
- Copy status: **COPIED**。
- Source integrity: **VERIFIED UNCHANGED**（六个候选的全部可复制文件在评估前后逐文件 SHA-256 一致）。
- 执行范围：先评估六个完整基座并生成报告，用户确认后导入 temp5；补充模块尚未合并，未安装依赖、运行源模板、替换品牌或部署。
- 用户已明确接受目标目录原有 `.git`、`.gitignore`、`background_information/`；本次导入保留三项以及选型报告和原有 Finder `.DS_Store`。

## Game design brief

使用用户现有调研文件，没有在本轮重新联网访问资料中的 URL。游戏事实继承所列调研快照，设计判断明确标记为推断；不重复确认在线人数、评价比例、市场规模、掉率、收益或当前职业排名。

| Attribute           | Finding                                                                 | Evidence                                                                                                                                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 游戏身份                | Steam PC 游戏《War of Genesis: Idle Loot》；与同名旧手游区分                         | [overview 素材](</Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis/background_information/keyword-materials/War of Genesis- Idle Loot overview素材.md>)；记录官方商店访问日期 2026-10-10、Steam app 4891320                                           |
| Platform and genre  | Windows / Steam，桌面自动战斗与装备成长 RPG                                         | 同一 overview 素材的官方产品说明；官方 URL：[Steam Store](https://store.steampowered.com/app/4891320/WoG_War_of_Genesis_Idle_Loot/)                                                                                                                                  |
| Core player loop    | 自动战斗、装备刷取、角色成长、装备合成及符合条件的市场交易；官方资料还列世界 Boss、联盟和竞技内容                     | overview 素材；[首页调研](/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis/background_information/WarofGenesis首页调研信息.md)（2026-10-09 快照）                                                                                                     |
| Visual tone         | 现有视觉简报建议暗黑奇幻、深蓝灰/炭黑背景、金色与铜橙强调。以深色高可读攻略界面为适配方向，属于设计推断                    | 首页调研第 3 节；本轮依据源代码色彩及构图结构判断，未运行模板或重新截图，不宣称渲染后的视觉效果已验证                                                                                                                                                                                                  |
| Classes             | 调研对应的官方职业名称为 Knight、Ranger、Wizard；不输出当前强度排名                             | [classes 素材](</Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis/background_information/keyword-materials/War of Genesis- Idle Loot classes素材.md>)；其中官方公告访问日期 2026-10-10：[Steam News](https://steamcommunity.com/app/4891320/allnews/) |
| Main search intents | 现有关键词覆盖入门、职业/配装、技能、装备/合成、市场、平台与故障、工具、社区和安全                              | [keywords.json](/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis/background_information/keyword-materials/keywords.json)，9 类、61 个意图；这是用户关键词整理结果，不代表真实搜索量或市场需求                                                                        |
| Expected IA         | **推断**：首页引导新手，并提供职业/配装、技能、装备/合成、市场四类主要入口；故障解答、更新和工具作为次级入口；攻略列表与详情支持继续阅读 | 首页调研的四张入门卡片，以及关键词分类；不把所有关键词直接转为可发布页面                                                                                                                                                                                                                  |
| Article/media needs | **推断**：快速答案、目录、长文、版本说明、技能/装备比较表、操作步骤、截图说明、FAQ、相关攻略；市场文章需要条件和风险边界        | overview、classes、关键词素材汇总中的框架与待确认项                                                                                                                                                                                                                     |
| 内容可用性边界             | 55 项 PARTIAL、6 项 BLOCKED；字幕未取得，部分平台证据缺失，旧版数据与排名有冲突。发布前仍须逐条复核            | [关键词素材汇总](/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis/background_information/keyword-materials/关键词素材汇总.md)（2026-10-10）                                                                                                          |

关键词分类数量：Guide 6；Classes and Builds 8；Skills 7；Loot and Crafting 10；Steam Market 4；Platforms and Troubleshooting 8；Tools and Modifications 9；Communities 7；Security 2。以上只用于内容组织。未取得站内一手样本的社区项目，仍保留“站内数据未取得，不能下市场判断”的边界。

## Template scorecard

按照技能的 100 分标准评分。分数是对本项目的适配判断，不是运行性能、实测可用性或测试通过率。所有候选均通过本轮模板库结构健康检查；未在任何源模板中执行安装、构建、测试或 Git 命令。

| Rank | Template                              | IA /25 | Visual /20 | Content /20 | Article /15 | Discovery /10 | Safety /10 | Total /100 |
| ---: | ------------------------------------- | -----: | ---------: | ----------: | ----------: | ------------: | ---------: | ---------: |
|    1 | temp5_based_bombfarm.wiki             |     23 |         18 |          15 |          14 |             7 |          6 |     **83** |
|    2 | temp3_based_gamblewithyourfriends.net |     21 |         16 |          16 |          13 |             6 |          6 |     **78** |
|    3 | temp6_based_theskinstapler.com        |     20 |         12 |          16 |          10 |             9 |          8 |     **75** |
|    4 | temp4_based_miniwars.art              |     20 |         12 |          17 |           9 |             8 |          8 |     **74** |
|    5 | temp2_based_farevergame.wiki          |     18 |         18 |          15 |           8 |             6 |          5 |     **70** |
|    6 | temp1_based_vvultimatum.net           |     19 |         13 |          10 |          11 |             7 |          9 |     **69** |

前两名相差 5 分，按技能的接近分数规则先比较玩家意图及信息架构。temp5 的入门、分类入口、按问题浏览和完整文章壳更符合本项目，IA 为 23，temp3 为 21，因此选择 temp5。temp3 的内容发现方式更灵活，但不足以抵消完整站点入口和详情结构的差距。未触发排除最高分候选的硬约束。

## Evidence by template

下列文件路径均为本轮实际读取的源文件。共检查所有候选的首页、索引/详情路由、内容读取代码、代表性组件、样式变量、媒体清单、package scripts 和存在的测试/验证材料。测试文件被读取，不等同于本轮测试执行通过。

### temp1_based_vvultimatum.net

- Strengths for this game: Wiki 侧栏、当前路径提示、不可用状态、面包屑、MDX 正文和比较说明；路由与移动视口验证代码较完整。
- Mismatches: 当前内容限定 `Races`，只有一篇实体记录；索引与详情还包含该演示实体专用内容。大量首页入口不可用，需要扩展为职业、装备、技能及一般攻略，而非只替换标题。
- Evidence inspected: [首页](/Users/randyz/work/coding/hot_words_web/template/temp1_based_vvultimatum.net/app/page.tsx)、[索引](/Users/randyz/work/coding/hot_words_web/template/temp1_based_vvultimatum.net/app/races/page.tsx)、[详情](/Users/randyz/work/coding/hot_words_web/template/temp1_based_vvultimatum.net/app/races/\[slug]/page.tsx)、[内容读取](/Users/randyz/work/coding/hot_words_web/template/temp1_based_vvultimatum.net/lib/content.ts)、[侧栏](/Users/randyz/work/coding/hot_words_web/template/temp1_based_vvultimatum.net/components/wiki-sidebar.tsx)、[MDX 组件](/Users/randyz/work/coding/hot_words_web/template/temp1_based_vvultimatum.net/components/mdx-components.tsx)、[路由测试](/Users/randyz/work/coding/hot_words_web/template/temp1_based_vvultimatum.net/tests/routes.spec.ts)、[样式](/Users/randyz/work/coding/hot_words_web/template/temp1_based_vvultimatum.net/app/globals.css)。
- Score rationale:
  - IA **19/25**：侧栏与实体浏览有用，但当前路由只实现种族索引/详情，通用攻略路径不足。
  - Visual **13/20**：深色高密度档案结构可用；青绿色主强调和演示主题离战利品金色方向较远。
  - Content **10/20**：文件发现与日历日期校验存在，但 `category: "Races"` 是硬编码，且示例仅一篇。
  - Article **11/15**：面包屑、说明、正文、Callout 与优缺点组件存在；无通用目录或成熟的相关文章选择。
  - Discovery **7/10**：侧栏、移动入口和后续链接存在；不可用项目与单篇内容限制有效二次点击。
  - Safety **9/10**：元数据校验、不可用状态和 Playwright 路由/横向溢出/焦点测试代码齐备；本轮未重跑。

### temp2_based_farevergame.wiki

- Strengths for this game: 奇幻氛围、暗色与金色、职业式入口；MDX 文件自动发现，精选/最新内容来自元数据。
- Mismatches: 核心叙事偏探索、区域和世界观，许多卡片指向同一篇指南；详情壳较简单，不适合直接承载大量技能/合成/交易长文。
- Evidence inspected: [首页](/Users/randyz/work/coding/hot_words_web/template/temp2_based_farevergame.wiki/app/page.tsx)、[索引](/Users/randyz/work/coding/hot_words_web/template/temp2_based_farevergame.wiki/app/guide/page.tsx)、[详情](/Users/randyz/work/coding/hot_words_web/template/temp2_based_farevergame.wiki/app/guide/\[slug]/page.tsx)、[文章壳](/Users/randyz/work/coding/hot_words_web/template/temp2_based_farevergame.wiki/components/article-layout.tsx)、[内容读取](/Users/randyz/work/coding/hot_words_web/template/temp2_based_farevergame.wiki/lib/guides.ts)、[导航](/Users/randyz/work/coding/hot_words_web/template/temp2_based_farevergame.wiki/components/site-header.tsx)、[内容测试](/Users/randyz/work/coding/hot_words_web/template/temp2_based_farevergame.wiki/tests/guides.test.ts)、[样式](/Users/randyz/work/coding/hot_words_web/template/temp2_based_farevergame.wiki/app/globals.css)。
- Score rationale:
  - IA **18/25**：职业、入门、精选、更新入口存在；世界/区域叙事和重复落点需较多重排。
  - Visual **18/20**：暗紫、金色与奇幻层次接近目标氛围；实际游戏图像仍需后续替换与验证。
  - Content **15/20**：自动发现 MDX、日期/slug 校验、category、featured 支持；缺版本和证据状态字段。
  - Article **8/15**：标题、日期、正文、同分类优先推荐存在；缺目录、专用比较表、步骤和文章 FAQ 壳。
  - Discovery **6/10**：索引和同分类推荐可用；手机导航以链接列表为主，无搜索，首页不少重复链接。
  - Safety **5/10**：基本内容校验与导航测试存在；互动/视口验证范围有限。

### temp3_based_gamblewithyourfriends.net

- Strengths for this game: 面向具体问题的攻略组织；Quick Answer、步骤、规则提示、错误修正、表格、插图和 FAQ 组件适合攻略写作。
- Mismatches: 演示以霓虹赌场和多人协作为主题；详情没有目录，文章 cover 元数据未在 ArticleHero 中渲染；推荐按现有列表顺序取前三篇，缺相关度排序。详情使用根层 `app/[slug]`，后续须规划与其他根层路径的边界。
- Evidence inspected: [首页](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/app/page.tsx)、[指南索引](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/app/guide/page.tsx)、[详情](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/app/\[slug]/page.tsx)、[MDX 组件](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/components/mdx-components.tsx)、[插图](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/components/content-figure.tsx)、[文章标题](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/components/article-hero.tsx)、[内容读取](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/lib/content.ts)、[相关文章](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/components/related-guides.tsx)、[样式](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/app/globals.css)。
- Score rationale:
  - IA **21/25**：入门、问题解答和完整指南入口贴合任务需求；职业/装备/市场多分类首页入口较弱。
  - Visual **16/20**：已有深蓝黑底与金色；霓虹、绿色和赌场图形仍需替换，不能视作目标游戏视觉。
  - Content **16/20**：MDX 自动发现、分类、featured/draft 字段与正文组件丰富；缺版本与证据状态，日期只检查非空。
  - Article **13/15**：步骤、快速答案、FAQ、GFM 表格与带说明插图均有真实组件/渲染连接；缺目录与渲染封面。
  - Discovery **6/10**：索引、移动菜单与相关文章可用；无真正的搜索功能，所谓 Quick Search Answers 是静态问答。
  - Safety **6/10**：内容/MDX/移动菜单测试代码存在；移动菜单未实现 Escape 焦点恢复，列表过滤 draft 不等于详情发布门禁。

### temp4_based_miniwars.art

- Strengths for this game: 系统化攻略首页、标签排序相关文章、日期及标签校验、移动导航焦点恢复；测试覆盖内容模型与路由行为。
- Mismatches: 军事/战术指挥主题重，装甲资产、作战和指挥术语不能移植成游戏事实；详情工具少，缺文章目录、FAQ 与媒体组件。
- Evidence inspected: [首页模块](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/components/home-sections.tsx)、[索引](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/app/guides/page.tsx)、[详情](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/app/guides/\[slug]/page.tsx)、[文章壳](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/components/article-shell.tsx)、[内容读取](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/lib/guides.ts)、[相关文章算法](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/lib/guide-utils.ts)、[移动导航](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/components/mobile-nav.tsx)、[算法测试](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/tests/guide-utils.test.ts)、[样式](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/app/globals.css)。
- Score rationale:
  - IA **20/25**：系统、重点资产、入门和指南索引可映射技能/装备问题；战术作战首页不是闲置刷宝的最佳组织。
  - Visual **12/20**：信息密度有利比较；军用绿黑、橙色信号与等宽指挥面板需较多视觉适配。
  - Content **17/20**：通用分类与标签、真实日历日期校验、注册表和内容加载存在；扩展文章须维护注册表，缺证据状态。
  - Article **9/15**：分类/日期/阅读时长/标签、正文和相关文章完整；缺目录、文章 FAQ 与专用图表工具。
  - Discovery **8/10**：标签相关度优先、日期打破并列，索引跳转和移动导航完整；无搜索。
  - Safety **8/10**：路由、标签算法、加载、移动 Escape/焦点测试代码与严格元数据校验存在；本轮未重跑。

### temp5_based_bombfarm.wiki — Selected

- Strengths for this game: 首页兼顾入门、系统分类、攻略、编辑更新、常用入口、步骤、按问题浏览和 FAQ；详情已有封面、面包屑、目录、FAQ、继续阅读；暗金与铜橙的源代码配色与现有简报接近。
- Mismatches: 无测试套件；`ArticleMetadata.category` 及校验固定为 `Guides`；MDX 手动导入注册；目前 `/guides/` 是概览文章，不是可筛选列表。首页直接遍历全部 `guideArticles`，不能把 61 个意图原样加入而不调整展示数量。需要发布状态/证据/版本字段及更好的发现功能。
- Evidence inspected: [首页](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/app/page.tsx)、[指南入口](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/app/guides/page.tsx)、[详情路由](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/app/guides/\[slug]/page.tsx)、[文章壳](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/components/article-shell.tsx)、[目录](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/components/table-of-contents.tsx)、[FAQ](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/components/faq-list.tsx)、[内容模型](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/lib/articles.ts)、[首页数据](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/lib/site-data.ts)、[手机菜单](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/components/mobile-menu.tsx)、[MDX 映射](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/mdx-components.tsx)、[样式](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/app/globals.css)、[package.json](/Users/randyz/work/coding/hot_words_web/template/temp5_based_bombfarm.wiki/package.json)。
- Score rationale:
  - IA **23/25**：入门、系统分类、按问题浏览、常用入口及完整详情的组合最符合四条核心玩家任务；真正分类索引需后续扩展。
  - Visual **18/20**：`#0c0a08` 暗底、`#ffc53d` 金色、`#ff6b2c` 铜橙，以及可放真实封面的结构接近简报；不把演示插画当作游戏证据。
  - Content **15/20**：MDX 正文、封面/alt、日期、sections、faqs 和重复 slug 校验都已实现；单分类、手动注册以及缺版本/证据状态降低分数。
  - Article **14/15**：封面与替代文字、面包屑、日期、目录、FAQ、相关文章真实渲染；缺快速答案和键盘可滚动表格组件。目录依赖手工 sections，仍须验证锚点与正文一致。
  - Discovery **7/10**：桌面菜单、手机分组导航、分类卡和相关文章有实际链接；无搜索，相关内容只是按日期列表排除当前项。
  - Safety **6/10**：严格元数据/日期/安全 slug/目录 ID/封面路径校验和 Escape 焦点恢复存在；没有 test script 或测试文件，不能宣称已通过自动化验证。


### temp6_based_theskinstapler.com

- Strengths for this game: 可扩展 MDX 发现、35 篇演示文章、搜索对话框、快捷键和焦点恢复、可键盘滚动的表格；有路由与视口验证脚本及历史验证记录。
- Mismatches: 叙事重点是恐怖调查、角色与剧情，紫色主题不符合现有金色战利品简报；相关文章固定选几个故事 slug；详情没有目录或专用文章 FAQ。`status` 被搜索过滤不等于完整发布状态门禁。
- Evidence inspected: [首页](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/app/page.tsx)、[索引](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/app/guides/page.tsx)、[详情](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/app/guides/\[slug]/page.tsx)、[内容读取](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/lib/guides.ts)、[搜索与导航](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/components/site-header.tsx)、[表格](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/mdx-components.tsx)、[路由验证](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/scripts/verify-routes.mjs)、[视口验证](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/scripts/verify-viewports.mjs)、[历史验证记录](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/docs/verification.md)、[样式](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/app/globals.css)。
- Score rationale:
  - IA **20/25**：大索引和搜索有利多篇问题解答；首页的案件/剧情入口、详情固定关联仍需重组。
  - Visual **12/20**：深色清晰的编辑界面可用；恐怖/调查叙事、紫色和大面积故事背景与目标基调距离较大。
  - Content **16/20**：文件发现、category、顺序和状态元数据提供扩展空间；缺版本/来源状态，日期与 order 验证不完整覆盖所有边界。
  - Article **10/15**：面包屑、可选图、MDX、键盘表格和后续入口存在；缺目录、步骤与文章 FAQ 壳。
  - Discovery **9/10**：实际搜索过滤、无结果状态、快捷键和手机导航存在；相关文章仍固定 slug，搜索只覆盖标题/摘要/分类。
  - Safety **8/10**：校验与路线/视口脚本及 2026-10-09 历史记录存在；记录明确源产物已清理，本轮未重跑，且视口脚本依赖本地 CDP Proxy/macOS。

## Why the selected template wins

1. **完整站点路径更贴合攻略站。** 首页能够承接“先入门 → 找职业/装备/市场主题 → 读攻略 → 继续阅读”，而不是只展示世界观或单一实体档案。
2. **长文详情所需的主要结构已存在。** 封面、面包屑、日期、目录、FAQ、相关文章均实际接入渲染，适合职业解释、合成指南与市场规则文章。
3. **有复用现有首页简报的位置。** 入门卡、分类入口、概览、编辑更新和 FAQ 可承接资料；这只是结构适配，具体内容必须后续替换。
4. **源代码视觉方向较接近。** 暗金/铜橙比军用绿色、调查紫色或青绿色更贴近本次简报；真实游戏图片、字号及移动阅读效果仍需在复制后的项目验证。
5. **允许一个完整基座加少量补充。** 主要差距可以围绕内容模型、搜索、步骤和表格逐项补齐，无需把第二个模板当作另一套完整站点合并。

主要妥协：这是**推荐的结构基座，不是现成可发布的 War of Genesis 攻略站**。必须扩展 category/注册与索引，加入内容证据状态和版本字段，限制首页/导航展示数量，补测试及搜索，并替换全部演示身份和内容。源模板的 Popular、Latest、统计及插画不能作为真实流量、实时数据或本游戏素材。文章卡当前为文字卡，没有渲染文章封面缩略图。

## Supplemental module recommendations

仅建议以下四项，**本轮均未复制或实现**。不建议再合并第二套完整首页、Header 或文章壳。

| Priority | Module             | Source template and file                                                                                                                                                                                                                                 | Player value                        | Dependencies                                                               | Conflict/risk                                                                   | Effort |
| -------: | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------ |
|        1 | Quick Answer 与操作步骤 | temp3：[MDX 组件](/Users/randyz/work/coding/hot_words_web/template/temp3_based_gamblewithyourfriends.net/components/mdx-components.tsx) 中 QuickAnswer、StepGrid、Step                                                                                         | 先给出有依据的结论，再列合成/设置/交易操作步骤，减少读完整长文的成本 | React；为 temp5 的根 `mdx-components.tsx` 注册相应组件；内容作者必须提供已核验答案与步骤；只提取所需组件      | 搬移局部样式并改用 temp5 tokens；不能复制整套组件映射或赌场文案；避免新增重复 H2 与目录遗漏                          | Medium |
|        2 | 标签相关度推荐            | temp4：[guide-utils.ts](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/lib/guide-utils.ts) 的 selectRelatedGuides；参考其 [测试](/Users/randyz/work/coding/hot_words_web/template/temp4_based_miniwars.art/tests/guide-utils.test.ts) | 从职业页到相同职业技能/装备，再到关联机制文章，改善二次点击      | 将 ArticleRecord 映射为 slug/tags/publishedAt；补通用 taxonomy 与受控 tags；排除当前项和未发布项 | 主基座目前没有 tags，须先扩展与校验；跨类型迁移不能直接粘贴调用；需在新项目验证去重、排序和发布状态                            | Medium |
|        3 | 搜索对话框及快捷键          | temp6：[site-header.tsx](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/components/site-header.tsx) 的搜索状态、dialog、过滤与关闭逻辑                                                                                                 | 在较多技能、装备和故障文章中按标题/摘要/分类找答案          | React client component；从主模板提供已发布文章摘要列表；保留焦点、Esc、快捷键、无结果状态和滚动恢复             | 只提取搜索，不复制整套 Header；需移植局部 CSS、处理 body 滚动和弹层层级；素材的 PARTIAL/BLOCKED 不能直接等同于可搜索发布状态 | Medium |
|        4 | 键盘可滚动文章表格          | temp6：[mdx-components.tsx](/Users/randyz/work/coding/hot_words_web/template/temp6_based_theskinstapler.com/mdx-components.tsx) 的 ArticleTable                                                                                                            | 在窄屏及键盘操作下阅读职业/技能/装备比较表              | React、MDX 映射与 table-scroll 样式；Markdown 表格另需评估 GFM 插件，或显式 MDX 表格；保持表头语义     | temp5 没有该包装器；需迁移局部样式并补可访问名称/焦点及横向滚动检查；不会因此证明表内概率或配装结论有效                         | Low    |

## Copy record

- Copy status: **COPIED**，用户已确认采用 temp5 并授权导入。
- Actual destination: `/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis`，Git 分支 `codex/template-rebuild`。
- Eligible source files copied: **38**。
- Aggregate selected-source hash before/after: `c310c18b2ac0c895e4f254d3e75cc8dea865ef1db2d08a0588fff950f0d15de8`。
- Aggregate destination hash: `c310c18b2ac0c895e4f254d3e75cc8dea865ef1db2d08a0588fff950f0d15de8`（仅覆盖 38 个模板文件）。
- Excluded paths/patterns: `.git/`、`.next/`、`node_modules/`、`.turbo/`、`coverage/`、`__pycache__/`、`.DS_Store`、`*.tsbuildinfo`、`.env`、`.env.*`。
- Manifest: [template-copy-manifest.json](/Users/randyz/.codex/worktrees/template-rebuild/game_warofgenesis/docs/template-copy-manifest.json)。清单记录全部相对路径与 SHA-256、实际目标、暂存路径和复制时间。
- Source before/after match: **VERIFIED UNCHANGED**；所选源模板的可复制文件清单与哈希均未变。
- Destination file verification: **38/38 文件哈希一致**；`.git`、`.gitignore`、268 个调研文件与原有 Finder `.DS_Store` 保持不变。
- Import method: 原技能脚本先对外部空暂存目录执行 dry-run，再复制并校验；检查 worktree 冲突后逐文件使用排他创建导入，没有覆盖原有文件。
- Source `.gitignore`: **不存在**，无需合并；目标现有 `.gitignore` 原样保留。后续环境验证前应单独补充 `.next/`、`*.tsbuildinfo` 等 Next.js 产物忽略规则。
- 本次更新了选型报告，并新增机器可读清单；它们是来源记录，不计入模板文件哈希。
- Aggregate hash algorithm: 按相对路径排序，对每条 `path + NUL + file_sha256 + LF` 连续输入 SHA-256；与技能 `copy_template.py` 的 tree_manifest 实现一致。

下面六项为选型阶段的源树完整性记录，本次所选 temp5 再次复核相同。

| Candidate                             | Eligible files | SHA-256 before = after                                             |
| ------------------------------------- | -------------: | ------------------------------------------------------------------ |
| temp1_based_vvultimatum.net           |             40 | `ad8617cf0eff07649796ab199bf6febfacb7d2322e6b4a64d4c5d91a78b088ce` |
| temp2_based_farevergame.wiki          |             40 | `c177b0347691fe4b0718b892bf1215d1972b5a91f38a3bee245f3729023b6935` |
| temp3_based_gamblewithyourfriends.net |             49 | `7d4e398f3d08676c6f5e315b1614c63ca78f0d1b3145cd0df1c35cae78d3a23d` |
| temp4_based_miniwars.art              |             47 | `974cc1773f3e35dcd773412bd93c7de0b2447f9f9e02bc9d9541ed9b319afb53` |
| temp5_based_bombfarm.wiki             |             38 | `c310c18b2ac0c895e4f254d3e75cc8dea865ef1db2d08a0588fff950f0d15de8` |
| temp6_based_theskinstapler.com        |             65 | `cbf286b3b6522c7644550d587b064ba9e916f15e7d3245a36285629155bb43bc` |

## Adaptation boundaries

- 已导入**一个完整 temp5 基座**；模块组合、品牌、颜色、内容、分类、图片、SEO 和部署配置留待后续分别评估。
- worktree 的 `.git` 关联、现有 `.gitignore`、调研目录及本报告已保留。原技能脚本用于外部空暂存目录；本次已完成 dry-run、校验和授权范围内的无覆盖导入。
- 本次确认 temp5 无源 `.gitignore`，没有此路径冲突。后续只在工作副本中审议必要忽略规则；报告和背景资料目录保留。
- 演示品牌 Emberdeep、文章、虚构机制、示例数量、统计、SVG 和元数据，必须在内容适配阶段全部替换或明确处理；导入演示模板不表示这些内容适合发布。
- 未实现的数据库、实时报价、计算器、视频系统、搜索量或社区功能不计作模板已有能力。任何新增网络请求、分析或遥测需遵守用户授权。
- 发布前补充针对未知路由、分类/slug/日期、目录锚点、内容状态、导航、手机表格、FAQ 与元数据的有效检查；源模板中的既有记录不能替代新游戏项目验证。

## Open decisions

1. **确认进入环境验证阶段。** 补充 Next.js 产物忽略规则、按锁文件安装依赖、执行可用的类型与构建检查；导入阶段未执行这些命令。
2. **内容适配时确定分类与发布状态模型。** 61 个意图并非 61 篇可立即上线文章；优先核心四类，其他按证据情况安排。
3. **决定需要实施的补充模块及顺序。** 建议先快速答案/步骤与表格，再相关度推荐，文章数量增长时加入搜索；本轮均未实现。
4. **确认新的部署目标与图片/字体策略。** 所选基座是 Next.js + MDX + pnpm，布局使用 next/font/google；原站 Astro 配置已经移除，不能沿用旧部署命令或假定目标平台兼容。
