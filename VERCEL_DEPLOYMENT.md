# Vercel 部署配置指南

## 环境变量配置

在 Vercel 项目 Settings > Environment Variables 中配置以下变量：

### 必需变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `API_URL` | 后端 API 地址 | `https://api.yourdomain.com` |
| `SITE_URL` | 网站主域名 | `https://yoursite.com` |

### 数据库变量（如使用 Vercel Functions 连接数据库）

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | `postgresql://user:pass@host:5432/db` |
| `DATABASE_URL_UNPOOLED` | 无连接池的数据库 URL（用于 Serverless） | `postgresql://...` |

### 推荐：使用连接池服务

对于 Vercel Serverless 环境的数据库连接，推荐使用：

- **Supabase** - 内置连接池 (PgBouncer)
- **Neon** - Serverless Postgres，自动连接池
- **PlanetScale** - MySQL Serverless 方案
- **Railway** - 提供连接池插件

### 邮件服务变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `SMTP_HOST` | SMTP 服务器 | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP 端口 | `587` |
| `SMTP_USER` | SMTP 用户名 | `your@email.com` |
| `SMTP_PASS` | SMTP 密码/应用密钥 | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | 发件人地址 | `noreply@yourdomain.com` |

### 存储变量（如使用外部 CDN）

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `CLOUDFLARE_R2_ACCOUNT_ID` | Cloudflare R2 账户 ID | `xxxxx` |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 Access Key | `xxxxx` |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | R2 Secret Key | `xxxxx` |
| `R2_BUCKET_NAME` | R2 存储桶名称 | `uploads` |
| `R2_PUBLIC_URL` | R2 公共访问 URL | `https://pub.yourdomain.com` |

## Vercel 项目配置

### 单项目部署（推荐）

将 `apps/web` 作为主项目部署到 Vercel：

```bash
# 在 apps/web 目录中
vercel
```

或使用 Vercel Dashboard：
1. Import Project → 选择 `apps/web` 目录
2. Framework: Next.js
3. Root Directory: `./apps/web`
4. Build Command: `npm run build`
5. Environment Variables: 添加上述变量

### 多项目部署

如需同时部署 admin：

1. 创建两个 Vercel 项目
2. 项目 A (web): 部署 `apps/web`
3. 项目 B (admin): 部署 `apps/admin`

### 环境变量引用

在 `vercel.json` 中使用 `@` 前缀引用环境变量：

```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

## Edge Functions 配置

Edge Functions 在 `apps/web/app/api/edge-demo/` 目录中：

- 自动运行在 Vercel Edge Network
- 内存限制：256MB
- 超时时间：5秒
- 支持地理位置、请求头等 Edge 特定功能

## ISR (增量静态再生) 配置

在需要 ISR 的页面中添加：

```typescript
export const revalidate = 60; // 每 60 秒重新验证
```

## 性能监控

安装 `@vercel/analytics` 后，在 Vercel Dashboard 中查看：

- Core Web Vitals
- 页面性能
- 用户分布
- 转化漏斗

## 常见问题

### Q: Serverless 函数超时？

A: 在 `vercel.json` 中调整：

```json
{
  "functions": {
    "apps/web/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Q: 数据库连接池耗尽？

A: 
1. 使用连接池服务（Supabase/Neon）
2. 设置 `DATABASE_URL_UNPOOLED` 用于 Serverless
3. 减少并发连接数

### Q: 构建失败？

A: 
1. 检查 Node.js 版本 (≥18)
2. 确保 `npm ci` 可以成功
3. 检查 workspace 依赖是否正确

## 推荐的 Vercel 套餐

| 套餐 | 适合场景 | Serverless Functions |
|------|----------|----------------------|
| Hobby | 开发/测试 | 100h/month |
| Pro | 小型生产 | 1000h/month |
| Enterprise | 大型生产 | 无限 |

---
*最后更新：2024*