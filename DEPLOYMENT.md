# CC Scale 部署指南

## 部署架构

`
Cloudflare (CDN/DNS)
    │
    ▼
┌───────────────────────────────────────────────┐
│  Vercel - Web 前端                           │
│  https://www.ccscale.com                      │
│  - Next.js SSR/ISR                            │
│  - 全球边缘分发                                │
│  - next-intl 多语言                            │
└───────────────────────────────────────────────┘
    │
    │ API 请求
    ▼
┌───────────────────────────────────────────────┐
│  Railway - API 后端                           │
│  https://api-ccscale.up.railway.app           │
│  - NestJS REST API                           │
│  - Prisma ORM                                │
│  - JWT 认证                                   │
└───────────────────────────────────────────────┘
    │
    ├── PostgreSQL (Railway 托管)
    ├── Redis (Railway 托管)
    └── Meilisearch (可选 Railway 插件)
`

## 前置准备

### 1. 注册账号

- [Vercel](https://vercel.com) - GitHub 登录
- [Railway](https://railway.app) - GitHub 登录
- [Cloudflare](https://cloudflare.com) - 免费账号

### 2. Fork 项目到 GitHub

`ash
# 如果还没有 GitHub 仓库
git init
git add .
git commit -m ""Initial commit: CC Scale B2B platform""
git remote add origin https://github.com/YOUR_USERNAME/cc-scale.git
git push -u origin main
`

---

## 部署步骤

### 第一阶段：部署后端 API (Railway)

#### 1. 创建 Railway 项目

1. 登录 [Railway](https://railway.app)
2. 点击 ""New Project"" → ""Deploy from GitHub repo""
3. 选择 cc-scale 仓库
4. 选择 pps/api 作为根目录

#### 2. 配置环境变量

在 Railway 项目设置中添加以下环境变量：

`
DATABASE_URL=postgresql://user:password@host:5432/ccscale
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
NODE_ENV=production
PORT=8000

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# CORS (Vercel 部署后的URL)
CORS_ORIGIN=https://www.ccscale.com,https://ccscale.vercel.app
`

#### 3. 添加数据库

1. Railway Dashboard → Add Plugin → PostgreSQL
2. Railway 会自动设置 DATABASE_URL
3. 运行数据库迁移：
   `ash
   cd apps/api
   npx prisma migrate deploy
   npx prisma db seed  # 种子数据
   `

#### 4. 添加 Redis (可选)

1. Railway Dashboard → Add Plugin → Upstash Redis
2. 或使用 Railway 自带的 Redis 插件

#### 5. 获取 API URL

部署成功后，Railway 会提供类似 https://api-ccscale.up.railway.app 的 URL。

---

### 第二阶段：部署前端 (Vercel)

#### 1. 创建 Vercel 项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 ""Add New"" → ""Project""
3. 选择 cc-scale 仓库
4. 配置构建设置：

`
Framework Preset: Next.js
Root Directory: apps/web
Build Command: npm run build --filter=@cc-scale/web
Output Directory: .next
Install Command: npm ci
`

#### 2. 配置环境变量

`
NEXT_PUBLIC_API_URL=https://api-ccscale.up.railway.app
NEXT_PUBLIC_WEB_URL=https://www.ccscale.com
NODE_ENV=production
`

#### 3. 添加自定义域名

1. 项目 Settings → Domains
2. 添加 www.ccscale.com
3. 添加 ccscale.com (重定向到 www)

---

### 第三阶段：配置 Cloudflare

#### 1. 添加域名

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 添加 ccscale.com 域名
3. 更新域名注册商的 NS 服务器

#### 2. 配置 DNS

`
Type    Name    Content                 Proxy Status
A       @       [Railway IP]           DNS Only
A       api     [Railway IP]           DNS Only
CNAME   www     c-scale-web.vercel.app CDN
`

#### 3. 设置页面规则

1. 强制 HTTPS
2. 缓存优化
3. 安全设置

---

## 验证部署

### 检查清单

- [ ] 前端 https://www.ccscale.com/en 可访问
- [ ] 中文版 https://www.ccscale.com/zh 可访问
- [ ] API https://api-ccscale.up.railway.app/api/health 返回 200
- [ ] 产品页面正确加载
- [ ] 图片正常显示
- [ ] 多语言切换正常
- [ ] Schema.org 结构化数据有效
- [ ] robots.txt 可访问

### SEO 验证

`ash
# 检查 sitemap
curl https://www.ccscale.com/en/sitemap.xml

# 检查 robots.txt
curl https://www.ccscale.com/robots.txt

# 检查 hreflang
curl -I https://www.ccscale.com/en | grep -i link
`

---

## 监控和维护

### Vercel Analytics

1. 项目 Settings → Analytics
2. 查看 Core Web Vitals 数据

### Railway 监控

1. Railway Dashboard → 项目 → Metrics
2. 查看请求量、响应时间、错误率

### 错误追踪

- Sentry 已配置在 Next.js 中
- 设置 Sentry DSN 环境变量

---

## 更新部署

### 自动部署

Vercel 和 Railway 都支持 GitHub 集成，代码推送到 main 分支后自动部署。

### 手动部署

`ash
# Vercel
cd apps/web
vercel --prod

# Railway
railway up
`

---

## 成本估算

| 服务 | 方案 | 月费用 |
|------|------|--------|
| Vercel | Hobby |  |
| Railway | Starter |  (1000 小时) |
| Cloudflare | Free |  |
| **总计** | | **/月** |

> 如果流量不大，Railway 的免费额度（500小时/月）通常够用。

---

## 故障排除

### 前端构建失败

`ash
# 本地测试构建
npm run build --filter=@cc-scale/web
`

### API 连接失败

1. 检查 NEXT_PUBLIC_API_URL 是否正确
2. 检查 Railway 的 CORS 配置
3. 查看 Railway 日志

### 数据库连接问题

`ash
# Railway 中连接数据库
railway run psql 

# 运行迁移
railway run npx prisma migrate deploy
`

---

## 快速链接

- [Vercel 文档](https://vercel.com/docs)
- [Railway 文档](https://docs.railway.app)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)