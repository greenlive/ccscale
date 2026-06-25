# CC Scale B2B 外贸独立站 — 部署前全面检查报告

> **检查时间**：2026-06-14  
> **检查原则**：以代码为唯一真相来源；文档仅作对照，不一致处以代码为准并标注。  
> **工作区**：`d:\program_self_develop\b2b\by_claude_vol`

---

## 1. 执行摘要

### 部署建议：**有条件部署（当前不建议直接上生产）**

**理由（基于代码与实测）：**

- **构建链路可用**：`npm run build` 在 7 个 workspace 包上全部成功（exit 0）；`apps/api`、`apps/web`、`apps/admin` 的 `tsc --noEmit` 均通过。
- **部署基础设施不完整**：仓库内 **`docker-compose.yml` 已缺失**（git status 显示已删除）；根目录 `Dockerfile` **仅构建 API**，且使用 `npm run build --filter=@cc-scale/api`（npm workspaces **不支持** `--filter`，该语法属于 turbo/pnpm）；**无 web/admin 镜像定义**。
- **生产运行时配置有硬编码**：`apps/web/next.config.js` 与 `apps/admin/next.config.js` 将 `/api`、`/uploads` 代理到 **`http://localhost:8000`**，未读取 `NEXT_PUBLIC_API_URL` 或环境变量，生产环境将导致前台/后台 API 请求失败。
- **数据库迁移策略缺失**：`packages/database/prisma/` 下 **无 `migrations/` 目录**，仅有 `schema.prisma` 与 `seed.ts`；生产库初始化/升级路径不明确。
- **信任与合规页面缺失**：Footer 链接 `/privacy`、`/terms`，但 `apps/web/app/` 下 **无对应路由**，部署后将 404。
- **安全面**：`GET /api/analytics/dashboard` **无 JWT 保护**（`apps/api/src/analytics/analytics.controller.ts`），可能泄露经营数据；seed 含默认弱口令（`admin123`/`editor123`）。
- **自动化测试为零**：全 monorepo 无单元/集成/E2E 测试脚本（仅 `packages/ui` 有占位 `test` 且 exit 1）。

**结论**：可在开发/预发环境验证业务功能，但 **不满足生产部署就绪条件**。需先修复 P0 项后再上线。

---

## 2. 项目结构（代码事实）

| 路径 | 用途 | 技术栈（package.json） |
|------|------|------------------------|
| `apps/web` | 外贸前台 | Next.js **14.2**、React **18.3**、next-intl |
| `apps/admin` | 后台管理 | Next.js 14.2、React 18.3 |
| `apps/api` | REST API | NestJS 10、Prisma、JWT |
| `packages/database` | Prisma schema/seed | PostgreSQL |
| `packages/ui` | 共享 UI 组件 | Radix + Tailwind |
| `packages/shared-types` | 共享类型 | TypeScript |
| `packages/i18n` | 共享消息（独立包） | TypeScript |

**文档与代码不一致（技术栈）**：

| 文档声称 | 代码事实 |
|----------|----------|
| README：Next.js **15** + React **19** | `apps/web/package.json`：`next ^14.2.0`、`react ^18.3.0` |
| README：启动 `docker-compose up -d` | 根目录 **`docker-compose.yml` 不存在** |
| README / `.env.example`：Meilisearch、Redis | **apps 内无任何 Meilisearch 调用**；Redis 仅在 `configuration.ts` 读取 URL，**无实际连接/缓存代码** |
| README：主导航含「AI摘要」 | `Header.tsx` 的 `navLinks` **不含** `/ai-summary`（翻译键 `nav.aiSummary` 存在于 `messages/*.json` 但未使用） |

**包管理器**：根 `package.json` 声明 `"packageManager": "npm@10.0.0"`，使用 **npm workspaces**（存在 `package-lock.json`，**无 `pnpm-lock.yaml`**）。本次检查执行 `npm install`（跳过，node_modules 已存在）而非 pnpm。

---

## 3. 已执行命令及结果摘要

| 命令 | 结果 | Exit | 备注 |
|------|------|------|------|
| `node -v && npm -v` | v25.8.1 / 11.12.0 | 0 | 要求 `engines.node >= 18`（满足） |
| `npm install` | 跳过 | — | node_modules 已存在 |
| `npm run build` | **7/7 成功** | 0 | 约 20s；web/admin 有 ESLint warning；turbo 对 4 个 package 报 outputs 警告 |
| `npm run lint`（turbo） | **失败** | 2 | `@cc-scale/ui/i18n/shared-types/database`：`eslint src/` 找不到匹配文件 |
| `npm audit --audit-level=moderate` | **失败** | 1 | registry `npmmirror.com` 不支持 security API |
| `apps/api` `npx tsc --noEmit` | 通过 | 0 | |
| `apps/web` `npx tsc --noEmit` | 通过 | 0 | |
| `apps/admin` `npx tsc --noEmit` | 通过 | 0 | |
| `npx prisma validate`（无 DATABASE_URL） | **失败** | 1 | P1012 缺少环境变量 |
| `DATABASE_URL=... npx prisma validate` | **通过** | 0 | schema 语法有效 |
| 单元/集成/E2E 测试 | **未执行** | — | 项目中无 test 脚本（除 ui 占位） |
| `docker-compose.yml` | **不存在** | — | |
| `Dockerfile` | 存在（仅 API） | — | |

---

## 4. 检查项清单

| 类别 | 检查项 | 结果 | 阻塞级别 |
|------|--------|------|----------|
| 依赖 | npm install / lockfile | ✅ 通过 | — |
| 依赖 | Node >= 18 | ✅ v25.8.1 | — |
| 依赖 | pnpm | ⚠️ 项目未使用 pnpm | P2 |
| 依赖 | npm audit | ❌ registry 不支持 | P2 |
| 静态 | TypeScript（api/web/admin） | ✅ 通过 | — |
| 静态 | turbo lint | ❌ 4 包失败 | P1 |
| 构建 | turbo build | ✅ 通过 | — |
| 测试 | 单元/集成/E2E | ❌ 无测试套件 | P1 |
| 数据库 | prisma schema validate | ✅（需 DATABASE_URL） | — |
| 数据库 | migrations | ❌ 无迁移目录 | **P0** |
| 数据库 | seed | ⚠️ 含默认弱口令 | P1 |
| 部署 | docker-compose | ❌ 缺失 | **P0** |
| 部署 | Dockerfile 完整性 | ❌ 仅 API、命令可疑 | **P0** |
| 部署 | 生产 API 代理 | ❌ localhost 硬编码 | **P0** |
| 安全 | 上传接口鉴权 | ✅ JwtAuthGuard | — |
| 安全 | 写操作鉴权 | ✅ 产品/博客等 POST 有 Guard | — |
| 安全 | analytics dashboard | ❌ 无鉴权 | **P0** |
| 安全 | Swagger 生产暴露 | ⚠️ 无 NODE_ENV 开关 | P1 |
| 能力 | 多语言 | ✅ 部分完整 | P2（hreflang 一致性） |
| 能力 | 多终端 | ✅ 响应式 Web | P2（无独立 H5） |
| 能力 | SEO/GEO | ✅ 部分完整 | P1（sitemap 硬编码） |
| 能力 | 用户信任 | ⚠️ 部分 mock/缺页 | **P0**（privacy/terms） |
| 能力 | AI 推广 | ⚠️ 部分实现 | P1（无 llms.txt/RSS） |

---

## 5. 代码验证能力矩阵

### 5.1 多语言

| 能力 | 代码位置 | 实现状态 | 部署风险 |
|------|----------|----------|----------|
| next-intl 集成 | `apps/web/i18n/routing.ts`、`middleware.ts`、`i18n/request.ts` | **完整** | 低 |
| locale 路由 en/zh | `locales: ['en','zh']`，`localePrefix: 'as-needed'` | **完整** | 低 |
| 默认语言 en | `defaultLocale: 'en'` | **完整** | 低 |
| 语言切换 UI | `apps/web/components/Header.tsx`（Globe 下拉） | **完整** | 低 |
| 翻译文件 | `apps/web/messages/en.json`、`zh.json` | **完整** | 低 |
| API/DB 双语字段 | `schema.prisma` 大量 `*En`/`*Zh` 字段 | **完整** | 低 |
| hreflang / alternates | `layout.tsx`、`products/page.tsx`、`products/[slug]/page.tsx` 的 `alternates.languages` | **部分** | **中**：`as-needed` 下英文默认无前缀，但 alternates 生成 `/en` URL，可能与实际 canonical 不一致 |
| 后台多语言 | `apps/admin` | **缺失** | 低（内部工具） |
| packages/i18n 包 | `packages/i18n/messages/*.json` | **部分** | 低：web 使用本地 messages，与 package 可能重复 |

### 5.2 多终端

| 能力 | 代码位置 | 实现状态 | 部署风险 |
|------|----------|----------|----------|
| Web 前台 | `apps/web` | **完整** | 低 |
| Admin 后台 | `apps/admin` | **完整** | 低 |
| 独立 Mobile/H5 App | 全仓库搜索 | **缺失** | 低（非必需） |
| 响应式布局 | Tailwind `sm:/md:/lg:` 广泛使用；`Header.tsx` 移动菜单 | **完整** | 低 |
| safe-area / 无障碍 | `SkipToMain.tsx`（safe-area-inset）；`globals.css`（prefers-reduced-motion） | **部分** | 低 |
| API 多端共用 | web/admin 均通过 `/api` 代理访问 NestJS | **完整** | **高**：生产代理指向 localhost |

### 5.3 SEO / GEO

| 能力 | 代码位置 | 实现状态 | 部署风险 |
|------|----------|----------|----------|
| robots.txt | `apps/web/app/robots.ts`（含 AI bot 规则） | **完整** | 低 |
| sitemap.xml | `apps/web/app/sitemap.ts` + `app/[locale]/sitemap.ts` | **部分** | **中**：两套 sitemap；产品/博客 slug **硬编码**，与 DB/seed 可能不一致 |
| generateMetadata / OG | 各 `[locale]/*/page.tsx` | **完整** | 低 |
| JSON-LD / schema.org | `components/SchemaOrg.tsx`、`lib/seo/schema.ts` | **完整** | 低 |
| SSG | `generateStaticParams` in `layout.tsx`、`products/[slug]/page.tsx` | **部分** | **中**：`allProductSlugs` 硬编码 5 个 slug，新上架产品不会静态生成 |
| ISR/revalidate | `lib/api/page-content.ts` `revalidate: 3600` | **部分** | 低 |
| Geo 定位（访客） | `apps/api/src/analytics/geo.service.ts`（ip-api.com） | **完整** | 中：依赖外部免费 API、HTTP 非 HTTPS |
| Geo 路由/hreflang 区域 | 仅 en-US/zh-CN alternates | **部分** | 低 |
| Meilisearch 搜索 | 文档/.env 有，**代码无** | **缺失** | 文档误导 |

### 5.4 用户信任

| 能力 | 代码位置 | 实现状态 | 部署风险 |
|------|----------|----------|----------|
| About | `app/[locale]/about/` | **完整** | 低 |
| Contact | `app/[locale]/contact/` + `ContactForm.tsx` | **完整** | 低 |
| Certifications 页 | `app/[locale]/certifications/page.tsx` | **部分** | **高**：使用 `mockCertificates` 常量，**无 Certificate 模型/API** |
| Cases 页 | `app/[locale]/cases/page.tsx` | **部分** | **高**：使用 `mockClientCases`/`mockShipmentPhotos`；API `GET /api/cases` 存在但页面未调用 |
| Testimonials | `components/Testimonials.tsx` → `GET /api/testimonials` | **完整** | 低（依赖 DB 有数据） |
| Clients | `components/Clients.tsx` → API | **完整** | 低 |
| 询盘/Lead | `InquiryForm.tsx`、`InquiryCartDrawer` → `POST /api/inquiries` | **完整** | 低；有 Throttle 限流 |
| 询盘存储 | `schema.prisma` `Inquiry`/`InquiryItem` | **完整** | 低 |
| 隐私政策/条款 | Footer 链接 `/privacy`、`/terms` | **缺失** | **P0：404** |
| 公司信息/工厂展示 | `ProductFactoryShowcase.tsx`、site-settings API | **完整** | 低 |
| Footer 邮件订阅 | `Footer.tsx` `handleSubscribe` | **部分** | 中：**仅 setTimeout 模拟**，无后端 |
| ICP 备案展示 | `Footer.tsx` `icpNumber` 字段 | **部分** | 低 |

### 5.5 AI 推广适应

| 能力 | 代码位置 | 实现状态 | 部署风险 |
|------|----------|----------|----------|
| AI 摘要页 | `app/[locale]/ai-summary/page.tsx` + `AISummarySchema` | **完整** | 低 |
| robots 允许 AI bots | `app/robots.ts` GPTBot/ClaudeBot 等 | **完整** | 低 |
| 语义化 HTML / schema.org | 各页面 + `SchemaOrg.tsx` | **完整** | 低 |
| 主导航 AI 入口 | `Header.tsx` navLinks | **缺失** | 中：文档声称有，代码无 |
| llms.txt | 全仓库 | **缺失** | P1（GEO 最佳实践） |
| RSS/Atom feed | 全仓库 | **缺失** | P1 |
| 产品结构化 export | 仅页面内 JSON-LD | **部分** | 低 |

---

## 6. 文档声称但代码未实现 / 不一致

| 文档来源 | 声称 | 代码事实 |
|----------|------|----------|
| README.md | Next 15 + React 19 | Next 14 + React 18 |
| README.md | `docker-compose up -d` | 文件不存在 |
| README.md | PostgreSQL + **Redis** + **Meilisearch** | 仅 PostgreSQL/Prisma 实际使用；Redis/Meilisearch 无业务代码 |
| README.md | 导航含 AI摘要 | Header 无该链接 |
| `.env.example` | MEILISEARCH_*、REDIS_URL | 无对应消费代码 |
| `review_report0421.md` | llms.txt | 不存在 |
| Footer 文案 | 隐私政策、服务条款 | 无页面路由 |
| `certifications/page.tsx` 注释/展示 | 资质认证 | 全部为 mock 数据 |

---

## 7. 失败 / 警告详情

### 7.1 P0 — 阻塞性问题

#### P0-1：`docker-compose.yml` 缺失
- **证据**：仓库根目录无文件；git status `D docker-compose.yml`
- **影响**：无法按原方式一键拉起 PostgreSQL/Redis/Meilisearch
- **修复**：恢复或重写 compose，至少包含 PostgreSQL；移除未使用的 Redis/Meilisearch 或补齐代码

#### P0-2：生产 API 代理硬编码 localhost
- **文件**：`apps/web/next.config.js:19-28`、`apps/admin/next.config.js:15-26`
- **问题**：`destination: 'http://localhost:8000/api/:path*'`
- **修复**：改为 `process.env.API_URL` 或构建时注入；生产推荐直连 API 域名而非 rewrite

#### P0-3：Dockerfile 不完整且构建命令可疑
- **文件**：`Dockerfile:27` — `npm run build --filter=@cc-scale/api`
- **问题**：npm 不支持 `--filter`；仅复制 API dist，无 web/admin 镜像
- **修复**：使用 turbo 构建或分阶段多 Dockerfile；修正 CMD 路径（当前 `dist/main` vs nest 输出 `apps/api/dist`）

#### P0-4：无 Prisma migrations
- **路径**：`packages/database/prisma/` 仅有 `schema.prisma`、`seed.ts`
- **影响**：生产 schema 变更无版本化迁移
- **修复**：`prisma migrate dev` 生成初始 migration 并纳入 CI/CD

#### P0-5：隐私政策 / 服务条款页面缺失
- **文件**：`apps/web/components/Footer.tsx:269-270` 链接 `/privacy`、`/terms`
- **影响**：合规风险、用户信任受损、404
- **修复**：新增 `app/[locale]/privacy/page.tsx`、`terms/page.tsx`

#### P0-6：Analytics Dashboard 未鉴权
- **文件**：`apps/api/src/analytics/analytics.controller.ts:16-28`
- **问题**：`GET analytics/dashboard` 无 `@UseGuards`
- **修复**：添加 JwtAuthGuard + ADMIN 角色

#### P0-7：资质认证页使用 Mock 数据
- **文件**：`apps/web/app/[locale]/certifications/page.tsx:8-53` — `mockCertificates`
- **问题**：无 DB 模型、无 API、无 Admin 管理
- **修复**：新增 Certificate 模型与 CRUD，或改为 site-settings/page-content 驱动

### 7.2 P1 — 高优先级（不阻塞构建，阻塞业务可信度/运维）

| ID | 问题 | 位置 | 建议 |
|----|------|------|------|
| P1-1 | 案例页未接 API，全 mock | `cases/page.tsx` | 改用 `lib/api/queries.ts` 已有 cases 查询 |
| P1-2 | Sitemap 硬编码 slug 与 seed/SSG 不一致 | `sitemap.ts`、`products/[slug]/page.tsx` | 构建时从 API/DB 拉取动态 slug |
| P1-3 | hreflang URL 与 `as-needed` 路由不一致 | `layout.tsx` alternates | 英文用无前缀 canonical |
| P1-4 | 零自动化测试 | 全仓库 | 至少 API 核心路径 + 询盘 E2E |
| P1-5 | turbo lint 失败 | `packages/*/package.json` `lint: eslint src/` | 改为 `eslint "src/**/*.{ts,tsx}"` 或 skip |
| P1-6 | seed 默认密码 `admin123` | `prisma/seed.ts:10,24` | 生产禁用默认 seed 或强制改密 |
| P1-7 | Swagger 始终开启 | `main.ts:76` | 生产 `NODE_ENV=production` 时禁用 |
| P1-8 | 无 llms.txt / RSS | — | 按 GEO 需求补充 |
| P1-9 | Footer 订阅假实现 | `Footer.tsx:84-93` | 接邮件服务或移除 |

### 7.3 P2 — 改进项

- Node v25 高于 LTS，建议在 CI 锁定 20.x LTS
- `npm audit` 需切换官方 registry 后重跑
- turbo build outputs 警告（database/ui/i18n/shared-types 空 build）
- web build ESLint warnings（`no-img-element`、`exhaustive-deps`）
- `GeoService` 使用 `http://ip-api.com`（非 TLS）
- `CORS_ORIGIN` 默认仅 `localhost:3000`，生产需含 admin 域名

---

## 8. 安全检查结果（代码审查）

| 项 | 状态 | 说明 |
|----|------|------|
| JWT 保护写接口 | ✅ | products/blog/cases/upload 等 POST/PUT/DELETE 有 Guard |
| 公开读接口 | ✅ 设计如此 | products、site-settings GET 公开 |
| 询盘 POST 公开 + 限流 | ✅ | `@Throttle` 10/min |
| 上传 | ✅ | 全部需 JWT |
| 硬编码生产密钥 | ⚠️ | `.env.example` 含示例 JWT/DB 密码；`configuration.ts` 有默认 DB URL |
| `.env` 泄露 | ✅ | `.env.example` 仅示例，未见 committed `.env` |
| 依赖漏洞扫描 | ❌ 未完成 | npmmirror 不支持 audit |

---

## 9. 修复优先级路线图

```
P0（上线前必须）
├── 恢复/编写 docker-compose 或 K8s 清单（至少 PostgreSQL）
├── 修复 next.config 生产 API 地址
├── 完善 Dockerfile（api + web + admin）并验证镜像构建
├── 生成 Prisma migrations
├── 新增 privacy / terms 页面
├── 保护 analytics/dashboard
└── 认证页接真实数据源或降级展示

P1（首版上线后 1-2 周）
├── cases 页接 API
├── 动态 sitemap / generateStaticParams
├── 补充 smoke/E2E 测试
├── 修复 monorepo lint
└── llms.txt + 导航 AI 入口（若产品需要）

P2（持续改进）
├── Meilisearch/Redis 决策：实现或从文档移除
├── audit + Node LTS 对齐
└── Footer 订阅真实化
```

---

## 10. 附录：Monorepo 脚本（代码事实）

根 `package.json` scripts：
- `build` → `turbo build`
- `dev` → `turbo dev`
- `lint` → `turbo lint`
- **无** `test`、`typecheck`

各 app 均有 `build`、`lint`；database 有 `db:generate`、`db:push`、`db:migrate`、`db:seed`。

---

*本报告由部署前检查流程生成，所有结论均来自代码阅读与实际命令执行，未将 README/设计文档作为事实依据。*
