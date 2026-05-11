# B2B产品详情页内容叙事流优化设计

**日期:** 2026-05-11
**状态:** 已审批（全部完成）
**版本:** 1.2

## 背景

当前产品详情页虽内容完整（22个区块），但存在三个核心问题：

1. **内容叙事流混乱** — Feature/Advantage/Benefit/Trust 来回跳跃，买家阅读体验割裂
2. **冗余区块** — Core Selling Points、Certifications、Factory Info 各出现2次
3. **信任闭环 incomplete** — 缺少风险逆转（Sample Policy/Warranty）、社会认同（客户案例）、工厂实拍影像
4. **详情图 SEO 薄弱** — ProductDetailImages 使用纯 `<img>`，缺少语义标签和 Next.js 图片优化

## 设计原则

| 原则 | 说明 |
|------|------|
| **视觉优先** | 图片/视频给人看，保持大图垂直展示，不增加交互门槛 |
| **语义优先** | 文字/参数兼顾 SEO + AI 可读性，使用语义化 HTML |
| **叙事递进** | F-A-B（Feature → Advantage → Benefit）引导买家决策 |
| **信任闭环** | 每个决策点都有对应的信任证据支持 |

## 变更内容

### 1. 左侧内容流重构（F-A-B 叙事结构）

当前22个区块 → 优化重组为5个阶段13个区块，消除冗余。

```
 当前顺序 (混乱)                   优化后 (F-A-B)
 ─────────────                   ────────────────
 ① ProductGallery              【FEATURE】是什么
 ② ProductDetailImages           ① ProductGallery
 ③ Quick Specs                   ② ProductDetailImages (SEO增强)
 ④ 认证Badges                    ③ Key Specs Cards
 ⑤ MOQ Prominent                 ④ ProductAttributes (规格表)
 ⑥ Why Choose Us               
 ⑦ Factory Capabilities         【ADVANTAGE】好在哪
 ⑧ Trade Keywords                 ⑤ Description
 ⑨ Key Specs Cards                ⑥ Application Scenarios
 ⑩ ProductAttributes              ⑦ Why Choose Us
 ⑪ Description                  
 ⑫ OEM/ODM                      【BENEFIT】你得到
 ⑬ Core Selling Points ★冗余      ⑧ OEM/ODM
 ⑭ Application Scenarios       
 ⑮ Trade Info                    【TRUST】为什么信
 ⑯ Quality Control                 ⑨ Certifications (去重合并)
 ⑩ MOQ + Shipping & QC            ⑩ Factory Capabilities (增强影像)
 ⑪ Factory Showcase ★冗余          ⑪ Customer Cases (新增)
 ⑫ Certifications ★冗余         
 ⑬ Packaging Info                 【TRANSACTION】交易条件
 ⑭ FAQ                             ⑫ Trade Info + Trade Keywords
 ⑮ Related Products                 ⑬ FAQ
                                    ⑭ Related Products
```

#### 具体数据流变更

**删除的冗余区块（4处）：**
- `Core Selling Points`（左列, L406-411）— 保留在右列即可
- `Certifications` inline badges（L226-241）— 保留 ProductCertifications 组件（更丰富）
- `Factory Showcase` 组件（L462-467）— 合并到 Factory Capabilities 区块
- `Trade Keywords` 独立区块（L314-330）— 合并到 Trade Info 附近

**移除的区块（非冗余但位置不当，2处）：**
- `Quick Specs Strip`（L206-223）— 价格/MOQ/交期已在右列展示，无需在左列重复
- `MOQ Prominent Display`（L244-260）— 同上
- `Why Choose Us` 和 `Factory Capabilities` 之间穿插的 `Quality Control`/`Shipping & Packaging` — 移到 TRANSACTION 阶段

**增强的区块（2处）：**
- `ProductDetailImages` — SEO 语义增强（详见第4节）
- `Factory Capabilities` — 增加工厂实拍图片/视频占位

### 2. 右侧列风险逆转增强

**增强位置：** 询价按钮下方

**新增内容：**

```
[立即询价]  ← 现有
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 样品政策              ← 新增
   • 样品费: XX USD/件
   • 交期: 3-5个工作日
   • 运费: 到付/预付
   
🛡️ 质量保障              ← 新增
   • 12个月质保期
   • 支持第三方验货
   • 不满意包退
━━━━━━━━━━━━━━━━━━━━━━━━━━━
[收藏] [分享] [WhatsApp] ← 现有
```

**数据来源：** 从 Product 模型或 TradeInfo 中读取 (`samplePolicy`, `warrantyInfo` 等字段)

### 3. 新增客户案例 / Logo 墙组件

**位置：** TRUST 阶段，Factory Capabilities 之后

**组件：** `ProductCustomerCases`

```tsx
interface CustomerCase {
  companyName: string
  logo?: string
  quote?: string        // 客户评价
  productName?: string  // 采购产品
  region?: string       // 市场区域
}

interface ProductCustomerCasesProps {
  cases: CustomerCase[]
  titleEn?: string
  titleZh?: string
}
```

**布局：** Logo 墙网格 + 精选评价卡片
- 有数据时：展示客户 Logo + 名称网格
- 有 quote 时：精选 1-2 条评价突出展示
- 无数据时：隐藏（默认不显示）

### 4. ProductDetailImages SEO 语义增强

**文件：** `apps/web/components/product/ProductDetailImages.tsx`

**变更：**

```tsx
// 修改前
<img src={imageUrl} alt={`Product detail image ${index + 1}`} />

// 修改后
<figure itemScope itemType="https://schema.org/ImageObject">
  <Image
    src={imageUrl}
    alt={alt}
    width={750}
    height={750}
    className="w-full h-auto"
    priority={index === 0}
    loading={index === 0 ? undefined : 'lazy'}
  />
  <meta itemProp="contentUrl" content={imageUrl} />
  {alt && <figcaption itemProp="caption">{alt}</figcaption>}
</figure>
```

**变更要点：**
| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| 图片组件 | `<img>` | `next/image`（自动 webp, srcset） |
| 容器 | `div` | `<figure>` + `<figcaption>` |
| Schema | 无 | `ImageObject` 微数据 |
| alt 属性 | 固定文本 | 支持多语言 alt（从 product 数据传递） |

### 5. Factory Capabilities 影像增强

**位置：** 原有的 Factory Capabilities 区块（L289-311）

**新增：** 在 stats 下方增加工厂实拍图片区域

```
┌─────────────────────────────────────┐
│ 🏭 工厂实力                          │
├─────────────────────────────────────┤
│ [15+] [50K+] [50+]                   │
│  Years  Capacity  Countries          │
├─────────────────────────────────────┤
│ [工厂实拍图片]  [产线图片]  [质检图片] │  ← 新增
│   车间一角      流水线      QC检测    │
├─────────────────────────────────────┤
│ 文字描述...                          │
└─────────────────────────────────────┘
```

**数据源：** Product 模型新增 `factoryImages` 字段（string[]），通过管理后台上传

**MVP 策略：** 无数据时不显示图片区域，不阻塞页面；图片可用时优雅展示。

## 变更文件清单

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `apps/web/components/ProductDetailContent.tsx` | **大改** | 内容叙事流重构，消除冗余，新增区块 |
| `apps/web/components/product/ProductDetailImages.tsx` | 小改 | next/image + figure/figcaption |
| `apps/web/components/product/ProductCustomerCases.tsx` | **新建** | 客户案例/Logo 墙组件 |
| `apps/web/components/ProductGallery.tsx` | 不改 | 已验证无误 |

## 不做的变更

| 项目 | 原因 |
|------|------|
| 详情图网格+灯箱 | 垂直大图更符合 B2B 买家浏览习惯 |
| 详情图放大镜 | 同上，不增加不必要的交互成本 |

## 前后端一致性对齐 ✅

前端修改完成后审计发现 3 类后端对齐问题，已于 2026-05-11 全部修复。

前端修改完成后审计发现 3 类后端对齐问题，需在后续修复：

### ✅ P0：`factoryDescription` 字段缺失 ✅

`ProductDetailContent.tsx` 使用 `product.factoryDescription`（类型化访问），Prisma 模型、DTO 均缺少此字段。当前仅靠 mockProduct 的默认文案兜底。

**修复内容：**
- ✅ Prisma: `schema.prisma` Product 模型新增 `factoryDescription String?`
- ✅ DTO: `product.dto.ts` CreateProductDto / UpdateProductDto 增加 `factoryDescription?: string`
- ✅ Frontend type: `queries.ts` Product 接口已有 `factoryDescription?: string`

### ✅ P1：DTO 补齐缺失字段 ✅

以下字段 **Prisma 有 → 数据库能存 → 前端能读 → 但 DTO 缺失**，导致管理后台无法填写：

| 字段 | 影响 | 状态 |
|------|------|------|
| `factoryYears`, `factoryCountries`, `factoryCapacity` | Factory 统计数字在前端展示，后台无法录入 | ✅ 已修复 |
| `tradeKeywords` | 前端 TradeKeywords 区块使用，后台无法录入 | ✅ 已修复 |
| `fobPort`, `targetMarkets`, `exportExperience` | 贸易条款信息 | ✅ 已修复 |
| `productionCapacityUnit` | 工厂产能单位 | ✅ 已修复 |

**修复内容：** DTO（`product.dto.ts`）新增 9 个字段（含 `productionCapacityUnit`），确保管理后台与前端展示一致。

### ✅ P2：`CustomerCase` 模型创建 ✅

`ProductCustomerCases` 组件通过 `(product as any).customerCases` 读取，数据库无对应字段。当前无数据时自动隐藏。

**修复内容：**
- ✅ Prisma: 新增 `CustomerCase` 模型，含 `companyName`, `logoUrl`, `quote`, `productName`, `region`, `order`, `isActive` 字段，与 Product 建立外键关联（级联删除）
- ✅ API: `products.service.ts` `findBySlug` / `findOne` 增加 `include: { customerCases: { where: { isActive: true }, orderBy: { order: 'asc' } } }`
- ✅ Frontend: `queries.ts` Product 接口新增 `customerCases?: CustomerCaseData[]` 类型定义
- 管理后台录入界面可在后续迭代中添加

### 🔵 不影响对齐的项

| 项目 | 原因 |
|------|------|
| `Sample Policy + Warranty` | 使用硬编码文本，不依赖后端数据 |
| `FactoryShowcase` 组件 | 保留在代码中，仅不再被引用 |
| `(product as any).xxx` 读取 | 无数据时自动隐藏，graceful degradation |
| `ProductDetailImages` SEO 增强 | 纯前端变更，数据源不变 |

## 验证方法

1. **PC端 (1280px+):** 左列按 F-A-B 顺序排列，右列 sticky 正常，CTA 下方显示样品政策+质保
2. **PAD端 (1024-1280px):** 两列布局正常
3. **手机端 (<1024px):** 单列，底部 fixed bar 正常
4. **冗余检查:** 页面上 Certifications/Factory/Selling Points 不再重复出现
5. **SEO 检查:** ProductDetailImages 的 `<img>` 已替换为 `<figure>` + `<Image>` + 微数据
6. **客户案例:** 无数据时隐藏，不显示空白区块
7. **构建验证:** `npm run build` 无错误
8. **后端对齐验证:** `factoryDescription` 可从 API 正常读写；DTO 含所有 Factory 字段

## 变更文件清单

### 前端（已完成）

| 文件 | 变更类型 |
|------|----------|
| `apps/web/components/ProductDetailContent.tsx` | 内容叙事流重构，消除冗余 |
| `apps/web/components/product/ProductDetailImages.tsx` | next/image + figure/figcaption |
| `apps/web/components/product/ProductCustomerCases.tsx` | 新增客户案例组件 |

### 后端（已完成 ✅）

| 文件 | 变更类型 |
|------|----------|
| `packages/database/prisma/schema.prisma` | 新增 `factoryDescription` 字段 + `CustomerCase` 模型 |
| `apps/api/src/products/dto/product.dto.ts` | 补齐缺失 DTO 字段（9个） |
| `apps/api/src/products/products.service.ts` | `findBySlug` / `findOne` 增加 `customerCases` include |
| `apps/web/lib/api/queries.ts` | Product 类型新增 `factoryDescription` + `CustomerCaseData` |
