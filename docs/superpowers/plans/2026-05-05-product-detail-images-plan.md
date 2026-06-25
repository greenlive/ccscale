# 产品主图与详情图展示 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 重构产品图片展示系统，将产品主图、详情图、产品视频分开独立存储，前端页面采用阿里巴巴风格布局展示。

**架构:**
1. **API/数据库层** - 修改Prisma Schema，将 `mainImages`, `detailImages`, `videos` 存储为JSON数组字符串
2. **前端主图组件** - 重构 `ProductGallery` 为左侧缩略图+右侧大图布局，支持放大镜效果
3. **前端详情图组件** - 新建垂直堆叠详情图展示组件
4. **Admin管理页面** - 更新添加/编辑/浏览产品页面，支持三个独立上传区域

**技术栈:** Next.js 14, NestJS, Prisma, TypeScript, Tailwind CSS

---

## 文件结构

```
apps/
├── api/
│   └── src/
│       ├── products/
│       │   ├── dto/product.dto.ts          [修改]
│       │   ├── products.service.ts         [修改]
│       │   └── products.controller.ts      [修改]
│       └── ...
│
packages/database/prisma/
│   └── schema.prisma                       [修改]
│
web/
├── components/
│   ├── ProductGallery.tsx                  [重构]
│   └── product/
│       └── ProductDetailImages.tsx         [新建]
├── app/[locale]/products/[slug]/
│   └── page.tsx                            [修改]
└── lib/api/queries.ts                      [修改]
│
admin/app/products/
│   ├── new/page.tsx                        [修改]
│   ├── [id]/edit/page.tsx                  [修改]
│   └── [id]/page.tsx                       [修改]
└── components/FileUpload.tsx               [可能修改]
```

---

## 实现任务

### Task 1: 修改数据库Schema

**文件:** `packages/database/prisma/schema.prisma`

**修改内容:**
1. 在 `Product` 模型中添加：
   - `mainImages String?` - JSON数组存储产品主图URLs (1-6张)
   - `detailImages String?` - JSON数组存储详情图URLs (0-8张)
   - `videos String?` - JSON数组存储视频URLs (0-3个)

2. 保留现有字段用于向后兼容：
   - `mainImage String?` - 保留（可选，后续可移除）
   - `videoUrl String?` - 保留（可选，后续可移除）

```prisma
// Product model 添加字段
mainImages String?   // JSON数组: ["url1", "url2", ...]
detailImages String? // JSON数组: ["url1", "url2", ...]
videos String?       // JSON数组: ["url1", "url2", ...]
```

- [ ] **Step 1: 修改 schema.prisma**

```prisma
// 在 Product 模型中添加以下字段（约 line 61 后面）
mainImages String?   // JSON数组存储产品主图URLs
detailImages String? // JSON数组存储详情图URLs
videos String?       // JSON数组存储视频URLs
```

- [ ] **Step 2: 生成Prisma Client**

```bash
cd packages/database && npx prisma generate
```

- [ ] **Step 3: 提交更改**

```bash
git add packages/database/prisma/schema.prisma
git commit -m "feat(product): add mainImages, detailImages, videos fields to Product model"
```

---

### Task 2: 修改 Product DTO

**文件:** `apps/api/src/products/dto/product.dto.ts`

**修改内容:** 添加新的字段定义

- [ ] **Step 1: 添加新的DTO字段**

在 `CreateProductDto` 和 `UpdateProductDto` 中添加：

```typescript
// 产品主图 (1-6张)
@ApiPropertyOptional()
@IsString()
@IsOptional()
mainImages?: string;  // JSON数组字符串

// 产品详情图 (0-8张)
@ApiPropertyOptional()
@IsString()
@IsOptional()
detailImages?: string;  // JSON数组字符串

// 产品视频 (0-3个)
@ApiPropertyOptional()
@IsString()
@IsOptional()
videos?: string;  // JSON数组字符串
```

- [ ] **Step 2: 移除或标记旧字段为可选**

保留 `mainImage` 和 `videoUrl` 作为可选字段（向后兼容）

- [ ] **Step 3: 提交更改**

```bash
git add apps/api/src/products/dto/product.dto.ts
git commit -m "feat(api): add mainImages, detailImages, videos to ProductDto"
```

---

### Task 3: 修改 ProductsService

**文件:** `apps/api/src/products/products.service.ts`

**修改内容:** 处理新字段的创建和更新逻辑

- [ ] **Step 1: 修改 create 方法**

在 `create` 方法中处理 `mainImages`, `detailImages`, `videos` 字段

- [ ] **Step 2: 修改 update 方法**

在 `update` 方法中处理 `mainImages`, `detailImages`, `videos` 字段更新

- [ ] **Step 3: 提交更改**

```bash
git add apps/api/src/products/products.service.ts
git commit -m "feat(api): handle mainImages, detailImages, videos in product service"
```

---

### Task 4: 重构 ProductGallery 组件

**文件:** `apps/web/components/ProductGallery.tsx`

**新布局:**
- 左侧: 缩略图垂直列表 (1-6张)，超出显示上下箭头
- 右侧: 大图展示，左右箭头切换，鼠标悬停放大镜效果

- [ ] **Step 1: 创建新组件结构**

```typescript
// 主要状态
const [mainImages, setMainImages] = useState<string[]>([])
const [currentIndex, setCurrentIndex] = useState(0)
const [showZoom, setShowZoom] = useState(false)
const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
const [showLeftArrow, setShowLeftArrow] = useState(false)
const [showRightArrow, setShowRightArrow] = useState(false)
```

- [ ] **Step 2: 实现缩略图列表 + 上下箭头滚动**

- [ ] **Step 3: 实现大图展示 + 左右箭头切换**

- [ ] **Step 4: 实现放大镜效果**

- [ ] **Step 5: 提交更改**

```bash
git add apps/web/components/ProductGallery.tsx
git commit -m "feat(web): refactor ProductGallery with thumbnail + zoom layout"
```

---

### Task 5: 新建 ProductDetailImages 组件

**文件:** `apps/web/components/product/ProductDetailImages.tsx`

**功能:**
- 垂直堆叠布局
- 每张图全宽显示
- 点击全屏查看
- 无文字说明

- [ ] **Step 1: 创建组件结构**

```typescript
interface ProductDetailImagesProps {
  images: string[]  // detailImages URLs
  productName?: string
}

export function ProductDetailImages({ images, productName }: ProductDetailImagesProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  // ... 垂直堆叠 + 全屏查看逻辑
}
```

- [ ] **Step 2: 实现垂直堆叠展示**

- [ ] **Step 3: 实现全屏查看功能**

- [ ] **Step 4: 提交更改**

```bash
git add apps/web/components/product/ProductDetailImages.tsx
git commit -m "feat(web): add ProductDetailImages component with vertical stack layout"
```

---

### Task 6: 修改 ProductDetailContent

**文件:** `apps/web/components/ProductDetailContent.tsx`

**修改内容:**
1. 导入并使用新的 `ProductGallery` 和 `ProductDetailImages`
2. 从产品数据中提取 `mainImages`, `detailImages`, `videos`
3. 调整布局：将主图和视频放在产品标题下方，详情图在独立区域

- [ ] **Step 1: 调整产品数据解析**

```typescript
// 解析新字段
const mainImages = product.mainImages ? JSON.parse(product.mainImages) : []
const detailImages = product.detailImages ? JSON.parse(product.detailImages) : []
const videos = product.videos ? JSON.parse(product.videos) : []
```

- [ ] **Step 2: 更新主图展示区域**

- [ ] **Step 3: 添加详情图展示区域**

- [ ] **Step 4: 提交更改**

```bash
git add apps/web/components/ProductDetailContent.tsx
git commit -m "feat(web): update ProductDetailContent to use new image fields"
```

---

### Task 7: 修改 API Queries

**文件:** `apps/web/lib/api/queries.ts`

**修改内容:** 确保API返回包含 `mainImages`, `detailImages`, `videos` 字段

- [ ] **Step 1: 检查并更新 TypeScript 类型定义**

- [ ] **Step 2: 提交更改**

```bash
git add apps/web/lib/api/queries.ts
git commit -m "feat(web): update product query types for new image fields"
```

---

### Task 8: 修改 Admin 添加产品页面

**文件:** `apps/admin/app/products/new/page.tsx`

**修改内容:** 三个独立上传区域

- [ ] **Step 1: 更新上传区域为三个独立 Card**

```tsx
// 产品主图 (1-6张)
<Card>
  <CardHeader>
    <CardTitle>产品主图 (1-6张) *</CardTitle>
  </CardHeader>
  <CardContent>
    <FileUpload
      type="image"
      multiple
      maxFiles={6}
      files={mainImages}
      onChange={setMainImages}
      uploadType="product-image"
    />
  </CardContent>
</Card>

// 详情图 (0-8张)
<Card>
  <CardHeader>
    <CardTitle>详情图 (0-8张)</CardTitle>
  </CardHeader>
  <CardContent>
    <FileUpload
      type="image"
      multiple
      maxFiles={8}
      files={detailImages}
      onChange={setDetailImages}
      uploadType="product-image"
    />
  </CardContent>
</Card>

// 产品视频 (0-3个)
<Card>
  <CardHeader>
    <CardTitle>产品视频 (0-3个)</CardTitle>
  </CardHeader>
  <CardContent>
    <FileUpload
      type="video"
      multiple
      maxFiles={3}
      files={videos}
      onChange={setVideos}
      uploadType="product-video"
    />
  </CardContent>
</Card>
```

- [ ] **Step 2: 更新提交数据结构**

```typescript
const productData = {
  // ... 其他字段
  mainImages: JSON.stringify(mainImages.map(f => f.uploadedUrl)),
  detailImages: JSON.stringify(detailImages.map(f => f.uploadedUrl)),
  videos: JSON.stringify(videos.map(f => f.uploadedUrl)),
}
```

- [ ] **Step 3: 提交更改**

```bash
git add apps/admin/app/products/new/page.tsx
git commit -m "feat(admin): update new product page with separate image/video uploads"
```

---

### Task 9: 修改 Admin 编辑产品页面

**文件:** `apps/admin/app/products/[id]/edit/page.tsx`

**修改内容:** 与添加产品页面相同的三个上传区域，显示现有数据

- [ ] **Step 1: 更新上传区域**

- [ ] **Step 2: 加载现有数据**

```typescript
// 加载主图
if (product.mainImages) {
  const imgs = JSON.parse(product.mainImages)
  setMainImages(imgs.map((url: string, idx: number) => ({
    id: `main-${idx}`,
    file: new File([], url, { type: 'image/jpeg' }),
    preview: url,
    type: 'image' as const,
    uploadedUrl: url,
    isServerUrl: true,
  })))
}

// 类似处理 detailImages 和 videos
```

- [ ] **Step 3: 提交更改**

```bash
git add apps/admin/app/products/[id]/edit/page.tsx
git commit -m "feat(admin): update edit product page with separate image/video uploads"
```

---

### Task 10: 修改 Admin 浏览产品页面

**文件:** `apps/admin/app/products/[id]/page.tsx`

**修改内容:** 显示三部分：主图、详情图、视频

- [ ] **Step 1: 添加主图展示区域**

- [ ] **Step 2: 添加详情图展示区域**

- [ ] **Step 3: 添加视频展示区域**

- [ ] **Step 4: 提交更改**

```bash
git add apps/admin/app/products/[id]/page.tsx
git commit -m "feat(admin): update product view page with separate image/video sections"
```

---

### Task 11: 测试与验证

- [ ] **Step 1: 测试管理后端 - 添加产品**
  - 上传主图(1-6张)、详情图(0-8张)、视频(0-3个)
  - 保存并验证数据正确存储

- [ ] **Step 2: 测试管理后端 - 编辑产品**
  - 修改图片和视频
  - 验证更新正确

- [ ] **Step 3: 测试前端 - 主图展示**
  - 缩略图点击切换
  - 上下箭头滚动
  - 左右箭头切换
  - 放大镜效果

- [ ] **Step 4: 测试前端 - 详情图展示**
  - 垂直滚动浏览
  - 点击全屏查看
  - 左右切换

- [ ] **Step 5: 测试移动端响应式**

---

## 进度检查清单

- [ ] Task 1: 数据库Schema修改
- [ ] Task 2: Product DTO修改
- [ ] Task 3: ProductsService修改
- [ ] Task 4: ProductGallery重构
- [ ] Task 5: ProductDetailImages新建
- [ ] Task 6: ProductDetailContent修改
- [ ] Task 7: API Queries修改
- [ ] Task 8: Admin添加产品页面修改
- [ ] Task 9: Admin编辑产品页面修改
- [ ] Task 10: Admin浏览产品页面修改
- [ ] Task 11: 测试验证

---

**Plan saved to:** `docs/superpowers/plans/2026-05-05-product-detail-images-plan.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**