# War of Genesis Wiki — Legal 内容草稿

状态：**首版政策文案已获站主确认（2026-10-12）**。起草日期：2026-10-11（Asia/Taipei）；本地更新时间为2026-10-12，尚未部署。

参考：用户提供的 Bomb Farm 政策摘要，仅用于栏目结构。以下文案针对本站另行整理；不复制参考站的日期、广告/统计行为或法律条款。正式页面不展示本文件的审阅说明或待确认标记。


## 最新决定及本地页面

- 首版启用GA4和Adsterra，按用户决定直接加载，不设置同意控制。
- 已确认无账号、站内表单、评论；公开邮箱联系。
- 仅正式origin加载第三方服务；本地/预览不产生真实广告展示或统计事件。政策页无广告，GA4仍适用。
- 2026-10-12站主将Vercel/Cloudflare网站日志及联系邮件留存确认为30天，并确认三份政策文案；页面如实区分已确认规则与尚未核验的平台/邮箱设置，不把规则扩展到GA4/Adsterra。
- 完整Adsterra代码已接入，采用用户本次提供的脚本路径与匹配容器，未沿用此前不完整标识拼接地址。

## 历史起草说明（已由当前页面代码替代）

以下第1至3节是早期审阅背景，其中“未接入”“待确认”等描述不代表当前状态。最终批准版本以页面代码为准；本站规则的当前确认记录见docs/LEGAL_FACT_CHECK.md。

## 1. Privacy Policy — 可确认的开头

> War of Genesis: Idle Loot Wiki is an independent fan-made reference website at war-of-genesis.wiki. The site is operated by randy. You can contact the operator at StarBelkeKZU@gmail.com.

### 首版功能说明 — 事实已获站主确认

> The current site provides publicly readable articles. It does not offer an on-site account, comment system, or contact form. If you contact the operator by email, your message is sent through your email service rather than submitted through a form on this website.

这段说明仅描述当前重构功能，不等于承诺“本站不处理任何个人信息”。浏览访问产生的托管请求、邮件处理以及未来统计/广告需要单独披露。

### Analytics and advertising — 已确认首版计划

> The launch version is planned to include Google Analytics 4 for site analytics and Adsterra for advertising.

这是已确认的首版安排，当前代码尚未接入。最终公开政策应与完成接入后的实际行为一致，再补充服务加载方式、涉及的数据与Cookie/存储、选择控制及保存规则。不能在未验证前承诺匿名、零Cookie、指定保留天数或已实现撤回控制。

### 仍需补齐的章节

- Browsing and infrastructure：确认托管与网络服务实际处理的字段、目的及保存规则。
- Analytics and advertising：首版GA4与Adsterra已经确认；补齐实际加载控制与服务数据行为，不把GA4直接称为完全匿名。
- Contact messages：确认收到的地址、内容及附件如何处理、保存和删除，不自动写保存期限。
- Requests and contact：可以使用已确认邮箱；具体可执行流程及任何响应期限另行确认。
- Changes：公开发布时使用真实生效日期，并保持文案与实际功能同步。

## 2. Cookie Policy — 当前代码的审阅说明

当前源码未见本站主动读写 Cookie、localStorage 或 sessionStorage 的功能，也未接入 GA4/Adsterra。这是实现观察，不是对线上所有响应或第三方行为的最终声明。

用户已经确认首版启用GA4和Adsterra。是否在访客同意后加载、如何记录和撤回选择，以及两项服务实际使用的存储和期限仍需确定；本页不得以当前未接入为依据写成“上线站不使用Cookie”。

### 候选开头 — 待功能安排确认

> This page explains the browser storage used by War of Genesis: Idle Loot Wiki and any third-party services loaded on the site.

发布前按实际行为补齐：

- Cookies/storage in use：名称或类别、提供方、用途和实际期限；没有取得证据的类别不添加。
- Analytics/advertising controls：确认何时加载、访客如何作出或更改选择，与代码控制一致。
- Browser controls：如采用此说明，仅介绍浏览器提供的控制能力，不把浏览器设置当作本站所有处理规则的替代。
- Third-party destinations：访问外链与在本站加载第三方脚本是两类不同事件，分别描述。

不沿用参考站“没有同意弹窗、内容页自动加载广告”的安排，也不自动创建同意机制。本页内容取决于首版的实际统计/广告方案。

## 3. Terms of Use — 简明候选文案

### Independent reference site

> War of Genesis: Idle Loot Wiki is an independent fan-made guide hub. It is not affiliated with New Normal Soft Inc., Steam, or Valve. References to a game or platform identify the subject of the articles and do not imply endorsement.

### Information and updates

> Articles describe a limited set of researched references. Historical announcements and version-sensitive observations retain their dates. The site does not claim complete game coverage or provide a live feed of prices, player counts, or updates. Check the relevant official source and the current game interface before relying on version-sensitive information.

### External destinations

> Some links take you to third-party services, including official game and platform pages. Those destinations operate separately from this guide hub. Game purchases, account support, and trading take place on the relevant third-party service rather than through this website.

### Contact and corrections

> For site questions or to report an error in an article, contact randy at StarBelkeKZU@gmail.com. Include the page address and the information you would like reviewed. For game account or purchase support, use the official support channel linked on the site.

### 待站主审阅的范围

以上为基于已批准站点定位与当前功能的候选使用说明。没有添加未经批准的适用法律、赔偿/责任限制、默示接受规则、原创资产全部权属承诺或儿童数据处理承诺。是否增加这些条款应在明确适用范围和批准文案后决定，不复制参考站的完整条款。

## 4. 发布前确认清单

- [x] 首版启用GA4和Adsterra的计划获确认。
- [x] 无账号、站内表单、评论及邮箱联系的描述获确认。
- [x] 加载决定与完整Adsterra代码取得，按此完成本地接入。
- [ ] 部署后验证真实第三方加载、GA4事件和后台增强型衡量设置。
- [x] Vercel/Cloudflare日志及联系邮件的30天规则获确认；GA4/Adsterra独立处理期限不在本次确认范围内。
- [ ] 平台/邮箱实际留存及删除设置单独核验（运营待办，不冒称已设置）。
- [x] Privacy、Cookies、Terms首版文案获批准，本地更新时间2026-10-12；正式上线日期待实际部署。
- [x] 三条本地政策页面、页脚链接、元数据、sitemap 已实现。
- [x] 上轮14页38组布局、真实键盘导航、脚本隔离复测通过；本轮政策修改后3页12组尺寸复测通过。

三条本地政策路由已接入页脚、独立元数据及sitemap。当前页面文案以 app/privacy/page.tsx、app/cookies/page.tsx、app/terms/page.tsx 为准；以下早期草稿结构保留为审阅背景。没有部署；30天规则及文案已经明确确认。本轮更新后的类型检查/lint/构建和页面复测已通过，PL-004关闭；实际外部账户留存设置尚未核验。
