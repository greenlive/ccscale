# CC Scale B2B外贸平台设计文档

## 1. 设计规范

### 1.1 设计系统

#### 色彩规范

**主色调 (Primary)**
- 深炭黑 (Anthropic Near Black): `#141413` / HSL(30, 5%, 8%)
- 用途: 标题文字、主要按钮背景、强调元素

**辅助色 (Secondary)**
- 暖沙色 (Warm Sand): `#e8e6dc` / HSL(40, 14%, 89%)
- 用途: 背景区块、输入框背景、次要按钮

**功能色**
| 颜色名称 | 色值 | 用途 |
|---------|------|-----|
| 赤陶色 (Terracotta) | `#c96442` / HSL(17, 54%, 52%) | 主CTA按钮、品牌强调 |
| 羊皮纸色 (Parchment) | `#f5f4ed` / HSL(48, 20%, 94%) | 页面背景 |
| 象牙色 (Ivory) | `#faf9f5` / HSL(51, 33%, 97%) | 卡片背景 |
| 奶油色 (Border Cream) | `#f0eee6` / HSL(45, 20%, 92%) | 边框、分割线 |
| 石灰色 (Stone Gray) | `#87867f` / HSL(50, 5%, 52%) | 次要文字、占位符 |
| 暖炭色 (Charcoal Warm) | `#4d4c48` / HSL(45, 4%, 29%) | 辅助文字 |
| 橄榄灰 (Olive Gray) | `#87867f` | 管理后台辅助文字 |
| 错误红 (Error Crimson) | `#b53333` / HSL(0, 56%, 45%) | 错误状态、危险操作 |

**状态色**
| 状态 | 背景色 | 文字色 |
|-----|-------|-------|
| 成功 | bg-green-100 | text-green-800 |
| 警告 | bg-yellow-100 | text-yellow-800 |
| 信息 | bg-blue-100 | text-blue-800 |
| 错误 | bg-red-100 | text-red-800 |

#### 字体规范

**字体族**
- 标题字体: Serif (衬线体)
- 正文字体: Sans-serif (无衬线体)

**字号系统**
| 元素 | 字号 | 响应式 |
|-----|------|-------|
| h1 | 3rem / 48px | md:4rem, lg:5rem |
| h2 | 2.25rem / 36px | md:3rem, lg:4rem |
| h3 | 1.5rem / 24px | md:1.875rem |
| h4-h6 | 1.125rem / 18px | - |
| 正文 | 1rem / 16px | - |
| 辅助文字 | 0.875rem / 14px | - |
| 最小文字 | 0.75rem / 12px | - |

**行高**
- 标题: leading-tight (1.10) 或 leading-snug (1.20)
- 正文: leading-relaxed (1.60)
- 辅助文字: leading-relaxed

**字重**
- 标题: font-medium (500)
- 正文: font-normal (400)
- 按钮: font-medium (500)

#### 间距系统

**间距值**
| 名称 | 值 | 用途 |
|-----|-----|-----|
| gap-1 | 4px | 紧凑元素间距 |
| gap-2 | 8px | 小间距 |
| gap-3 | 12px | 标准元素间距 |
| gap-4 | 16px | 卡片内间距 |
| gap-6 | 24px | 区块间距 |
| gap-8 | 32px | 大区块间距 |
| gap-12 | 48px | 页面级间距 |

**页面容器**
- 移动端: px-4 (16px)
- 桌面端: container mx-auto with px-4

#### 圆角规范

| 元素 | 圆角值 | Tailwind类 |
|-----|-------|-----------|
| 按钮/输入框 | 8px / 0.5rem | rounded-lg |
| 大按钮 | 12px / 0.75rem | rounded-xl |
| 卡片 | 8px 或 12px | rounded-lg / rounded-xl |
| 标签/徽章 | 9999px | rounded-full |
| 图片 | 8px | rounded-lg |

#### 阴影规范

| 阴影名称 | CSS值 | 用途 |
|---------|-------|-----|
| shadow-whisper | 0 1px 2px rgba(0,0,0,0.05) | 卡片悬浮 |
| shadow-ring-warm | ring ring-offset指定 | 按钮聚焦/悬浮 |
| shadow-lg | - | 弹窗、模态框 |
| 自定义渐变阴影 | - | 重要CTA按钮 |

---

### 1.2 组件设计

#### 按钮样式

**按钮变体 (Variants)**

| 变体 | 样式 | 用途 |
|-----|------|-----|
| default | bg-primary text-primary-foreground | 主要操作 |
| accent | bg-terracotta text-ivory | 品牌CTA |
| outline | border border-border-warm bg-background | 次要操作 |
| secondary | bg-warm-sand text-charcoal-warm | 辅助操作 |
| ghost | hover:bg-warm-sand | 极轻操作 |
| destructive | bg-destructive | 危险操作 |
| white-surface | bg-white text-primary | 白底按钮 |

**按钮尺寸**

| 尺寸 | 高度 | 内边距 | 圆角 |
|-----|-----|-------|-----|
| sm | 36px / 9 | h-9 px-3 | rounded-md |
| default | 40px / 10 | h-10 px-4 | rounded-lg |
| lg | 48px / 12 | h-12 px-8 | rounded-xl |
| icon | 40px / 10 | w-10 | rounded-lg |

**按钮状态**
- Hover: 背景色加深，添加阴影
- Focus: ring-2 ring-focus-blue ring-offset-2
- Disabled: opacity-50, cursor-not-allowed
- Loading: 显示旋转加载指示器

#### 输入框样式

**标准输入框**
```
h-10 rounded-xl border border-border-warm bg-background
px-3 py-2 text-sm
placeholder:text-stone-gray
focus:outline-none focus:ring-2 focus:ring-focus-blue focus:ring-offset-2
```

**输入框变体**
- 带图标: pl-10 (左侧图标), pr-10 (右侧图标)
- 错误状态: border-destructive, ring-destructive

#### 卡片样式

**基础卡片**
```
rounded-lg border border-border-cream bg-ivory
shadow-whisper
```

**卡片组件结构**
| 组件 | 类名 | 用途 |
|-----|-----|-----|
| Card | rounded-lg border shadow-whisper | 容器 |
| CardHeader | flex flex-col space-y-1.5 p-6 | 标题区 |
| CardTitle | text-2xl font-serif font-medium | 标题 |
| CardDescription | text-sm text-stone-gray | 描述 |
| CardContent | p-6 pt-0 | 内容区 |
| CardFooter | flex items-center p-6 pt-0 | 底部 |

**卡片悬浮效果**
- hover:shadow-whisper transition-shadow
- hover:bg-warm-sand/30 (表格行)

#### 表格样式

**表头**
```
border-b border-border-cream bg-warm-sand/50
text-left py-3 px-4 font-medium text-stone-gray
```

**表格行**
```
border-b border-border-cream
hover:bg-warm-sand/30 transition-colors
```

**表格变体**
- 紧凑表格: py-2 px-3
- 宽松表格: py-4 px-6

#### 模态框样式

**遮罩层**
```
fixed inset-0 z-50 bg-black/90
flex items-center justify-center p-4
```

**模态框内容**
```
relative bg-white rounded-xl shadow-lg
max-w-4xl w-full
```

---

## 2. 页面设计

### 2.1 前台页面

#### 首页设计要点

- 全宽Hero区域，品牌色为主
- 产品分类展示网格 (4列)
- 工厂实力展示区 (渐变背景)
- 信任徽章横排展示
- 快速询盘入口固定显示

#### 产品列表页布局

**布局结构**
```
- 面包屑导航 (bg-gray-50 border-b)
- 筛选栏 (搜索框 + 分类筛选)
- 产品网格 (grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6)
- 产品卡片
  - 图片区 aspect-[4/3]
  - 产品名称 (line-clamp-2)
  - 价格区间
  - MOQ标签
  - 快速询盘按钮
```

**产品卡片样式**
```
bg-white border border-gray-200 rounded-lg overflow-hidden
hover:shadow-md transition-shadow
```

#### 产品详情页布局

**布局: Flexbox双栏 (PC端)**

```
+------------------+------------------+
|                  |   固定右侧栏     |
|   可滚动左侧栏    |   (xl:sticky)    |
|                  |   top-20         |
+------------------+------------------+
```

**左侧栏内容 (可滚动)**
1. 产品图库 (ProductGallery)
   - 主图 aspect-square
   - 视频播放按钮
   - 缩略图列表
2. 详情图片 (堆叠全宽)
3. 快速参数条 (3列网格)
   - 价格区间
   - MOQ
   - 交期
4. 信任徽章区 (渐变背景)
5. MOQ突出展示 (amber-50背景)
6. 为什么选择我们 (绿色渐变)
7. 工厂实力 (蓝色渐变)
8. 贸易关键词 (标签云)
9. 关键规格卡片 (2列网格)
10. 规格表格
11. 产品描述
12. OEM/ODM定制区
13. 核心卖点
14. 应用场景
15. 贸易信息
16. 物流与包装
17. 认证展示
18. 工厂展示
19. 包装信息
20. FAQ
21. 相关产品推荐 (4列网格)

**右侧栏内容 (固定)**
1. 产品头部信息
   - 分类名称
   - 产品名称 (h1)
   - SKU + 推荐标签
2. 价格信息卡 (bg-primary)
   - FOB价格 (大字)
   - MOQ
   - 交期
3. 核心卖点 (简化版)
4. 操作按钮区
   - 快速询盘按钮 (渐变背景+光晕)
   - 响应时间提示
   - 收藏/分享/WhatsApp按钮组
5. 信任徽章卡
   - 制造商Logo
   - 品质保证、快速响应等
6. 联系方式卡

**移动端适配**
- 固定底部询价栏 (fixed bottom-0)
- 左侧栏单列显示
- 右侧栏内容移至底部

#### 询盘表单设计

**表单字段**
- 姓名 (必填)
- 邮箱 (必填)
- 公司名称
- 国家/地区 (下拉选择)
- 电话
- 产品SKU (自动填充)
- 询盘内容 (textarea)
- 附件上传

**表单验证**
- 实时验证
- 错误提示 (text-destructive)
- 成功提示 (text-green-600)

#### 移动端适配

**断点**
- PC端: >=1280px
- PAD端: 1024-1280px
- 移动端: <1024px

**移动端特性**
- 单列布局
- 固定底部操作栏
- 汉堡菜单导航
- 触摸友好的大按钮 (min-height: 44px)

---

### 2.2 后台页面

#### 仪表盘

**统计卡片网格**
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
```

**统计卡片内容**
- 图标区 (p-4 rounded-xl + 背景色)
- 数值 (text-3xl font-serif)
- 变化趋势 (绿色↑/红色↓)
- 标题 (text-sm text-stone-gray)

**示例统计**
| 标题 | 图标背景 | 图标色 |
|-----|---------|-------|
| 产品总数 | bg-terracotta/10 | text-terracotta |
| 新询盘 | bg-coral/10 | text-coral |
| 访客总数 | bg-olive-gray/10 | text-olive-gray |
| 转化率 | bg-warm-silver/10 | text-warm-silver |

#### 产品管理列表

**页面结构**
```
- 页面标题 + 添加按钮
- 搜索栏 (Card + Input with Search icon)
- 产品表格 (Card)
```

**表格列**
| 列名 | 样式 |
|-----|-----|
| SKU | font-mono text-sm text-olive-gray |
| 产品 | font-medium, 含推荐标签 |
| 分类 | text-olive-gray |
| 价格区间 | text-olive-gray |
| 状态 | rounded-full 标签 |
| 操作 | 右对齐按钮组 |

**操作按钮**
- 查看 (outline + Eye icon)
- 编辑 (outline + Edit icon)
- 删除 (outline + text-destructive)

#### 产品编辑表单

**表单布局**
```
- 基本信息区 (名称、SKU、分类)
- 价格与MOQ (3列网格)
- 产品图片上传
- 详细描述 (textarea)
- 技术规格 (动态添加)
- 认证信息 (多选)
- 工厂信息
- 保存/取消按钮
```

#### 询盘管理列表

**页面结构**
```
- 页面标题 + 今日统计徽章
- 统计卡片 (4列)
  - 总询盘、新询盘、处理中、已回复
- 筛选栏 (搜索 + 状态下拉 + 来源下拉 + 时间范围)
- 询盘表格
```

**表格列**
| 列名 | 样式 |
|-----|-----|
| 来自 | 新询盘黄色高亮 + 脉冲动画 |
| 公司/国家 | text-olive-gray |
| 渠道来源 | 图标 + 标签 |
| 回复方式 | 图标 + 标签 |
| 状态 | 圆角标签 + 快速操作按钮 |
| 耗时 | 已回复显示响应时间，未回复显示时长 |
| 操作 | 查看按钮 |

**状态颜色**
| 状态 | 背景色 | 文字色 |
|-----|-------|-------|
| NEW | bg-yellow-100 | text-yellow-800 |
| READ | bg-blue-100 | text-blue-800 |
| IN_PROGRESS | bg-purple-100 | text-purple-800 |
| REPLIED | bg-green-100 | text-green-800 |
| CLOSED | bg-gray-100 | text-gray-800 |
| SPAM | bg-red-100 | text-red-800 |

#### 用户管理

**页面结构**
- 用户列表表格
- 用户详情侧滑面板
- 角色标签 (管理员/普通用户)

---

## 3. 响应式设计

### PC端 (>=1280px)

- 最多4列产品网格
- 左侧栏flex-1，右侧栏固定380px
- 表格显示所有列
- 侧边导航展开

### PAD端 (1024-1280px)

- 2-3列产品网格
- 表格列适当减少
- 侧边导航可折叠

### 移动端 (<1024px)

**布局变化**
- 产品网格: 2列
- 表格: 横向滚动
- 详情页: 单列 + 固定底部栏
- 侧边导航: 汉堡菜单

**触控优化**
```
@media (pointer: coarse) {
  button, a, input, select, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## 4. B2B特定设计

### 信任徽章设计

**布局**: 3-6列网格

**样式**
```
bg-gradient-to-r from-primary/5 via-white to-primary/5
border border-gray-200 rounded-xl p-6
```

**单个徽章**
```
flex flex-col items-center gap-1.5 p-3 bg-white
rounded-lg border border-gray-100
hover:border-primary/30 hover:shadow-sm transition-all
```

**图标**: w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center

### 认证展示设计

**认证徽章**
- 圆形图标容器
- 认证名称文字
- 鼠标悬浮放大效果

**支持的认证**: CE, FCC, RoHS, ISO9001等

### MOQ展示设计

**突出样式**
```
bg-amber-50 border border-amber-200 rounded-xl p-4

内容:
- 左侧: Package图标 + "最小起订量 (MOQ)" 标题 + 数值(大字)
- 右侧: 辅助说明文字
```

**数值样式**: text-2xl font-bold text-amber-700

### 工厂信息展示设计

**工厂实力卡片**
```
bg-gradient-to-r from-blue-50 via-white to-blue-50
border border-blue-200 rounded-xl p-6

内容:
- 工厂名称 + 认证制造商标签
- 关键数据 (3列网格): 年限、产能、出口国家
- 工厂描述文字
```

**数据卡片**: text-center p-3 bg-white rounded-lg

### 快速询盘按钮设计

**主要CTA按钮**
```css
/* 渐变背景 + 光晕效果 */
bg-gradient-to-r from-primary to-primary/90
shadow-lg hover:shadow-xl
transition-all duration-300

/* 外发光 */
absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60
rounded-xl blur opacity-30
```

**辅助按钮组** (3列网格)
```
收藏: border-primary bg-primary/5 (已选中)
分享: border-gray-300
WhatsApp: border-green-500 text-green-600
```

**响应时间提示**
```
text-xs text-center text-gray-500
内容: "通常在2小时内回复"
```

---

## 5. 多语言设计

### 中英文切换

**路由结构**
```
/en/products
/zh/products
```

**语言检测**
```typescript
const locale = useLocale() as 'en' | 'zh';
const isZh = locale === 'zh';
```

**条件渲染**
```typescript
const name = isZh ? product.nameZh : product.nameEn;
const description = isZh ? product.descriptionZh : product.descriptionEn;
```

### 国际化文本规范

**字段命名**
| 英文字段 | 中文字段 | 用途 |
|---------|---------|-----|
| nameEn | nameZh | 产品名称 |
| descriptionEn | descriptionZh | 描述 |
| specs.labelEn | specs.labelZh | 规格标签 |
| specs.valueEn | specs.valueZh | 规格值 |

**常见翻译对照**
| 英文 | 中文 |
|-----|-----|
| Products | 产品中心 |
| Home | 首页 |
| Price Range | 价格区间 |
| MOQ | 最小起订量 |
| Lead Time | 交期 |
| Specifications | 技术规格 |
| Description | 产品描述 |
| Certifications | 认证与合规 |
| Factory | 工厂 |
| OEM/ODM | OEM/ODM定制服务 |
| Contact Us | 联系我们 |
| Quick Inquiry | 快速询盘 |
| Add to Favorites | 收藏 |
| Share | 分享 |
| Related Products | 相关产品 |

**SEO元数据**
```typescript
const title = isZh
  ? '专业衡器产品列表 - CC Scale厂家直供'
  : 'Professional Weighing Scales Catalog - CC Scale Direct Manufacturer';

const description = isZh
  ? '浏览CC Scale的全系列衡器产品...'
  : 'Browse CC Scale\'s full range of weighing scales...';
```

---

## 附录: Tailwind CSS类名参考

### 色彩类名映射

| 设计Token | Tailwind类名 |
|----------|-------------|
| primary | text-primary, bg-primary |
| accent | text-terracotta, bg-terracotta |
| warm-sand | bg-warm-sand |
| parchment | bg-parchment |
| ivory | bg-ivory |
| stone-gray | text-stone-gray |
| charcoal-warm | text-charcoal-warm |
| border-cream | border-border-cream |
| border-warm | border-border-warm |

### 常用组合类

```html
<!-- 卡片 -->
<div class="bg-white rounded-lg border border-border-cream shadow-whisper">

<!-- 按钮 -->
<button class="bg-primary text-primary-foreground hover:bg-primary/90">

<!-- 输入框 -->
<input class="h-10 rounded-xl border border-border-warm bg-background">

<!-- 标签 -->
<span class="px-3 py-1 rounded-full text-xs font-medium">

<!-- 表格行 -->
<tr class="border-b border-border-cream hover:bg-warm-sand/30">
```