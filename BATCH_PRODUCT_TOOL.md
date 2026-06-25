# 批量产品管理工具设计文档

## 功能概述

为 CC Scale 管理后台提供完整的批量产品管理能力，支持：
- 📥 CSV/Excel 批量导入产品
- 📤 批量导出现有产品
- 🖼️ 图片批量上传并自动关联
- ⚡ 批量编辑产品信息
- 🔄 导入进度跟踪和错误处理

---

## 1. 数据模型

### 产品导入模板字段

| 字段名 | 必填 | 说明 | 示例 |
|--------|------|------|------|
| sku | ✅ | SKU编号（唯一） | BS-200 |
| name_en | ✅ | 产品英文名 | Digital Body Scale |
| name_zh | ✅ | 产品中文名 | 数字体重秤 |
| slug | ✅ | URL别名（唯一） | digital-body-scale-bs-200 |
| category_slug | ✅ | 分类别名 | body-scales |
| price_min | ❌ | 最小价格(USD) | 25.00 |
| price_max | ❌ | 最大价格(USD) | 35.00 |
| moq | ❌ | 最小起订量 | 100 |
| lead_time | ❌ | 交期 | 15-25 days |
| short_desc_en | ❌ | 英文短描述 | High precision digital scale |
| short_desc_zh | ❌ | 中文短描述 | 高精度数字体重秤 |
| description_en | ❌ | 英文详细描述 | (长文本) |
| description_zh | ❌ | 中文详细描述 | (长文本) |
| main_images | ❌ | 主图URLs（逗号分隔） | https://...,https://... |
| detail_images | ❌ | 详情图URLs（逗号分隔） | https://...,https://... |
| videos | ❌ | 视频URLs（逗号分隔） | https://... |
| is_featured | ❌ | 是否推荐 | 0/1 |
| is_active | ❌ | 是否启用 | 0/1 |
| seo_title_en | ❌ | SEO标题(英) | Custom Digital Body Scale |
| seo_title_zh | ❌ | SEO标题(中) | 定制数字体重秤 |
| seo_desc_en | ❌ | SEO描述(英) | ... |
| seo_desc_zh | ❌ | SEO描述(中) | ... |
| seo_keywords_en | ❌ | SEO关键词(英) | scale,body scale |
| seo_keywords_zh | ❌ | SEO关键词(中) | 体重秤,衡器 |
| specs | ❌ | 规格参数JSON | [{key:\"Weight\",value:\"2.5kg\"}] |
| certifications | ❌ | 认证JSON | [\"CE\",\"FCC\"] |
| hs_code | ❌ | 海关编码 | 8423.10 |
| payment_terms | ❌ | 付款方式 | T/T 30/70 |
| shipping_terms | ❌ | 贸易术语 | FOB Ningbo |
| packaging_en | ❌ | 包装信息(英) | 10pcs/carton |
| packaging_zh | ❌ | 包装信息(中) | 10个/箱 |
| fob_port | ❌ | 交货港口 | Ningbo |

---

## 2. API 接口设计

### 2.1 批量导入

`
POST /api/admin/products/batch/import
Content-Type: multipart/form-data

Form Data:
- file: CSV/Excel文件
- images[]: 图片文件（可选，多个）

Response:
{
  ""taskId"": ""uuid"",
  ""status"": ""pending"",
  ""message"": ""Import task created""
}
`

### 2.2 导入状态查询

`
GET /api/admin/products/batch/import/:taskId

Response:
{
  ""taskId"": ""uuid"",
  ""status"": ""processing"", // pending, processing, completed, failed
  ""total"": 100,
  ""processed"": 50,
  ""success"": 48,
  ""failed"": 2,
  ""errors"": [
    { ""row"": 5, ""sku"": ""BS-200"", ""error"": ""Duplicate SKU"" },
    { ""row"": 12, ""sku"": ""BS-300"", ""error"": ""Invalid category_slug"" }
  ]
}
`

### 2.3 导出产品

`
POST /api/admin/products/batch/export
Content-Type: application/json

Body:
{
  ""categoryId"": 1,      // 可选，分类筛选
  ""isActive"": true,     // 可选
  ""format"": ""csv"",    // csv | excel
  ""includeImages"": true  // 是否包含图片URLs
}

Response: 文件下载
`

### 2.4 下载导入模板

`
GET /api/admin/products/batch/template?format=excel

Response: 文件下载 (.xlsx)
`

### 2.5 批量上传图片

`
POST /api/admin/products/batch/images
Content-Type: multipart/form-data

Form Data:
- files[]: 图片文件
- mapping: JSON字符串 {""filename"": ""sku""}  // 文件名对应SKU

Response:
{
  ""uploaded"": 50,
  ""mappings"": [
    { ""filename"": ""bs200-1.jpg"", ""sku"": ""BS-200"", ""url"": ""https://..."", ""type"": ""main"" }
  ]
}
`

### 2.6 批量更新

`
POST /api/admin/products/batch/update
Content-Type: application/json

Body:
{
  ""skus"": [""BS-200"", ""BS-300""],  // 要更新的SKU列表
  ""updates"": {
    ""isFeatured"": true,                // 要更新的字段
    ""isActive"": false
  }
}

Response:
{
  ""updated"": 2,
  ""failed"": 0
}
`

---

## 3. 前端页面设计

### 3.1 入口页面 (/admin/products/batch)

`
┌────────────────────────────────────────────────────────────────┐
│  产品管理  >  批量操作                                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │   📥 批量导入     │  │   📤 批量导出     │                   │
│  │                  │  │                  │                   │
│  │  从Excel/CSV     │  │  导出产品数据      │                   │
│  │  导入产品数据     │  │  到Excel表格       │                   │
│  │                  │  │                  │                   │
│  │  [开始导入]       │  │  [开始导出]        │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │   🖼️ 批量上传图片  │  │   ⚡ 批量编辑     │                   │
│  │                  │  │                  │                   │
│  │  批量上传产品图片  │  │  批量更新产品信息  │                   │
│  │  自动关联SKU      │  │                  │                   │
│  │                  │  │  [开始编辑]        │                   │
│  │  [上传图片]       │  │                  │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
`

### 3.2 批量导入向导

`
步骤 1: 下载模板
┌────────────────────────────────────────────────────────────────┐
│  📄 下载导入模板                                                │
│                                                                │
│  请先下载我们的标准模板，填写产品信息后上传                      │
│                                                                │
│  [下载 Excel 模板]  [下载 CSV 模板]  [查看填写说明]             │
│                                                                │
└────────────────────────────────────────────────────────────────┘

        ↓

步骤 2: 上传文件
┌────────────────────────────────────────────────────────────────┐
│  📤 上传产品数据                                                │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │              📁 拖拽文件到此处或点击上传                   │  │
│  │                                                          │  │
│  │                  支持 .xlsx .csv 格式                      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  已选文件: products_2024.xlsx (2.3 MB)                        │
│  [上传并继续]                                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘

        ↓

步骤 3: 上传图片（可选）
┌────────────────────────────────────────────────────────────────┐
│  🖼️ 上传产品图片（可选）                                        │
│                                                                │
│  如果产品数据中包含图片URL，可跳过此步骤                         │
│  如果需要上传本地图片，请在此上传：                              │
│                                                                │
│  📁 拖拽图片文件夹或点击上传                                      │
│     • 支持 jpg, png, webp 格式                                  │
│     • 文件名格式: {SKU}-{序号}.jpg  如 BS200-1.jpg             │
│                                                                │
│  已上传: 25 张图片                                              │
│  [跳过此步骤]  [继续]                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘

        ↓

步骤 4: 预览确认
┌────────────────────────────────────────────────────────────────┐
│  🔍 导入预览                                                    │
│                                                                │
│  检测到 50 个产品，其中:                                        │
│  ✅ 48 个可导入                                                 │
│  ⚠️ 2 个需要确认                                               │
│  ❌ 0 个错误                                                   │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ SKU      │ 产品名称        │ 分类      │ 状态           │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │ BS-200   │ Digital Body... │ Body...   │ ✅ 可导入      │  │
│  │ BS-300   │ Smart Body...   │ Body...   │ ✅ 可导入      │  │
│  │ KS-100   │ Kitchen Scale   │ Kitchen   │ ⚠️ 重复SKU    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [取消]                    [确认导入 48 个产品]                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘

        ↓

步骤 5: 导入完成
┌────────────────────────────────────────────────────────────────┐
│  ✅ 导入完成                                                     │
│                                                                │
│  成功导入: 48 个产品                                             │
│  跳过: 2 个（重复SKU，已更新）                                   │
│  失败: 0 个                                                    │
│                                                                │
│  [查看导入日志]  [继续添加产品]  [返回产品列表]                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
`

---

## 4. 图片命名规范

### 自动关联规则

`
图片文件夹结构：
├── BS-200/
│   ├── BS-200-1.jpg    → 主图1
│   ├── BS-200-2.jpg    → 主图2
│   ├── BS-200-3.jpg    → 主图3
│   └── BS-200-d1.jpg   → 详情图1
├── BS-300/
│   ├── BS-300-1.jpg    → 主图1
│   └── BS-300-d1.jpg   → 详情图1
`

### 图片命名规则

| 格式 | 示例 | 说明 |
|------|------|------|
| {SKU}-{序号}.jpg | BS200-1.jpg | 主图，自动递增 |
| {SKU}-{序号}p.jpg | BS200-1p.jpg | 详情图 |
| {SKU}-{序号}v.jpg | BS200-1v.jpg | 视频封面 |
| {SKU}.jpg | BS200.jpg | 单一主图 |

---

## 5. 错误处理

### 常见错误及解决方案

| 错误类型 | 错误信息 | 解决方案 |
|----------|----------|----------|
| DUPLICATE_SKU | SKU已存在 | 系统会自动更新现有产品 |
| INVALID_CATEGORY | 分类不存在 | 检查category_slug是否正确 |
| INVALID_SLUG | URL别名已存在 | 自动追加数字后缀 |
| MISSING_REQUIRED | 必填字段缺失 | Excel中补全该字段 |
| INVALID_IMAGE_URL | 图片URL无效 | 检查URL格式 |
| IMAGE_NOT_FOUND | 图片未上传 | 上传对应图片或使用URL |

### 导入日志

每次导入都会生成详细日志：
- 导入时间
- 操作人
- 处理数量
- 成功/失败详情
- 错误行号和原因

---

## 6. 性能优化

### 大文件处理

- 文件大小限制: 10MB
- 单次导入数量限制: 500个产品
- 超大文件自动分批处理

### 后台任务队列

- 使用 Bull/BullMQ 队列处理
- 支持后台导入，不阻塞UI
- 实时进度推送（WebSocket/SSE）

---

## 7. 安全考虑

- 仅 ADMIN/EDITOR 角色可操作
- 文件类型白名单: .xlsx, .csv, .jpg, .png, .webp
- 图片病毒扫描（可选 ClamAV）
- 导入日志审计