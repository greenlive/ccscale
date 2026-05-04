# CC Scale B2B外贸平台架构设计文档

## 1. 系统概述

### 1.1 项目简介

CC Scale B2B外贸平台是一个面向全球市场的工业衡器（电子秤、天平、称重传感器等）B2B外贸网站。平台提供多语言支持（中英文），支持海外买家在线询盘、产品展示、企业实力展示等功能。系统包含前台展示网站、管理后台和API服务三大部分。

### 1.2 技术栈总览

| 应用 | 框架 | 主要技术 |
|------|------|----------|
| **apps/web** (前台) | Next.js 14 App Router | React 18, TypeScript, Tailwind CSS, React Query, Zustand, next-intl (i18n) |
| **apps/admin** (后台) | Next.js 14 (Pages Router) | React 18, TypeScript, Tailwind CSS, React Query, React Hook Form, Recharts |
| **apps/api** (服务) | NestJS | TypeScript, Prisma ORM, JWT Auth, Helmet, Throttler |
| **packages/database** | Prisma | PostgreSQL, Prisma Client |
| **packages/ui** | Radix UI + Tailwind | CVA, Lucide Icons, Radix Slot |

### 1.3 系统架构图（文字描述）

```
┌─────────────────────────────────────────────────────────────────┐
│                           用户端                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │   apps/web      │              │   apps/admin     │          │
│  │   (前台网站)     │              │   (管理后台)      │          │
│  │   Port 3000     │              │   Port 3001      │          │
│  │   Next.js 14    │              │   Next.js 14     │          │
│  │   next-intl     │              │   React Query    │          │
│  │   /[locale]/    │              │   /dashboard     │          │
│  └────────┬────────┘              └────────┬────────┘          │
│           │                                │                    │
└───────────┼────────────────────────────────┼────────────────────┘
            │          HTTP/REST             │
            ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      apps/api (NestJS API)                      │
│                         Port 3002                                │
├─────────────────────────────────────────────────────────────────┤
│  ProductsModule  │  InquiriesModule  │  AuthModule              │
│  CategoriesModule│  TestimonialsModule│  ClientsModule          │
│  SiteSettingsModule│  NotificationsModule│  AnalyticsModule      │
│  DownloadsModule │  UploadModule                                 │
├─────────────────────────────────────────────────────────────────┤
│                     Prisma ORM                                   │
└────────────────────────────┬───────────────────────────────────┘
                             │  PostgreSQL
                             ▼
                    ┌────────────────┐
                    │   PostgreSQL   │
                    │   Database     │
                    └────────────────┘
```

## 2. 项目结构

```
by_claude_vol/
├── apps/
│   ├── web/                    # 前台网站 (Next.js 14 App Router)
│   │   ├── app/
│   │   │   └── [locale]/      # locale路由 (en, zh等)
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   │
│   ├── admin/                  # 管理后台 (Next.js 14 Pages Router)
│   │   ├── app/               # 页面路由
│   │   ├── components/        # 共享组件
│   │   ├── lib/               # API客户端
│   │   └── package.json
│   │
│   └── api/                    # NestJS API服务
│       └── src/
│           ├── products/      # 产品模块
│           ├── categories/    # 分类模块
│           ├── inquiries/     # 询盘模块
│           ├── auth/          # 认证模块
│           ├── analytics/    # 统计模块
│           ├── testimonials/ # 客户见证模块
│           ├── clients/       # 客户Logo模块
│           ├── site-settings/# 网站设置模块
│           ├── notifications/# 通知模块
│           ├── downloads/    # 下载中心模块
│           ├── upload/        # 文件上传模块
│           └── main.ts
│
├── packages/
│   ├── database/              # Prisma数据库模型包
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   ├── ui/                    # 共享UI组件库
│   │   └── src/
│   │       ├── components/   # Button, Card, Input等
│   │       └── index.ts
│   │
│   ├── i18n/                  # 国际化包
│   └── shared-types/         # 共享类型定义
│
├── docs/                      # 文档目录
└── package.json               # 根workspace配置
```

## 3. 前台架构 (apps/web)

### 3.1 Next.js 14 App Router + locale路由

前台使用Next.js 14的App Router，并采用locale路由实现多语言支持。路由结构如下：

- `/[locale]/` — locale参数，支持 `en`、`zh` 等
- `/[locale]/page.tsx` — 首页
- `/[locale]/products/[slug]/page.tsx` — 产品详情页
- `/[locale]/categories/[slug]/page.tsx` — 分类页

### 3.2 关键页面路由结构

| 路由 | 文件 | 说明 |
|------|------|------|
| `/[locale]/` | `app/[locale]/page.tsx` | 首页 |
| `/[locale]/products/[slug]` | `app/[locale]/products/[slug]/page.tsx` | 产品详情 |
| `/[locale]/categories/[slug]` | `app/[locale]/categories/[slug]/page.tsx` | 分类页 |

### 3.3 组件层次结构

```
components/
├── ui/                    # 基础UI组件（来自packages/ui）
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── layout/                # 布局组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── MobileNav.tsx
├── products/             # 产品相关组件
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   └── ProductSpecs.tsx
└── home/                  # 首页组件
    ├── Hero.tsx
    └── Categories.tsx
```

### 3.4 状态管理方案

- **Zustand** — 全局状态管理（如语言切换、购物车等）
- **React Query (@tanstack/react-query)** — 服务器状态管理（API数据获取与缓存）
- **React Hook Form + Zod** — 表单验证

### 3.5 API调用方式

使用 `axios` 配合 React Query 进行API调用：

```typescript
// lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
});

// 使用React Query
const { data } = useQuery({
  queryKey: ['products', slug],
  queryFn: () => apiClient.get(`/products/${slug}`),
});
```

## 4. 管理后台架构 (apps/admin)

### 4.1 Next.js + React Query

管理后台使用Next.js 14 Pages Router架构，通过React Query管理服务器状态。

### 4.2 页面结构

| 路由 | 文件 | 说明 |
|------|------|------|
| `/` | `app/page.tsx` | 重定向到/dashboard |
| `/login` | `app/login/page.tsx` | 登录页 |
| `/dashboard` | `app/dashboard/page.tsx` | 数据看板 |
| `/products` | `app/products/page.tsx` | 产品列表 |
| `/products/new` | `app/products/new/page.tsx` | 新增产品 |
| `/products/[id]/edit` | `app/products/[id]/edit/page.tsx` | 编辑产品 |
| `/categories` | `app/categories/page.tsx` | 分类管理 |
| `/inquiries` | `app/inquiries/page.tsx` | 询盘列表 |
| `/inquiries/[id]` | `app/inquiries/[id]/page.tsx` | 询盘详情 |
| `/testimonials` | `app/testimonials/page.tsx` | 客户见证 |
| `/clients` | `app/clients/page.tsx` | 客户Logo |
| `/downloads` | `app/downloads/page.tsx` | 下载中心 |
| `/analytics` | `app/analytics/page.tsx` | 数据分析 |
| `/users` | `app/users/page.tsx` | 用户管理 |
| `/settings` | `app/settings/page.tsx` | 网站设置 |
| `/profile` | `app/profile/page.tsx` | 个人设置 |

### 4.3 组件组织

```
components/
├── ui/                    # 基础UI组件
├── layout/                # 后台布局
│   ├── Sidebar.tsx        # 侧边栏
│   ├── Header.tsx
│   └── Layout.tsx
├── products/              # 产品管理组件
│   ├── ProductForm.tsx
│   ├── ProductList.tsx
│   └── ProductSpecs.tsx
├── inquiries/              # 询盘管理组件
│   ├── InquiryList.tsx
│   └── InquiryDetail.tsx
└── common/                # 通用组件
    ├── DataTable.tsx
    └── StatusBadge.tsx
```

### 4.4 表单处理

使用 **React Hook Form** + **Zod** + **@hookform/resolvers** 实现类型安全的表单验证：

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nameEn: z.string().min(1),
  nameZh: z.string().min(1),
  priceMin: z.number().optional(),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## 5. API架构 (apps/api)

### 5.1 NestJS模块化架构

NestJS采用模块化设计，每个功能模块独立。入口文件 `src/main.ts` 引导应用，`src/app.module.ts` 聚合所有模块。

### 5.2 核心模块列表

| 模块 | 路径 | 功能 |
|------|------|------|
| **ProductsModule** | `src/products/` | 产品CRUD、多图管理、规格管理 |
| **CategoriesModule** | `src/categories/` | 产品分类管理 |
| **InquiriesModule** | `src/inquiries/` | 询盘收集、处理、分配 |
| **AuthModule** | `src/auth/` | 用户认证、JWT令牌、登录 |
| **AnalyticsModule** | `src/analytics/` | 用户行为统计、会话追踪 |
| **TestimonialsModule** | `src/testimonials/` | 客户见证管理 |
| **ClientsModule** | `src/clients/` | 客户Logo管理 |
| **SiteSettingsModule** | `src/site-settings/` | 网站配置KV存储 |
| **NotificationsModule** | `src/notifications/` | 邮件/站内通知 |
| **DownloadsModule** | `src/downloads/` | 下载中心文件管理 |
| **UploadModule** | `src/upload/` | 文件上传（本地/云存储） |

### 5.3 中间件和守卫

| 组件 | 作用 |
|------|------|
| **ThrottlerGuard** | 全局限流守卫，基于 `@nestjs/throttler` |
| **Helmet** | HTTP安全头中间件 |
| **ServeStaticModule** | 静态文件服务（上传目录） |
| **JwtAuthGuard** | 认证守卫（保护需要登录的路由） |
| **class-validator** | DTO请求验证 |
| **class-transformer** | DTO属性转换 |

### 5.4 数据库ORM

使用 **Prisma ORM** 连接数据库：

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

## 6. 数据模型

### 6.1 Product产品模型

核心B2B字段包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `sku` | String (unique) | 产品SKU |
| `slug` | String (unique) | URL友好标识 |
| `nameEn / nameZh` | String | 中英文名称 |
| `descriptionEn / descriptionZh` | String? | 详细描述 |
| `shortDescEn / shortDescZh` | String? | 短描述 |
| `mainImage` | String? | 主图URL |
| `videoUrl` | String? | 产品视频 |
| `priceMin / priceMax` | Decimal? | 价格区间 |
| `moq` | Int? | 最小起订量 |
| `leadTime` | String? | 货期 |
| `coreSellingPointsEn / Zh` | String? | 核心卖点(JSON数组) |
| `applicationScenariosEn / Zh` | String? | 应用场景 |
| `faqEn / faqZh` | String? | 常见问题(JSON数组) |
| `certifications` | String? | 认证证书(JSON数组) |
| `hsCode` | String? | 海关编码 |
| `paymentTerms` | String? | 付款条款 |
| `shippingTerms` | String? | 运输条款 |
| `warrantyInfo` | String? | 保修信息 |
| `packagingInfoEn / Zh` | String? | 包装信息 |
| `manufacturerName` | String? | 厂商名称 |
| `factoryLocation` | String? | 工厂位置 |
| `productionCapacity` | String? | 产能 |
| `fobPort` | String? | FOB港口 |
| `targetMarkets` | String? | 目标市场(JSON数组) |
| `exportExperience` | String? | 出口经验 |
| `factoryYears` | Int? | 工厂年限 |
| `factoryCountries` | Int? | 出口国家数 |
| `factoryCapacity` | String? | 工厂规模 |
| `isFeatured` | Boolean | 精选产品 |

关联：`ProductCategory`（多对一）、`ProductImage[]`（一对多）、`ProductSpec[]`（一对多）

### 6.2 Category分类模型

```prisma
model ProductCategory {
  id            Int       @id @default(autoincrement())
  nameEn        String
  nameZh        String
  slug          String    @unique
  imageUrl      String?
  descriptionEn String?
  descriptionZh String?
  order         Int       @default(0)
  isActive      Boolean   @default(true)
  products      Product[]
}
```

### 6.3 Inquiry询盘模型

```prisma
model Inquiry {
  id            Int           @id @default(autoincrement())
  fullName      String
  email         String
  phone         String?
  whatsapp      String?
  company       String?
  country       String?
  city          String?
  message       String
  // 来源追踪
  source        String?
  trafficSource TrafficSource?
  utmSource     String?
  utmMedium     String?
  utmCampaign   String?
  utmContent    String?
  utmTerm       String?
  referrer      String?
  ipAddress     String?
  userAgent     String?
  status        InquiryStatus @default(NEW)
  assignedToId  Int?          // 分配给销售
  notes         String?
  repliedAt     DateTime?
  items         InquiryItem[]
  assignedTo    User?         @relation("AssignedInquiries")
  activities    ActivityLog[]
}

enum InquiryStatus {
  NEW
  READ
  IN_PROGRESS
  REPLIED
  CLOSED
  SPAM
}
```

### 6.4 User用户模型

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // bcrypt加密
  name      String
  role      Role     @default(EDITOR)
  isActive  Boolean  @default(true)
  lastLogin DateTime?
  assignedInquiries Inquiry[] @relation("AssignedInquiries")
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}
```

### 6.5 其他关键模型

| 模型 | 用途 |
|------|------|
| **ProductImage** | 产品图片（type: MAIN/DETAIL） |
| **ProductSpec** | 产品规格参数 |
| **OemStep** | OEM/ODM定制流程步骤 |
| **ActivityLog** | 询盘操作日志 |
| **InquiryItem** | 询盘中的产品项 |
| **Testimonial** | 客户见证（评价） |
| **Client** | 客户Logo墙 |
| **Download** | 下载中心文件 |
| **PageContent** | 静态页面内容 |
| **UserSession** | 用户会话追踪 |
| **SessionEvent** | 会话事件记录 |
| **SiteSetting** | 网站配置KV |

## 7. 部署架构

### 7.1 前台部署（Vercel）

```
apps/web → Vercel
- 框架: Next.js 14 App Router
- 环境变量: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL
- 构建命令: next build
- 输出目录: .next
```

Vercel配置文件示例：
- `vercel.json` 或 Vercel Dashboard配置
- 环境变量 `DATABASE_URL`（PostgreSQL连接串）
- 多语言通过 `next-intl` 实现

### 7.2 API部署

```
apps/api → Node.js Host (Railway / Render / VPS)
- 框架: NestJS
- 环境变量: DATABASE_URL, JWT_SECRET, SMTP配置
- 启动命令: npm run start:prod
- 端口: 3002
```

构建产出为 `dist/` 目录，通过 `node dist/main.js` 运行。

### 7.3 数据库（PostgreSQL）

| 配置项 | 说明 |
|--------|------|
| **Provider** | PostgreSQL |
| **连接串** | `postgresql://user:password@host:5432/db` |
| **ORM工具** | Prisma Client |
| **迁移工具** | Prisma Migrate |
| **本地开发** | 可切换为SQLite（修改provider和DATABASE_URL） |

### 7.4 部署拓扑图

```
                    ┌──────────────────────┐
                    │       Vercel         │
                    │   apps/web (前台)     │
                    │   *.cc-scale.com      │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │     Railway/Render    │
                    │   apps/api (NestJS)   │
                    │   api.cc-scale.com    │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │     Supabase/Neon     │
                    │   PostgreSQL DB       │
                    │   (云数据库)          │
                    └──────────────────────┘

              ┌──────────────────────────────┐
              │     管理后台 (apps/admin)    │
              │   admin.cc-scale.com         │
              │   仅内部访问                  │
              └──────────────────────────────┘
```

> **说明**：管理后台 `apps/admin` 通常部署在同一Vercel项目中，通过路径或独立子域名访问，建议添加认证保护。

---

*文档版本: 1.0*
*最后更新: 2026-05-04*
