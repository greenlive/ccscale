# 批量产品导入使用指南

## 快速开始

### 第一步：下载模板

1. 进入管理后台 → 产品管理 → 批量操作
2. 点击「下载 Excel 模板」或「下载 CSV 模板」
3. 模板已包含所有字段和填写示例

### 第二步：填写产品信息

打开模板，按以下规则填写：

| 列名 | 必填 | 说明 | 示例 |
|------|------|------|------|
| sku | ✅ | SKU编号（唯一） | BS-200 |
| name_en | ✅ | 产品英文名 | Digital Body Scale |
| name_zh | ✅ | 产品中文名 | 数字体重秤 |
| slug | ✅ | URL别名（唯一） | digital-body-scale |
| category_slug | ✅ | 分类别名 | body-scales |

### 第三步：添加图片（可选）

有两种方式添加图片：

**方式1：使用图片URL**
`
main_images: https://cdn.example.com/bs200-1.jpg,https://cdn.example.com/bs200-2.jpg
`

**方式2：上传本地图片**
1. 将图片命名为：{SKU}-{序号}.jpg
   - BS200-1.jpg → 主图1
   - BS200-2.jpg → 主图2
   - BS200-d1.jpg → 详情图1
2. 压缩为 ZIP 文件
3. 在「图片上传」标签页上传

### 第四步：导入

1. 返回「批量导入」标签页
2. 上传填写好的 Excel/CSV 文件
3. 点击「上传并开始导入」
4. 查看导入结果

---

## 分类 Slug 对照表

| 分类名称 | Category Slug |
|----------|---------------|
| 体重秤 | body-scales |
| 吊秤 | hanging-scales |
| 厨房秤 | kitchen-scales |
| 婴儿秤 | baby-scales |
| 度盘秤 | dial-scales |

> 如果需要添加新分类，请先在「分类管理」中创建

---

## 完整字段说明

### 基础信息

| 字段 | 类型 | 说明 |
|------|------|------|
| sku | 文本 | 必填，唯一标识符 |
| name_en | 文本 | 必填，英文名称 |
| name_zh | 文本 | 必填，中文名称 |
| slug | 文本 | 必填，URL别名（英文小写，用-连接） |
| category_slug | 文本 | 必填，对应分类的slug |

### 价格与交期

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| price_min | 数字 | 最小价格（美元） | 25.00 |
| price_max | 数字 | 最大价格（美元） | 35.00 |
| moq | 数字 | 最小起订量 | 100 |
| lead_time | 文本 | 交期 | 15-25 days |

### 图片

| 字段 | 类型 | 说明 |
|------|------|------|
| main_images | URL列表 | 主图，多个用逗号分隔 |
| detail_images | URL列表 | 详情图 |
| videos | URL列表 | 视频链接 |

### 描述

| 字段 | 类型 | 说明 |
|------|------|------|
| short_desc_en | 文本 | 英文短描述 |
| short_desc_zh | 文本 | 中文短描述 |
| description_en | 长文本 | 英文详细描述 |
| description_zh | 长文本 | 中文详细描述 |

### 状态

| 字段 | 类型 | 说明 | 值 |
|------|------|------|-----|
| is_featured | 布尔 | 是否推荐 | 0/1 |
| is_active | 布尔 | 是否启用 | 0/1 |

### SEO

| 字段 | 类型 | 说明 |
|------|------|------|
| seo_title_en | 文本 | SEO标题（英文） |
| seo_title_zh | 文本 | SEO标题（中文） |
| seo_desc_en | 文本 | SEO描述（英文） |
| seo_desc_zh | 文本 | SEO描述（中文） |
| seo_keywords_en | 文本 | SEO关键词（英文） |
| seo_keywords_zh | 文本 | SEO关键词（中文） |

### B2B 信息

| 字段 | 类型 | 说明 |
|------|------|------|
| certifications | JSON | 认证列表，如 ["CE","FCC"] |
| hs_code | 文本 | 海关编码 |
| payment_terms | 文本 | 付款方式 |
| shipping_terms | 文本 | 贸易术语 |
| packaging_en | 文本 | 包装信息（英文） |
| packaging_zh | 文本 | 包装信息（中文） |
| fob_port | 文本 | 交货港口 |

---

## 常见问题

### Q: 导入时提示 "SKU已存在"？
**A**: 系统会自动更新已存在的SKU，保留原有数据但会用新数据覆盖。

### Q: 导入时提示 "Category not found"？
**A**: 请检查 category_slug 是否正确，参考上面的对照表。

### Q: 图片URL无效？
**A**: 请确保图片URL可公开访问（不需要登录），建议先在浏览器中测试。

### Q: 如何只更新部分字段？
**A**: 只填写需要更新的字段，留空的字段将保持原值。

### Q: 导入数量有限制吗？
**A**: 单次导入最多500个产品，文件大小限制10MB。

---

## 图片命名规范

### 自动识别规则

| 文件名格式 | 说明 |
|------------|------|
| BS200-1.jpg | 主图，自动递增 |
| BS200-2.jpg | 主图2 |
| BS200-d1.jpg | 详情图1 |
| BS200-v1.jpg | 视频封面 |
| BS200.jpg | 默认主图（如果只有一张） |

### 文件夹结构示例

`
upload/
├── BS-200/
│   ├── BS-200-1.jpg    → 主图1
│   ├── BS-200-2.jpg    → 主图2
│   ├── BS-200-3.jpg    → 主图3
│   └── BS-200-d1.jpg   → 详情图1
├── BS-300/
│   ├── BS-300-1.jpg    → 主图1
│   └── BS-300-d1.jpg   → 详情图1
└── KS-100/
    └── KS-100.jpg      → 单一主图
`

---

## Excel 模板示例

`
sku,name_en,name_zh,slug,category_slug,price_min,price_max,moq,lead_time,is_active
BS-200,Digital Body Scale,数字体重秤,digital-body-scale,body-scales,25.00,35.00,100,15-25 days,1
BS-300,Smart Body Scale,智能体重秤,smart-body-scale,body-scales,35.00,45.00,100,15-25 days,1
HS-500,Industrial Hanging Scale,工业吊秤,industrial-hanging-scale,hanging-scales,85.00,120.00,20,20-30 days,1
`

---

## 批量上传图片步骤

1. **准备图片**
   - 将所有产品图片整理到文件夹
   - 按 {SKU}-{序号}.jpg 命名

2. **上传图片**
   - 进入「图片上传」标签
   - 拖拽上传或点击选择文件夹
   - 系统会自动识别 SKU 并关联

3. **确认关联**
   - 上传后显示每个 SKU 关联的图片数量
   - 如有错误可重新上传覆盖

---

## 导入后检查

导入完成后建议检查：

- [ ] 产品数量是否正确
- [ ] 产品图片是否显示正常
- [ ] 价格和MOQ是否正确
- [ ] SEO信息是否完整
- [ ] 分类是否正确

如有问题，可以在产品列表中单独编辑修正。