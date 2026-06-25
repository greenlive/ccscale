# CC Scale 部署架构(B2B 外贸独立站 · ≤ 1000 SKU)

> 本文档基于工程级 Code Review 后的代码基线(vercel.json / apps/api/railway.toml / .github/workflows/deploy.yml / Prisma 22 个索引)给出生产级部署架构。目标:全球 B2B 买家访问、海外询盘转化、运营成本可控(< $50/月起步,<$300/月成长阶段)。

---

## 1. 架构总览

### 1.1 流量与组件

```mermaid
flowchart TB
  Visitor((海外买家<br/>欧美/中东/东南亚))
  CF[Cloudflare<br/>DNS + CDN + WAF + Turnstile]
  VercelWeb[Vercel · Next.js<br/>www.ccscale.com<br/>fra1 region]
  VercelAdmin[Vercel · Next.js Admin<br/>admin.ccscale.com]
  Railway[Railway · NestJS API<br/>api.ccscale.com]
  Neon[(Neon Postgres<br/>分支 + Scale-to-Zero)]
  Upstash[(Upstash Redis<br/>限流 + Session)]
  R2[Cloudflare R2<br/>产品图 / 证书 / 视频]
  Resend[Resend<br/>询盘事务邮件]
  Sentry[Sentry<br/>错误追踪]
  GA[GA4 + GSC<br/>SEO 监控]

  Visitor -->|HTTPS| CF
  CF -->|/en /zh /products/*| VercelWeb
  CF -->|/admin| VercelAdmin
  VercelWeb -->|/api/* rewrite| Railway
  VercelAdmin -->|/api/* rewrite| Railway
  VercelWeb -->|/uploads/*| R2
  Railway --> Neon
  Railway --> Upstash
  Railway --> R2
  Railway --> Resend
  Railway --> Sentry
  VercelWeb --> GA
```

### 1.2 域名规划

| 域名 | 用途 | 部署目标 | 备注 |
|---|---|---|---|
| ccscale.com | 根域 | Cloudflare 301 → www | 主品牌 |
| www.ccscale.com | 营销站 | Vercel | Next.js + next-intl |
| admin.ccscale.com | 后台 | Vercel 独立项目 | Next.js admin 路由 |
| api.ccscale.com | 后端 API | Railway | NestJS + Prisma |
| media.ccscale.com | 静态资源 | Cloudflare R2 公开桶 | 产品图、PDF 证书 |
| mail.ccscale.com | MX | Resend / Cloudflare Email Routing | noreply@ |

---

## 2. 选型理由

### 2.1 前端:Vercel(fra1 区域)

- Next.js 原生:ISR、generateStaticParams、Edge Runtime、Image Optimization 全部开箱即用
- 欧洲边缘节点(fra1):核心客户群在德国、意大利、法国、英国、荷兰,延迟 < 50ms
- 零运维:无服务器、PR Preview、自带 CDN、HTTPS 证书自动续期
- 价格:Hobby 免费,Pro $20/seat(含团队 Analytics);流量中等(< 1TB/月)不加费

> Vercel 不适合长驻 API(Node 函数冷启动 + 单 region),所以 API 拆出。

### 2.2 API:Railway(Docker / Nixpacks)

- 常驻进程:NestJS + Prisma + BullMQ worker,长连接、文件流上传
- 欧洲区域:Railway 部署到 europe-west4(阿姆斯特丹),与 Vercel fra1 同洲
- 零配置 Dockerfile:已有 apps/api/railway.toml + Nixpacks 自动 build
- 价格:Hobby $5/月(500 小时 + $0.000231/GB-min),生产 ~$15-25/月(1GB RAM 常驻)

### 2.3 数据库:Neon Serverless Postgres

- Scale-to-Zero:无访问时 0 成本,适合 B2B 询盘低频场景(白天欧美高峰,夜间东南亚,凌晨空闲)
- 分支功能:main ← preview ← feature/*,PR 自动创建分支库
- 与 Prisma 完美兼容:DATABASE_URL 直连,支持连接池(?pgbouncer=true&connection_limit=1)
- 价格:Free 0.5GB(开发用),Launch $19/月(10GB 存储 + 191.9 小时 compute)

### 2.4 Redis:Upstash Redis

- 全球低延迟:HTTP / REST API,无 TCP 长连接(适合 Serverless)
- 按请求计费:$0.2/100K 请求,起步 < $1/月
- 用途:NestJS Throttler 限流计数器、Session、Cache(产品列表 5 分钟缓存)

### 2.5 对象存储:Cloudflare R2

- 零出口流量费:media.ccscale.com 通过 Cloudflare CDN 边缘返回,没有 AWS S3 那种 $0.09/GB 出口费
- S3 兼容 API:Prisma 之外,可用 @aws-sdk/client-s3 直传
- 用途:产品图(原图 + 缩略图)、PDF 证书(CE / RoHS / ISO)、客户案例视频 MP4

### 2.6 邮件:Resend

- 开发者友好:React Email 模板、SPF/DKIM 自动配置
- 送达率:欧美主要邮箱(Gmail / Outlook)送达率 > 99%
- 价格:Free 100 封/天,$20/月 50K 封,满足 ≤1000 SKU B2B 询盘量(预估月询盘 200-500 封)
- 配合 apps/api/src/notifications/email.service.ts(已修复 HTML 注入)

### 2.7 CAPTCHA:Cloudflare Turnstile(已集成)

- 隐私友好:不收集用户指纹,GDPR 合规(欧洲买家必看)
- 免费:不限量
- 已接入:apps/api/src/common/turnstile.service.ts + apps/web/components/Turnstile.tsx

### 2.8 监控:Sentry + GA4 + Google Search Console

- Sentry:@sentry/nextjs 已配置,@sentry/nestjs 需加
- GA4:B2B 关键指标:询盘提交数、热门产品、国家分布、跳出率
- GSC:https://www.ccscale.com/sitemap.xml 提交,监控收录与 hreflang 错误

---

## 3. ≤ 1000 SKU 优化策略

B2B 外贸独立站的特点:SKU 数量稳定、流量集中在工作日欧美时段、夜间/周末低负载。架构针对这个曲线做了缩容到 0 设计。

### 3.1 数据层

- **Postgres**:Neon Launch plan,无连接 5 分钟后挂起,冷启动 ~500ms
- **Redis**:Upstash Pay-as-you-go,空闲 0 成本
- **静态资源**:全部走 R2 + CDN,产品图懒加载(<img loading="lazy" decoding="async" />)
- **询盘记录**:近 90 天 Neon,历史归档 R2 Parquet(将来)

### 3.2 计算层

- **Vercel ISR**:revalidate = 3600(产品详情)、revalidate = 600(首页),每小时最多 1 次重新渲染
- **generateStaticParams**:只预渲染 top 100 活跃产品(已实现),其余按需 ISR
- **Railway 缩容**:Hobby plan 1 instance $5/月常驻,生产 plan 用 autoscale(1-3 instance)
- **图片优化**:next/image 自动 WebP/AVIF 转换 + 响应式 srcset,Vercel 全球 CDN 边缘缓存

### 3.3 产品数据规模假设

- 活跃产品:≤ 1000
- 类别:≤ 20
- 单产品图:平均 5 张,共 ~5000 张
- 单产品详情页大小:200KB(含图),CDN 缓存后 0KB 出站
- 月询盘量:200-500 封
- 月独立访客:5K-50K

### 3.4 性能预算

- **LCP** < 2.0s(目标 1.5s,产品详情页)
- **INP** < 150ms
- **CLS** < 0.05
- **TTFB** < 300ms(欧洲边缘)
- **JS bundle** < 180KB gzipped(首页)

---

## 4. 环境与配置

### 4.1 环境变量(API · Railway)

```bash
NODE_ENV=production
PORT=8000
SITE_URL=https://www.ccscale.com
API_URL=https://api.ccscale.com

JWT_SECRET=<openssl rand -base64 48>
COOKIE_SECRET=<openssl rand -base64 48>
COOKIE_DOMAIN=.ccscale.com
COOKIE_SECURE=true

DATABASE_URL=postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/ccscale?sslmode=require&pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/ccscale?sslmode=require

REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379

RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@mail.ccscale.com
ADMIN_EMAIL=sales@ccscale.com

TURNSTILE_SITE_KEY=0x4AAAA...
TURNSTILE_SECRET_KEY=0x4AAAA...

R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET=ccscale-media
R2_PUBLIC_URL=https://media.ccscale.com

UPLOAD_MAX_SIZE_MB=20
CORS_ORIGIN=https://www.ccscale.com,https://admin.ccscale.com
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 4.2 环境变量(Web · Vercel)

```bash
NEXT_PUBLIC_API_URL=https://api.ccscale.com
NEXT_PUBLIC_SITE_URL=https://www.ccscale.com
NEXT_PUBLIC_MEDIA_URL=https://media.ccscale.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...
NEXT_PUBLIC_WHATSAPP_NUMBER=+8613800000000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 4.3 环境变量(Admin · Vercel)

```bash
NEXT_PUBLIC_API_URL=https://api.ccscale.com
NEXT_PUBLIC_SITE_URL=https://admin.ccscale.com
COOKIE_DOMAIN=.ccscale.com
```

---

## 5. 部署步骤(2 周落地)

### 第 1 周:基础设施

| 天 | 任务 | 责任 |
|---|---|---|
| D1 | 注册 Cloudflare / Vercel / Railway / Neon / Upstash / R2 / Resend / Sentry 账号,绑定 GitHub | DevOps |
| D1 | 域名 ccscale.com 转入 Cloudflare,配置 DNS 记录(A / CNAME / MX) | DevOps |
| D2 | Neon 创建 ccscale 项目,main + preview 分支 | DevOps |
| D2 | Upstash 创建 Global Redis(欧洲区域) | DevOps |
| D3 | R2 创建 ccscale-media 公开桶,绑定 media.ccscale.com 自定义域 | DevOps |
| D3 | Resend 域名验证,配置 SPF / DKIM / DMARC | DevOps |
| D4 | Cloudflare Turnstile 站点创建,获得 site key + secret | DevOps |
| D4 | Sentry 项目 cc-scale-web / cc-scale-api 创建 | DevOps |
| D5 | 数据库迁移:railway run npx prisma migrate deploy(22 个索引) | Backend |

### 第 2 周:代码部署

| 天 | 任务 | 责任 |
|---|---|---|
| D6 | API 上 Railway:连接 GitHub main 分支,设置环境变量,健康检查 /api/health | Backend |
| D7 | Seed 管理员账号:ALLOW_SEED=1 railway run npx prisma db seed(生产守卫已加) | Backend |
| D7 | API 烟雾测试:curl https://api.ccscale.com/api/health + /api/products?locale=en | Backend |
| D8 | Web 上 Vercel:import GitHub repo,Root Directory = apps/web,region fra1 | Frontend |
| D8 | 绑定域名 www.ccscale.com(Vercel 自动 TLS) | DevOps |
| D9 | Admin 上 Vercel(独立 project / 同一 repo 不同 root) | Frontend |
| D9 | vercel.json 验证:API rewrite → api.ccscale.com,uploads → media.ccscale.com | DevOps |
| D10 | Cloudflare 配置:SSL = Full Strict,Brotli,Always HTTPS,HSTS 1年 | DevOps |
| D10 | 缓存规则:/uploads/* Cache Standard,/_next/static/* Cache Immutable | DevOps |
| D11 | SEO 提交:Google Search Console 提交 sitemap, Bing Webmaster, Yandex | SEO |
| D11 | GSC 验证:https://www.ccscale.com 域验证(DNS TXT) | SEO |
| D12 | E2E 测试:Playwright 跑 apps/web/e2e/ 全套(询盘提交、登录、WhatsApp 浮窗) | QA |
| D12 | 性能验证:PageSpeed Insights / WebPageTest 全球节点,目标 LCP < 2s | QA |
| D13 | 监控告警:Sentry 告警 → Slack,Neon / Upstash storage 告警 → Email | DevOps |
| D14 | 灰度发布:Cloudflare Workers 5% → 50% → 100%(可选) | DevOps |

### 2 周后的日常运营

- 代码合并:main → Vercel 自动 + Railway 自动(GitHub Actions 仅做迁移)
- 新功能:feature/* → Vercel Preview + Neon Branch
- 回滚:Vercel / Railway 各自 dashboard 一键 rollback
- 数据备份:Neon 自动每日 backup(7 天保留),WAL 归档到 R2(可选)

---

## 6. CI/CD 流程

已存在的 .github/workflows/deploy.yml(本仓库):

```yaml
# Web → Vercel CLI(自动)
# API → Railway Webhook(GitHub push 触发)
# DB → 手动或 prisma migrate deploy via Railway shell
```

建议加 3 个 GitHub Actions:

1. **CI Lint/Test**(每次 PR):pnpm install / pnpm turbo run lint test / node scripts/check-bom.mjs
2. **CD Deploy**(merge to main):Web Vercel 自动 / API Railway webhook
3. **DB Migration**(手动 dispatch):railway run npx prisma migrate deploy

---

## 7. 成本估算(USD · 月)

### 7.1 起步阶段(< 1 万 PV / 月,≤ 1000 SKU)

| 服务 | 计划 | 月费用 |
|---|---|---|
| Vercel Web | Hobby | $0 |
| Vercel Admin | Hobby | $0 |
| Railway API | Hobby 1 instance | $5 |
| Neon Postgres | Free(0.5GB) | $0 |
| Upstash Redis | Pay-as-you-go | $0(~ 100K req) |
| Cloudflare R2 | Free(10GB + 1K 万次读) | $0 |
| Cloudflare CDN / DNS | Free | $0 |
| Resend | Free(100 封/天) | $0 |
| Cloudflare Turnstile | Free | $0 |
| Sentry | Developer(5K 事件/月) | $0 |
| **小计** | | **≈ $5 / 月**(纯 Free) |

> **生产推荐预算 ~$36/月**:Vercel Pro $20 + Railway $5 + Neon Launch $19 的安全余量。Free plan 在生产不推荐(冷启动慢、SLA 无保证)。

### 7.2 成长阶段(10 万 PV / 月)

| 服务 | 计划 | 月费用 |
|---|---|---|
| Vercel Web | Pro | $20 |
| Vercel Admin | Pro | $20 |
| Railway API | Pro 1-2 instance | $25 |
| Neon Postgres | Launch(10GB) | $19 |
| Upstash Redis | Pay-as-you-go | $10 |
| Cloudflare R2 | Pay-as-you-go(100GB) | $3 |
| Cloudflare Pro | Pro(更细 WAF 规则) | $20 |
| Resend | Pro(50K 封) | $20 |
| Sentry | Team(50K 事件) | $26 |
| **小计** | | **≈ $163 / 月** |

### 7.3 规模化阶段(100 万 PV / 月)

| 服务 | 计划 | 月费用 |
|---|---|---|
| Vercel Web + Admin | Enterprise | $250+ |
| Railway API | 3 instance autoscale | $75 |
| Neon Postgres | Scale(50GB) | $69 |
| Upstash Redis | Pro | $30 |
| Cloudflare R2 | 1TB | $15 |
| Cloudflare Pro | Pro | $20 |
| Resend | Scale | $90 |
| Sentry | Business | $80 |
| **小计** | | **≈ $630 / 月** |

---

## 8. 安全清单(部署后必检)

- [x] JWT_SECRET ≥ 32 字符且不提交到 Git(apps/api/src/config/configuration.ts 已强制)
- [x] Cookie httpOnly + secure + sameSite=none(生产)
- [x] Cloudflare Turnstile 启用(询盘 / 登录)
- [x] Rate limiting:Throttler 短窗 30 req/min、Login 5 req/min
- [x] Magic bytes 二次校验(图片 / PDF / 视频)
- [x] HTML escape 邮件模板
- [x] HSTS / X-Frame-Options / X-Content-Type-Options(vercel.json headers)
- [ ] CSP(Content-Security-Policy)— 待加,见 Code Review Medium 项
- [x] CORS 白名单(只允许 ccscale.com 域)
- [x] Prisma 22 个索引(防慢查询 DoS)
- [x] 文件路径遍历防护(/^[A-Za-z0-9._-]{1,200}$/)
- [x] Seed 生产守卫(NODE_ENV=production && ALLOW_SEED!=1 抛错)

---

## 9. 灾备与监控

### 9.1 备份

- **Neon**:自动每日 backup(7 天保留),可一键 PITR
- **R2**:开启 versioning,误删可恢复
- **代码**:GitHub main + PR 永久保留
- **配置**:1Password / Bitwarden 团队保险库存所有环境变量 + 服务凭据

### 9.2 监控告警

| 指标 | 阈值 | 通知渠道 |
|---|---|---|
| API 5xx 错误率 | > 1% | Sentry → Slack #alerts |
| API p95 延迟 | > 1s | Sentry → Slack |
| Neon 连接数 | > 80% | Neon dashboard → Email |
| Railway CPU | > 80% 持续 5min | Railway → Slack |
| Cloudflare 5xx | > 0.1% | Cloudflare → Email |
| Sentry 新 issue | 立即 | Slack #frontend |
| 询盘数 / 天 | < 5(下跌 50%) | Email sales@ |

### 9.3 Runbook(出问题时)

- **API 5xx 飙升**:Sentry 看 issue → Railway rollback → 查 Neon 连接池
- **Web 502**:Vercel status → check vercel.json rewrites → curl api.ccscale.com/api/health
- **询盘收不到**:Resend dashboard → 检查 spam → 检查 SPF/DKIM
- **图片 404**:R2 dashboard → 检查 bucket policy → 检查 R2_PUBLIC_URL env

---

## 10. 上线前必检清单(Go-Live Checklist)

### Critical(必须 0 问题)

- [ ] JWT_SECRET + COOKIE_SECRET 在 Railway 强密码生成并保存
- [ ] Neon prisma migrate deploy 成功(22 个索引创建)
- [ ] R2 bucket 公共读权限开启,media.ccscale.com 解析正确
- [ ] Cloudflare SSL = Full Strict(不是 Flexible)
- [ ] DNS:www → Vercel,api → Railway,media → R2
- [ ] HTTPS 重定向:HTTP → 301 → HTTPS
- [ ] HSTS header(Strict-Transport-Security: max-age=31536000; includeSubDomains; preload)

### High(必须完成)

- [ ] Resend 域名验证 + SPF/DKIM/DMARC
- [ ] Turnstile site key + secret 在 web / api 环境变量都有
- [ ] Sentry DSN web + api 都有,Source Map 上传
- [ ] GA4 + GSC 验证通过
- [ ] Sitemap(/sitemap.xml) 包含所有产品页 + 博客,无 404
- [ ] Hreflang 标签正确(en/zh 互相指向)
- [ ] robots.txt 不阻止 /api/ 或 /_next/
- [ ] WhatsApp 浮窗 NEXT_PUBLIC_WHATSAPP_NUMBER 配好

### Medium(尽量完成)

- [ ] Cloudflare Page Rules:/uploads/* Cache Everything
- [ ] prisma generate 在 CI 跑通
- [ ] E2E 测试通过(询盘 → 邮件到达)
- [ ] Lighthouse 分数:Performance > 90, SEO > 95, Accessibility > 95, Best Practices > 95
- [ ] Core Web Vitals 全部 Good(75th percentile)

### Low(可后续优化)

- [ ] Cloudflare Workers 灰度发布
- [ ] CSP header 加 nonce
- [ ] 多语言扩展(德 / 法 / 西班牙)
- [ ] 询盘 AI 智能分发(按区域)
- [ ] PWA / Offline 模式

---

## 11. 风险与回滚

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| Neon 区域故障 | 极低 | 数据库不可用 | Neon 自动 PITR + Read Replica(Scale 计划) |
| Railway instance 挂掉 | 低 | API 503 | Railway 自动 restart + autoscale(1-3 instance) |
| Vercel 部署失败 | 低 | Web 503 | Vercel 自动 rollback 到上一个成功部署 |
| Cloudflare 故障 | 极低 | CDN / DNS 不可用 | 切到 Cloudflare 备用账号 / 临时用 NS 直指 Vercel |
| 询盘邮件丢 | 低 | 客户流失 | Resend 失败重试 + 备份通道 Slack Webhook |
| R2 桶删除 | 极低 | 静态资源全挂 | R2 versioning + Neon 存原始文件 hash |

---

## 12. 文档与链接

- Cloudflare Dashboard:https://dash.cloudflare.com
- Vercel Dashboard:https://vercel.com/dashboard
- Railway Dashboard:https://railway.app/dashboard
- Neon Console:https://console.neon.tech
- Upstash Console:https://console.upstash.com
- Cloudflare R2:https://dash.cloudflare.com/?to=/:account/r2
- Resend Dashboard:https://resend.com/dashboard
- Sentry:https://sentry.io
- Google Search Console:https://search.google.com/search-console
- Bing Webmaster:https://www.bing.com/webmasters
- PageSpeed Insights:https://pagespeed.web.dev
- WebPageTest:https://www.webpagetest.org
- Schema Markup Validator:https://validator.schema.org
- Hreflang Tags Testing Tool:https://hreflang.ninja
- Cloudflare Turnstile:https://dash.cloudflare.com/?to=/:account/turnstile

---

> **最后更新**:与代码基线同步(vercel.json / railway.toml / Prisma 22 索引 / Turnstile 集成)
> **维护者**:DevOps + Backend
> **审查周期**:每次架构变更后 1 周内 review
