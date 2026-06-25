# CC Scale B2B Platform

A comprehensive B2B weighing scales e-commerce platform with multi-language support, SEO optimization, and AI-powered features.

## 🚀 Quick Start

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

## 🌐 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Public website |
| Admin Dashboard | http://localhost:3001 | Admin management |
| API Server | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/api/docs | Swagger documentation |

## 📁 Project Structure

```
cc-scale/
├── apps/
│   ├── web/          # Next.js frontend (public website)
│   ├── admin/         # Next.js admin dashboard
│   └── api/           # NestJS REST API
├── packages/
│   └── ui/            # Shared UI components
└── prisma/            # Database schema
```

## 🗄️ Database

- PostgreSQL (running on port 5432)
- Database: ccscale
- Tables: 18 tables including Products, Categories, Users, etc.

## ✅ Tested & Verified

All 27 tests passed (100% success rate):

### Frontend Pages
- ✅ Homepage EN
- ✅ Products Page
- ✅ Product Detail Page
- ✅ About Page
- ✅ Contact Page
- ✅ Blog Page
- ✅ Cases Page
- ✅ Downloads Page
- ✅ OEM Page
- ✅ Chinese Homepage

### Admin Dashboard
- ✅ Login Page
- ✅ Dashboard
- ✅ Products Management
- ✅ Batch Products Import
- ✅ New Product Form
- ✅ Categories Management
- ✅ Inquiries Management
- ✅ Blog Management
- ✅ Downloads Management
- ✅ Users Management
- ✅ Settings
- ✅ Analytics

### API Endpoints
- ✅ Products List
- ✅ Categories List
- ✅ Product by Slug
- ✅ Product Search
- ✅ Swagger Docs

## 🔧 Key Features

1. **Multi-language Support**: English and Chinese
2. **SEO Optimized**: Meta tags, sitemap, robots.txt
3. **AI-Ready**: Structured data for AI search engines
4. **B2B Features**: MOQ, FOB pricing, OEM/ODM
5. **Batch Import**: CSV-based product bulk import
6. **Real-time Analytics**: Traffic and inquiry tracking

## 📦 Deployment

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

## 📊 Media Storage Costs

For high-traffic scenarios with many images, videos, and PDFs:

| Provider | Free Tier | Paid |
|----------|-----------|------|
| Vercel Blob | 5GB | $20/100GB |
| Cloudflare R2 | 10GB | $5/100GB |
| AWS S3 | 5GB | $23/100GB |
| Backblaze B2 | 10GB | $6/100GB |

**Recommendation**: Use Cloudflare R2 with Images for cost-effective media storage.

## 🛠️ Troubleshooting

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

## 📝 Batch Product Import

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

Built with ❤️ for the global B2B weighing scales market.