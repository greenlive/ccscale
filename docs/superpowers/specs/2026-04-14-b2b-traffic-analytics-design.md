# B2B外贸网站流量分析与数据追踪系统设计方案

**日期：** 2026-04-14
**项目：** CC Scale B2B外贸平台 - 用户来源分析与数据追踪系统
**作者：** Claude (AI辅助设计)
**状态：** 🟢 已实施完成（2026-04-15）

## 实施记录

| 日期 | 阶段 | 完成内容 |
|------|------|---------|
| 2026-04-15 | Phase 1-3 | 增强AnalyticsTracker传递UTM数据 |
| 2026-04-15 | Phase 1-3 | 增强询盘提交附加UTM数据 |
| 2026-04-15 | Phase 4 | 增强Admin数据分析仪表盘 |

---

## 1. 项目背景与目标

### 1.1 问题陈述

B2B外贸网站运营当前面临的核心问题：
- 无法知道访客从哪个渠道来（Google搜索？YouTube？TikTok？社媒？）
- 无法评估各推广渠道的ROI
- 无法判断哪些关键词/产品最受欢迎
- 无法追踪用户站内行为路径
- 无法识别AI搜索引擎（ChatGPT/Perplexity）对品牌的提及情况

### 1.2 解决方案目标

建设一套完整的流量分析与数据追踪系统，实现：
1. **来源可见** — 清晰区分每个流量渠道
2. **渠道追踪** — 给每个渠道打标签，知道投入产出
3. **关键词分析** — 知道用户搜什么词找到你
4. **转化追踪** — 知道每个渠道带来了多少询盘
5. **GEO监测** — 监控AI搜索引擎对品牌的引用情况
6. **决策支撑** — 老板5分钟内能回答"这个渠道值不值得投"

### 1.3 目标用户

- **主要用户：** 2-3人外贸运营团队
- **使用场景：** 日常运营监控、周度/月度复盘、渠道决策
- **使用频率：** 每日查看核心指标，每周详细分析

---

## 2. 用户来源渠道定义

### 2.1 渠道分类体系

| 渠道大类 | 子渠道 | 说明 | 追踪方式 |
|---------|--------|------|---------|
| **自然搜索 (Organic Search)** | Google | Google.com及各国Google | GSC + GA4 |
| | Bing/Yahoo | 其他搜索引擎 | GA4 |
| **社交媒体 (Social)** | YouTube | 视频平台跳转 | UTM追踪 |
| | LinkedIn | 职业社交平台 | UTM追踪 |
| | TikTok | 短视频平台 | UTM追踪 |
| | Facebook | 社交平台 | UTM追踪 |
| | Instagram | 图片社交 | UTM追踪 |
| | WhatsApp | 即时通讯 | UTM追踪 |
| **直接访问 (Direct)** | 品牌名/书签 | 直接输入URL或收藏夹 | GA4 |
| **引荐来源 (Referral)** | B2B平台 | Alibaba/MIC等跳转 | GA4 + UTM |
| | 行业论坛 | 行业网站外链跳转 | GA4 |
| | 新闻/媒体 | PR文章外链跳转 | GA4 |
| **广告投放 (Paid)** | Google Ads | Google付费广告 | GTM + UTM |
| | 社媒广告 | Facebook/LinkedIn广告 | UTM追踪 |
| **邮件营销 (Email)** | 邮件跳转 | Newsletter/推广邮件 | UTM追踪 |

### 2.2 UTM参数规范

所有带出去的链接统一使用以下UTM格式：

```
https://yourdomain.com?utm_source=xxx&utm_medium=xxx&utm_campaign=xxx&utm_content=xxx
```

**参数说明：**

| 参数 | 值示例 | 说明 |
|------|--------|------|
| `utm_source` | youtube, linkedin, tiktok, facebook, google, newsletter | 渠道来源 |
| `utm_medium` | social, cpc, email, referral | 营销媒介 |
| `utm_campaign` | product_video, oem_promotion, new_product_launch | 活动名称 |
| `utm_content` | hanging_scale_demo, kitchen_scale_tutorial | 具体内容标识 |

**UTM链接生成工具：**
- Google Campaign URL Builder (免费在线工具)
- HrefTag for GA4 (浏览器扩展)

---

## 3. 核心功能设计

### 3.1 功能模块划分

```
┌─────────────────────────────────────────────────────────────┐
│                    数据追踪系统架构                          │
├─────────────────────────────────────────────────────────────┤
│  数据采集层                                                  │
│  ├── Google Analytics 4 (前端埋点)                           │
│  ├── Google Search Console (SEO数据)                         │
│  ├── Google Tag Manager (统一管理)                           │
│  └── 自定义事件追踪 (询盘提交、产品页浏览)                     │
├─────────────────────────────────────────────────────────────┤
│  数据处理层                                                  │
│  ├── UTM参数解析                                             │
│  ├── 渠道归因模型                                            │
│  └── 转化路径分析                                            │
├─────────────────────────────────────────────────────────────┤
│  数据展示层                                                  │
│  ├── Admin后台 - 数据仪表盘 (自建)                           │
│  ├── Google Analytics 4 (官方仪表盘)                         │
│  └── GEO监测报告 (手动/半自动)                               │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Admin后台数据仪表盘

在现有admin后台增加"数据看板"页面，聚焦以下核心指标：

**A. 流量概览卡片（首页）**
| 指标 | 说明 | 数据来源 |
|------|------|---------|
| 总访问量 | 过去30天UV | GA4 API |
| 询盘数量 | 提交的询盘总数 | 自有数据库 |
| 询盘转化率 | 访客→询盘比例 | 计算值 |
| 跳出率 | 单页访问比例 | GA4 API |

**B. 流量来源饼图**
- 展示：自然搜索 vs. 社媒 vs. 直接访问 vs. 引荐 vs. 广告 vs. 邮件
- 交互：点击某个渠道可下钻到详情

**C. 社媒渠道对比柱状图**
- 展示：YouTube vs. LinkedIn vs. TikTok vs. Facebook vs. Instagram
- 对比：各渠道带来的访问量 + 询盘转化量

**D. 关键词TOP 20表格**
| 关键词 | 搜索量 | 排名 | 带来流量 | 转化询盘 |
|--------|--------|------|---------|---------|
| hanging scale supplier | 1000 | #3 | 150 | 5 |
| kitchen scale OEM | 800 | #8 | 80 | 3 |

**E. 产品页热度排行**
| 产品 | 访问量 | 停留时长 | 询盘转化数 |
|------|--------|---------|-----------|
| 电子台秤 | 500 | 2:30 | 12 |
| 挂钩秤 | 350 | 2:15 | 8 |

**F. 询盘来源分析表**
| 询盘ID | 来源渠道 | 来源关键词 | 询盘产品 | 提交时间 |
|--------|---------|-----------|---------|---------|
| #1023 | youtube | hanging scale demo | 挂钩秤 | 2026-04-14 10:30 |
| #1024 | google organic | kitchen scale OEM | 厨房秤 | 2026-04-14 09:15 |

**G. 转化漏斗图**
访客 → 产品页浏览 → 询盘表单点击 → 询盘提交
展示每个环节的流失率

### 3.3 数据采集埋点方案

**必须追踪的事件：**

| 事件名称 | 触发条件 | 传递参数 |
|---------|---------|---------|
| `page_view` | 页面加载 | page_url, referrer, utm_params |
| `product_view` | 产品页加载 | product_id, product_name, category |
| `inquiry_start` | 点击询盘按钮 | product_id, source_page |
| `inquiry_submit` | 询盘表单提交 | product_id, inquiry_data, utm_params |
| `download_click` | 点击下载文件 | file_id, file_name |
| `video_watch` | YouTube嵌入播放 | video_id, watch_duration |
| `whatsapp_click` | 点击WhatsApp按钮 | page_url, product_id |

### 3.4 GEO监测方案

**监控内容：**
1. ChatGPT 是否提及 CC Scale / 公司名
2. Perplexity 搜索结果中是否出现
3. Google AI Overview 是否引用网站内容

**监测方式：**
- 手动：每月用公司名/品牌词在AI工具中搜索一次，记录结果
- 半自动：设置Google Alert，当有提及时邮件通知
- 工具：Mention、Brand24 等品牌监测工具（可选，有预算后考虑）

**优化行动：**
- 如果AI没提到你 → 检查SEO是否到位，GEO section 4.3的优化是否做了
- 如果AI提到竞争对手没提到你 → 分析竞争对手内容策略

---

## 4. 技术实现方案

### 4.1 技术选型

| 组件 | 选择 | 理由 |
|------|------|------|
| 前端埋点 | Google Analytics 4 | 免费、强大、集成度高 |
| SEO数据 | Google Search Console | 免费、官方数据最准确 |
| 标签管理 | Google Tag Manager | 统一管理，减少开发工作 |
| 后台仪表盘 | 自建Admin页面 | 与现有admin系统集成 |
| GEO监测 | 手动 + Google Alerts | 低成本起步 |

### 4.2 关键文件

```
apps/
├── web/                          # 前端网站
│   ├── app/[locale]/
│   │   └── layout.tsx            # GA4脚本注入
│   └── lib/
│       └── analytics.ts         # 事件追踪工具函数
│
├── admin/                        # 后台管理系统
│   ├── app/
│   │   └── analytics/            # 新增：数据仪表盘页面
│   │       ├── page.tsx         # 仪表盘首页
│   │       ├── channels/       # 渠道分析
│   │       ├── keywords/        # 关键词分析
│   │       ├── products/        # 产品热度
│   │       └── inquiries/       # 询盘来源
│   └── components/
│       └── charts/              # 新增：图表组件
│
├── api/                          # API服务
│   └── src/
│       ├── analytics/            # 已有，增强功能
│       └── tracking/             # 新增：追踪数据API
│           ├── dto/
│           │   ├── track-event.dto.ts
│           │   └── utm-params.dto.ts
│           ├── tracking.controller.ts
│           └── tracking.service.ts
│
└── packages/
    └── database/
        └── prisma/
            └── schema.prisma     # 新增追踪相关表
```

### 4.3 数据库设计

```prisma
// 新增表：追踪事件日志
model TrackingEvent {
    id          String   @id @default(cuid())
    eventName   String   // page_view, product_view, inquiry_start, inquiry_submit
    sessionId   String   // 用于串联同一用户的多次行为
    source      String?  // utm_source
    medium      String?  // utm_medium
    campaign    String?  // utm_campaign
    content     String?  // utm_content
    referrer    String?  // 来源URL
    userAgent   String?
    ipHash      String?  // IP哈希（不存明文，保护隐私）
    country     String?
    city        String?
    metadata    Json?    // 事件附加数据（产品ID等）
    createdAt   DateTime @default(now())

    @@index([sessionId])
    @@index([eventName])
    @@index([createdAt])
    @@index([source])
}

// 新增表：每日渠道统计（预聚合，加速查询）
model DailyChannelStats {
    id          String   @id @default(cuid())
    date        DateTime @db.Date
    source      String   // youtube, linkedin, google, direct...
    medium      String
    sessions    Int      @default(0)
    pageViews   Int      @default(0)
    inquiries   Int      @default(0)
    bounceRate  Float    @default(0)
    avgDuration Float    @default(0) // 秒

    @@unique([date, source, medium])
    @@index([date])
}
```

### 4.4 GA4集成方案

**步骤1：创建GA4账号和媒体资源**
- 访问 https://analytics.google.com
- 创建账号 → 创建媒体资源 → 选择Web → 填写网站URL
- 获取 Measurement ID（如 G-XXXXXXXXXX）

**步骤2：在Next.js中集成GA4**
```tsx
// apps/web/app/[locale]/layout.tsx
import { Analytics } from '@/lib/analytics'

export default function LocaleLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  )
}
```

**步骤3：创建Analytics组件处理事件**
```tsx
// apps/web/lib/analytics.tsx
'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    // 发送页面浏览事件，自动捕获UTM参数
    window.gtag?.('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
      page_location: window.location.href,
    })
  }, [pathname, searchParams])

  return null
}
```

**步骤4：追踪事件函数**
```tsx
// apps/web/lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  window.gtag?.('event', eventName, params)
}

// 使用示例
trackEvent('product_view', {
  product_id: 'hanging-scale-001',
  product_name: '电子挂钩秤',
  category: '挂钩秤',
})
```

### 4.5 GSC集成方案

Google Search Console 数据通过 API 获取：

```typescript
// apps/api/src/tracking/gsc.service.ts
@Injectable()
export class GoogleSearchConsoleService {
  async getSearchAnalytics(accessToken: string, siteUrl: string) {
    const response = await fetch(
      'https://www.googleapis.com/webmasters/v3/sites/' +
        encodeURIComponent(siteUrl) +
        '/searchAnalytics/query',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: '2026-03-01',
          endDate: '2026-04-14',
          dimensions: ['query', 'page', 'device', 'country'],
          rowLimit: 10000,
        }),
      }
    )
    return response.json()
  }
}
```

### 4.6 Admin仪表盘UI设计

**页面布局：**
```
┌────────────────────────────────────────────────────────────────┐
│  数据分析仪表盘                                    [刷新] [日期]  │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 总访问量 │ │ 询盘总数 │ │ 转化率  │ │  跳出率  │            │
│  │  12,345  │ │    156   │ │  1.26%  │ │  45.2%  │            │
│  │  ↑12.3% │ │  ↑8.5%  │ │  ↑0.2% │ │  ↓2.1% │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
├────────────────────────────────────────────────────────────────┤
│  流量来源分布                    │  渠道对比                      │
│  ┌────────────────────┐         │  ┌─────────────────────┐     │
│  │     [饼图]          │         │  │  [柱状图]            │     │
│  │ 社媒 35%            │         │  │ YouTube ████████    │     │
│  │ 搜索 40%            │         │  │ Google  ██████████  │     │
│  │ 直接 15%            │         │  │ LinkedIn ████       │     │
│  │ 其他 10%            │         │  │ TikTok  ███        │     │
│  └────────────────────┘         │  └─────────────────────┘     │
├────────────────────────────────────────────────────────────────┤
│  热门关键词                                                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 关键词          │ 搜索量  │ 排名  │ 流量  │ 询盘 │        │
│  │ hanging scale   │  1,200  │  #3   │  180  │  8   │        │
│  │ kitchen scale    │    800  │  #5   │   95  │  5   │        │
│  └─────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│  询盘来源明细              │  产品热度TOP 10                    │
│  ┌────────────────────┐    │  ┌─────────────────────────────┐ │
│  │ 来源    │ 数量 │ 占比  │    │  产品名      │ 访问  │ 询盘  │ │
│  │ YouTube │  45  │  29%  │    │  电子台秤     │  500  │  12   │ │
│  │ Google  │  38  │  24%  │    │  挂钩秤       │  350  │   8   │ │
│  │ LinkedIn│  25  │  16%  │    │  厨房秤       │  280  │   7   │ │
│  └────────────────────┘    │  └─────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**技术栈：**
- 使用现有 admin 后台的 Tailwind CSS + shadcn/ui
- 图表库：Recharts（已在项目中安装）
- 数据获取：React Query（已在项目中安装）
- 响应式：支持PC和移动端

---

## 5. UTM追踪实践指南

### 5.1 常用UTM链接模板

**YouTube视频描述链接：**
```
https://ccscale.com?utm_source=youtube&utm_medium=social&utm_campaign=product_demo&utm_content=hanging_scale_2024
```

**LinkedIn帖子链接：**
```
https://ccscale.com/products/hanging-scale?utm_source=linkedin&utm_medium=social&utm_campaign=oem_promotion
```

**TikTok个人主页：**
```
https://ccscale.com?utm_source=tiktok&utm_medium=social&utm_campaign=brand_awareness
```

**Google Ads：**
```
https://ccscale.com/products/kitchen-scale?utm_source=google&utm_medium=cpc&utm_campaign=ppa_kitchen_scale
```

**邮件营销：**
```
https://ccscale.com/products/婴儿秤?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_new_products
```

**WhatsApp分享：**
```
https://ccscale.com?utm_source=whatsapp&utm_medium=social&utm_campaign=direct_contact
```

### 5.2 社媒主页链接配置

| 社媒平台 | 主页链接（带UTM） | 放置位置 |
|---------|-----------------|---------|
| YouTube | `?utm_source=youtube&utm_medium=social` | 所有视频描述 |
| LinkedIn | `?utm_source=linkedin&utm_medium=social` | 公司主页简介 |
| TikTok | `?utm_source=tiktok&utm_medium=social` | 个人主页 |
| Facebook | `?utm_source=facebook&utm_medium=social` | Page简介 |
| Instagram | `?utm_source=instagram&utm_medium=social` | Bio链接 |

### 5.3 追踪链接管理表

运营团队维护一个Excel/Notion表格，记录所有推广链接：

| 链接名称 | 原始URL | UTM完整链接 | 渠道 | 活动 | 创建日期 | 状态 |
|---------|---------|------------|------|------|---------|------|
| 挂钩秤YouTube视频1 | /products/hanging-scale | 带完整UTM | YouTube | product_demo | 2026-04-14 | 活跃 |
| OEM产品线LinkedIn帖子 | /oem | 带完整UTM | LinkedIn | oem_promotion | 2026-04-14 | 活跃 |

---

## 6. 实施计划

### 6.1 分阶段实施

**Phase 1：基础建设（第1周）**
- [ ] 创建Google Analytics 4账号，获取Measurement ID
- [ ] 创建Google Search Console账号，验证网站所有权
- [ ] 在Next.js中集成GA4基础代码
- [ ] 创建Admin后台"数据分析"菜单和基础页面框架
- [ ] 配置环境变量：`NEXT_PUBLIC_GA_ID`

**Phase 2：埋点追踪（第2周）**
- [ ] 实现事件追踪工具函数
- [ ] 在产品页添加product_view事件
- [ ] 在询盘表单添加inquiry_start和inquiry_submit事件
- [ ] 在下载区域添加download_click事件
- [ ] 在WhatsApp按钮添加whatsapp_click事件

**Phase 3：数据库支持（第2-3周）**
- [ ] 更新Prisma schema，添加TrackingEvent和DailyChannelStats表
- [ ] 创建tracking模块API
- [ ] 实现UTM参数解析和存储逻辑
- [ ] 创建每日定时任务聚合统计数据

**Phase 4：Admin仪表盘（第3-4周）**
- [ ] 开发流量概览卡片组件
- [ ] 开发流量来源饼图
- [ ] 开发渠道对比柱状图
- [ ] 开发关键词TOP20表格（对接GSC API）
- [ ] 开发询盘来源分析表
- [ ] 开发产品热度排行
- [ ] 开发转化漏斗图

**Phase 5：UTM实践（第4周）**
- [ ] 整理所有社媒账号的UTM链接
- [ ] 创建追踪链接管理表
- [ ] 制定UTM命名规范文档
- [ ] 培训团队成员使用UTM

**Phase 6：GEO监测（第5周起）**
- [ ] 配置Google Alerts
- [ ] 创建月度GEO检查清单
- [ ] 评估是否需要品牌监测工具

### 6.2 资源估算

| 阶段 | 工作量 | 所需技能 |
|------|--------|---------|
| Phase 1 | 2-3小时 | 基础配置 |
| Phase 2 | 3-4小时 | Next.js开发 |
| Phase 3 | 4-6小时 | NestJS + Prisma |
| Phase 4 | 8-12小时 | React + Recharts |
| Phase 5 | 2-3小时 | 内容整理 |

**总计：约20-30小时开发工作**

---

## 7. 运营使用指南

### 7.1 每日检查（5分钟）

打开Admin仪表盘，查看：
1. 昨日总访问量 vs. 前日
2. 有没有异常流量（比如突然暴增或下跌）
3. 有没有新的询盘，来源是哪里

### 7.2 周度分析（30分钟）

1. 打开GA4，查看"用户获取"报告
2. 对比各渠道流量：YouTube/LinkedIn/Google各有几个访问？
3. 哪个渠道带来的询盘最多？
4. 哪些产品页访问量最高？
5. 记录本周数据到周报

### 7.3 月度复盘（1-2小时）

1. 导出完整月度数据
2. 分析趋势：哪些渠道在增长？哪些在下降？
3. 评估ROI：哪个渠道值得更多投入？
4. 制定下月推广计划
5. 检查GEO表现：AI工具有没有提到你？

### 7.4 决策判断标准

**什么时候加大某个渠道的投入？**
- 该渠道带来的询盘量连续3个月增长
- 该渠道的询盘转化率高于平均值
- 该渠道的访客质量高（停留时间长、浏览页面多）

**什么时候减少某个渠道的投入？**
- 连续2个月没有带来任何询盘
- 流量增长但转化率为0（来了人不买）
- 获客成本高于可接受范围

---

## 8. 预算规划

### 8.1 零成本方案（当前推荐）

| 工具/服务 | 费用 | 说明 |
|----------|------|------|
| Google Analytics 4 | 免费 | 基础分析 |
| Google Search Console | 免费 | SEO数据 |
| Google Tag Manager | 免费 | 标签管理 |
| Google Alerts | 免费 | 品牌监测 |
| Admin自建仪表盘 | 免费 | 利用现有系统 |

**总计：0元**

### 8.2 低成本增强方案（6个月后考虑）

| 工具/服务 | 月费 | 说明 |
|----------|------|------|
| Ahrefs/Weblite | $99/月 | 关键词追踪、竞品分析 |
| Brand24 | $99/月 | 社交媒体监听、AI提及监测 |
| Mixpanel | $0-$49 | 更精细的产品分析 |

---

## 9. 风险与注意事项

### 9.1 数据隐私合规

- 不存储用户IP明文（只存哈希）
- 不追踪个人身份信息（PII）
- 遵守GDPR：欧盟访客需显示Cookie同意横幅
- 隐私政策页面需说明使用了哪些追踪工具

### 9.2 实施风险

| 风险 | 应对措施 |
|------|---------|
| GA4数据延迟 | 知道GA4数据有24-48小时延迟，不用于实时监控 |
| UTM参数丢失 | 确保所有带出去的链接都正确添加UTM |
| 跨设备追踪困难 | 接受限制，主要看总体趋势而非个人路径 |
| 第三方Cookie淘汰 | 未来需考虑first-party data策略 |

### 9.3 常见错误

- UTM参数大小写不一致（统一用小写）
- 链接中有多余的utm_参数被截断（确保完整复制）
- 社媒分享时手动去掉UTM（要培训团队保留）
- 只看流量不看转化（数量≠质量）

---

## 10. 附录

### 10.1 UTM命名规范速查

```
utm_source: youtube | linkedin | tiktok | facebook | instagram | google | newsletter | direct
utm_medium: social | cpc | email | referral | organic
utm_campaign: 活动英文名，使用下划线连接，如 new_product_launch | oem_promo | factory_tour
utm_content: 具体内容标识，如 hanging_scale_demo_v1 | kitchen_scale_hero
```

### 10.2 GA4重要报告路径

- 实时流量：Reports → Realtime
- 用户获取：Reports → Acquisition → Overview / Traffic Acquisition
- 转化追踪：Reports → Conversions
- 事件追踪：Reports → Engagement → Events

### 10.3 参考资料

- GA4官方文档：https://support.google.com/analytics/
- GTM官方文档：https://support.google.com/tagmanager/
- UTM最佳实践：https://support.google.com/analytics/answer/12320909
