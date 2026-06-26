# CC Scale B2B Platform

A comprehensive B2B weighing scales e-commerce platform with multi-language support, SEO optimization, and AI-powered features.

## 馃殌 Quick Start

### Option 1: Use the Start Script (Recommended)
```batch
Double-click: start-dev.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Frontend
cd apps/web && npm run dev

# Terminal 2 - Admin Dashboard
cd apps/admin && npm run dev

# Terminal 3 - API Server
cd apps/api && npm run dev
```

## 馃寪 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Public website |
| Admin Dashboard | http://localhost:3001 | Admin management |
| API Server | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/api/docs | Swagger documentation |

## 馃搧 Project Structure

```
cc-scale/
鈹溾攢鈹€ apps/
鈹?  鈹溾攢鈹€ web/          # Next.js frontend (public website)
鈹?  鈹溾攢鈹€ admin/         # Next.js admin dashboard
鈹?  鈹斺攢鈹€ api/           # NestJS REST API
鈹溾攢鈹€ packages/
鈹?  鈹斺攢鈹€ ui/            # Shared UI components
鈹斺攢鈹€ prisma/            # Database schema
```

## 馃梽锔?Database

- PostgreSQL (running on port 5432)
- Database: zzscale
- Tables: 18 tables including Products, Categories, Users, etc.

## 鉁?Tested & Verified

All 27 tests passed (100% success rate):

### Frontend Pages
- 鉁?Homepage EN
- 鉁?Products Page
- 鉁?Product Detail Page
- 鉁?About Page
- 鉁?Contact Page
- 鉁?Blog Page
- 鉁?Cases Page
- 鉁?Downloads Page
- 鉁?OEM Page
- 鉁?Chinese Homepage

### Admin Dashboard
- 鉁?Login Page
- 鉁?Dashboard
- 鉁?Products Management
- 鉁?Batch Products Import
- 鉁?New Product Form
- 鉁?Categories Management
- 鉁?Inquiries Management
- 鉁?Blog Management
- 鉁?Downloads Management
- 鉁?Users Management
- 鉁?Settings
- 鉁?Analytics

### API Endpoints
- 鉁?Products List
- 鉁?Categories List
- 鉁?Product by Slug
- 鉁?Product Search
- 鉁?Swagger Docs

## 馃敡 Key Features

1. **Multi-language Support**: English and Chinese
2. **SEO Optimized**: Meta tags, sitemap, robots.txt
3. **AI-Ready**: Structured data for AI search engines
4. **B2B Features**: MOQ, FOB pricing, OEM/ODM
5. **Batch Import**: CSV-based product bulk import
6. **Real-time Analytics**: Traffic and inquiry tracking

## 馃摝 Deployment

### Vercel (Recommended for Frontend)
```bash
npm i -g vercel
vercel --prod
```

### Railway/Render (Recommended for API)
Deploy the NestJS API to Railway or Render

### Cloudflare (Alternative)
- Use Cloudflare Pages for frontend
- Use Cloudflare Workers for edge functions

## 馃搳 Media Storage Costs

For high-traffic scenarios with many images, videos, and PDFs:

| Provider | Free Tier | Paid |
|----------|-----------|------|
| Vercel Blob | 5GB | $20/100GB |
| Cloudflare R2 | 10GB | $5/100GB |
| AWS S3 | 5GB | $23/100GB |
| Backblaze B2 | 10GB | $6/100GB |

**Recommendation**: Use Cloudflare R2 with Images for cost-effective media storage.

## 馃洜锔?Troubleshooting

### Port Already in Use
```bash
netstat -ano | findstr ":3000"
taskkill /PID <pid> /F
```

### Clean Build
```bash
rmdir /s /q apps\web\.next
rmdir /s /q apps\admin\.next
npm run dev
```

## 馃摑 Batch Product Import

1. Go to: http://localhost:3001/products/batch
2. Download the CSV template
3. Fill in product data
4. Upload the CSV file

### CSV Template Fields
- `sku` - Product SKU (required)
- `name_en` - English name (required)
- `name_zh` - Chinese name (required)
- `slug` - URL slug (required)
- `category_slug` - Category slug (required)
- `price_min` - Minimum price
- `price_max` - Maximum price
- `moq` - Minimum order quantity
- `is_active` - Active status (1/0)

---

Built with 鉂わ笍 for the global B2B weighing scales market.