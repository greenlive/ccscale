# CC Scale B2B外贸平台需求文档

## 1. 项目背景

### 1.1 项目名称和目标

**项目名称：** CC Scale B2B外贸平台（CC Scale B2B Foreign Trade Platform）

**项目目标：** 构建一个专业的B2B外贸官方网站，用于展示衡器（体重秤、吊秤等称重设备）产品，面向全球批发商、经销商和OEM客户。平台集产品展示、询盘管理、客户关系管理于一体，旨在提升品牌形象、获取高质量询盘、建立长期贸易合作。

### 1.2 目标用户群体

| 用户类型 | 描述 | 需求 |
|---------|------|------|
| 批发商/经销商 | 各国从事衡器产品的批发商 | 了解产品规格、价格区间、认证信息 |
| OEM/ODM客户 | 需要定制化产品的品牌商 | 了解OEM/ODM能力、起订量、交期 |
| 零售商 | 实体店或线上零售商 | 了解产品质量认证、最小起订量 |
| 采购商 | 大型连锁店或工程项目采购 | 了解产能、贸易条款、付款方式 |
| 贸易公司 | 进出口贸易公司 | 了解物流、认证、港口信息 |

### 1.3 业务场景

1. **产品发现**：用户通过分类浏览或搜索找到所需产品
2. **产品研究**：用户查看产品详情、规格、认证、价格区间等信息
3. **询盘提交**：用户填写询盘表单，提交采购需求
4. **询盘处理**：销售团队在后台处理询盘，分配跟进
5. **客户管理**：建立客户档案，长期维护客户关系
6. **OEM定制**：用户了解OEM/ODM流程，提交定制需求

---

## 2. 功能需求

### 2.1 前台网站功能

#### 2.1.1 产品展示

**产品列表页**

- 网格布局展示产品，每页12个产品
- 支持按分类筛选
- 支持关键词搜索（按产品名称/SKU搜索）
- 支持排序（价格、名称、创建时间）
- 显示产品缩略图、名称、价格区间、MOQ
- 分页导航

**产品详情页**

- 左侧：主图画廊（1-5张主图 + 视频）
- 右侧（Sticky）：产品名称/SKU、价格区间、MOQ、交期、核心卖点、询价按钮
- 快速规格卡片
- 技术规格表格
- 详情图片展示（0-8张）
- 认证证书展示
- 工厂信息
- 包装信息
- FAQ
- 应用场景
- 相关产品推荐

**响应式布局**

| 设备 | 断点 | 布局 |
|------|------|------|
| Mobile | <1024px | 单列，底部固定询价栏 |
| PAD | 1024-1280px | 单列，底部固定询价栏 |
| Desktop | >=1280px | 双列，右侧Sticky |

#### 2.1.2 产品分类浏览

- 分类列表页，展示所有启用的分类
- 每个分类显示名称、描述、产品数量
- 点击进入该分类下的产品列表
- 支持中英文切换显示

**分类结构示例：**

- Body Scales（体重秤）
- Hanging Scales（吊秤）
- Kitchen Scales（厨房秤）
- Platform Scales（台秤）

#### 2.1.3 多语言支持

- 支持中文（zh）和英文（en）
- 语言切换器位于导航栏
- 所有前台内容根据语言设置显示对应版本
- URL结构：`/{locale}/products`、`/{locale}/categories`

#### 2.1.4 询盘提交

- 表单字段：
  - 姓名（必填）
  - 邮箱（必填）
  - 电话
  - WhatsApp
  - 公司名称
  - 国家/地区
  - 城市
  - 留言内容（必填）
  - 询价产品（可选）
  - 数量（可选）
- 来源追踪：UTM参数、流量来源、IP地址、Referrer
- 提交成功显示感谢页面
- 发送确认邮件给客户

#### 2.1.5 联系我们

- 联系表单
- 公司信息展示
- 地图位置（可选）
- 在线客服入口（WhatsApp/其他）

#### 2.1.6 关于我们

- 公司介绍
- 工厂介绍（图片 + 文字）
- 工厂实力数据（成立年份、出口国家、产能）
-  Certifications展示
-  客户Logo墙

#### 2.1.7 OEM/ODM定制

- 展示OEM/ODM流程步骤
- 每个步骤包含：标题、描述、图标
- 自定义流程入口
- 定制能力说明

#### 2.1.8 证书展示

- 展示企业获得的认证证书（CE、FCC、RoHS、ISO9001等）
- 分类展示：质量认证、环保认证、安全认证
- 点击查看大图

#### 2.1.9 下载中心

- 文件列表展示（产品手册、价格表、证书等）
- 按分类筛选
- 显示文件标题、描述、大小、下载次数
- 点击下载或在新窗口打开

### 2.2 管理后台功能

#### 2.2.1 用户权限管理

**用户角色**

| 角色 | 代码 | 权限范围 |
|------|------|----------|
| 超级管理员 | ADMIN | 全部权限，包括系统设置 |
| 管理员 | EDITOR | 产品、分类、询盘、用户管理 |
| 编辑 | EDITOR | 产品和分类的增删改 |
| 查看者 | VIEWER | 只读权限 |

**用户管理功能**

- 用户列表（显示ID、邮箱、姓名、角色、状态、注册时间、最后登录）
- 添加用户（邮箱、密码、姓名、角色、状态）
- 编辑用户
- 启用/禁用用户
- 查看登录日志

#### 2.2.2 产品管理（CRUD）

**产品列表**

- 搜索（名称/SKU）
- 筛选（分类、状态）
- 排序
- 批量操作（启用/禁用/删除）
- 分页

**添加/编辑产品**

| 字段组 | 字段 | 必填 | 说明 |
|--------|------|------|------|
| 基本信息 | SKU | 是 | 唯一标识符，3-50字符 |
| 基本信息 | 分类 | 是 | 下拉选择 |
| 基本信息 | 产品名称(英文) | 是 | 3-200字符 |
| 基本信息 | 产品名称(中文) | 否 | 1-100字符 |
| 基本信息 | URL别名 | 否 | SEO友好URL |
| 基本信息 | 简短描述(英文) | 否 | 一句话简介 |
| 基本信息 | 简短描述(中文) | 否 | 中文简介 |
| 基本信息 | 详细描述(英文) | 否 | 富文本 |
| 基本信息 | 详细描述(中文) | 否 | 富文本 |
| 价格库存 | 最低价格 | 否 | FOB价格区间最小值(USD) |
| 价格库存 | 最高价格 | 否 | FOB价格区间最大值(USD) |
| 价格库存 | 最小起订量(MOQ) | 否 | 整数 |
| 价格库存 | 交期 | 否 | 如"15-20 days" |
| 图片 | 主图(1-5张) | 是 | 白色背景，1200x1200px |
| 图片 | 详情图(0-8张) | 否 | 场景图/细节图 |
| 图片 | 产品视频 | 否 | MP4/WebM，<=200MB |
| 规格 | 规格项 | 否 | 键值对形式，可添加多条 |
| B2B信息 | 核心卖点 | 否 | JSON数组格式 |
| B2B信息 | 应用场景 | 否 | 多行文本 |
| B2B信息 | 认证 | 否 | 多选：CE/FCC/RoHS/ISO9001/UL/FDA |
| B2B信息 | FAQ | 否 | 问题答案对 |
| 贸易信息 | HS编码 | 否 | 海关商品编码 |
| 贸易信息 | 付款条款 | 否 | T/T、L/C、PayPal等 |
| 贸易信息 | 贸易条款 | 否 | FOB、CIF、EXW等 |
| 贸易信息 | 保修期 | 否 | 如"1 year warranty" |
| 包装信息 | 包装信息(英文) | 否 | 包装规格说明 |
| 包装信息 | 包装信息(中文) | 否 | 中文包装规格 |
| 工厂信息 | 厂家名称 | 否 | |
| 工厂信息 | 工厂地址 | 否 | |
| 工厂信息 | 产能 | 否 | 月/年产能描述 |
| SEO | SEO标题(英文) | 否 | <=60字符 |
| SEO | SEO标题(中文) | 否 | <=30字符 |
| SEO | SEO描述(英文) | 否 | <=160字符 |
| SEO | SEO描述(中文) | 否 | <=80字符 |
| SEO | SEO关键词(英文) | 否 | 逗号分隔，<=50字符 |
| SEO | SEO关键词(中文) | 否 | 逗号分隔，<=30字符 |
| 状态 | 启用 | 否 | 是否在前台显示 |
| 状态 | 精选产品 | 否 | 是否显示在推荐区域 |
| 状态 | 排序 | 否 | 数字，越小越靠前 |

#### 2.2.3 分类管理

- 分类列表
- 添加分类（名称英文/中文、URL别名、描述、排序）
- 编辑分类
- 删除分类（级联删除关联产品）
- 启用/禁用分类

#### 2.2.4 询盘管理

**询盘列表**

- 显示：询价ID、客户姓名、邮箱、电话、公司、产品、数量、状态、提交时间
- 筛选（状态、日期范围）
- 搜索（客户姓名/邮箱/公司）
- 排序
- 分页

**询盘状态**

| 状态 | 代码 | 说明 |
|------|------|------|
| 新询盘 | NEW | 待处理 |
| 已读 | READ | 已查看 |
| 处理中 | IN_PROGRESS | 跟进中 |
| 已回复 | REPLIED | 已发送报价 |
| 已关闭 | CLOSED | 已成交或无效 |
| 垃圾 | SPAM | 无效询盘 |

**询盘处理**

- 查看完整询盘详情
- 查看来源追踪信息
- 分配给销售跟进
- 添加处理备注
- 标记回复方式和时间
- 操作日志记录

#### 2.2.5 客户管理

- 客户列表（来自询盘客户数据）
- 客户详情（基本信息、询盘历史、沟通记录）
- 客户分类（潜在客户、正式客户、VIP客户）

#### 2.2.6 证言管理

- 证言列表（客户评价）
- 添加/编辑证言（姓名、公司、国家、内容、评分、头像）
- 排序和启用/禁用

#### 2.2.7 下载管理

- 下载文件列表
- 添加/编辑下载项（标题、描述、文件、分类、排序）
- 显示下载次数
- 启用/禁用

#### 2.2.8 网站设置

- 首页横幅管理
- 页脚内容管理
- 联系方式设置
- 社交媒体链接
- SEO全局设置

#### 2.2.9 数据分析

**流量分析**

- 访问趋势图
- 流量来源分布
- 热门页面
- 设备类型分布
- 地理分布

**询盘分析**

- 询盘趋势图
- 询盘来源分布
- 转化漏斗
- 热门产品
- 热门关键词

**用户行为**

- 会话记录
- 事件追踪
- 产品点击热图

### 2.3 API功能

#### 2.3.1 产品API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/products` | GET | 获取产品列表（支持分类筛选、分页、排序） |
| `/api/products/:id` | GET | 获取单个产品（ID） |
| `/api/products/slug/:slug` | GET | 获取单个产品（URL别名） |
| `/api/products` | POST | 创建产品（需认证） |
| `/api/products/:id` | PUT | 更新产品（需认证） |
| `/api/products/:id` | DELETE | 删除产品（需认证） |

**Query参数（列表）**

| 参数 | 类型 | 说明 |
|------|------|------|
| categoryId | 数字 | 按分类筛选 |
| page | 数字 | 页码，默认1 |
| limit | 数字 | 每页数量，默认12 |

#### 2.3.2 分类API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/categories` | GET | 获取所有分类 |
| `/api/categories` | POST | 创建分类（需认证） |
| `/api/categories/:id` | PUT | 更新分类（需认证） |
| `/api/categories/:id` | DELETE | 删除分类（需认证） |

#### 2.3.3 认证API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/auth/me` | GET | 获取当前用户信息 |
| `/api/auth/refresh` | POST | 刷新Token |

#### 2.3.4 询盘API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/inquiries` | GET | 获取询盘列表（需认证） |
| `/api/inquiries` | POST | 提交询盘（公开） |
| `/api/inquiries/:id` | GET | 获取单个询盘详情 |
| `/api/inquiries/:id` | PUT | 更新询盘状态（需认证） |

#### 2.3.5 上传API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/upload/product-image` | POST | 上传产品图片 |
| `/api/upload/product-video` | POST | 上传产品视频 |

**返回格式**

```json
{
  "url": "https://cdn.example.com/images/product-xxx.jpg"
}
```

#### 2.3.6 统计分析API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/analytics/overview` | GET | 数据概览 |
| `/api/analytics/traffic` | GET | 流量数据 |
| `/api/analytics/inquiries` | GET | 询盘数据 |
| `/api/analytics/products` | GET | 产品数据 |

---

## 3. 非功能需求

### 3.1 性能要求

| 指标 | 要求 |
|------|------|
| 首屏加载时间 | <=3秒 |
| 页面完全加载 | <=5秒 |
| API响应时间 | <=500ms |
| 图片自动优化 | WebP格式，响应式尺寸 |
| 并发用户 | 支持100+同时在线 |

### 3.2 安全要求

- 所有管理后台接口需认证
- 密码加密存储（bcrypt）
- SQL注入防护
- XSS防护
- CSRF防护
- 文件上传类型限制
- 请求频率限制

### 3.3 兼容性要求

| 浏览器 | 版本 |
|--------|------|
| Chrome | 最新版及前2个版本 |
| Firefox | 最新版及前2个版本 |
| Safari | 最新版及前1个版本 |
| Edge | 最新版及前1个版本 |
| iOS Safari | 最新版 |
| Android Chrome | 最新版 |

### 3.4 多语言支持

- 前台完整中英文切换
- 所有用户可见内容支持双语
- SEO标签支持双语
- 后台默认中文

---

## 4. B2B特性需求

### 4.1 认证展示

**支持的认证类型**

| 认证 | 代码 | 适用市场 | 说明 |
|------|------|----------|------|
| CE | CE | 欧盟 | 欧盟安全认证 |
| FCC | FCC | 美国 | 联邦通信委员会认证 |
| RoHS | RoHS | 欧盟 | 有害物质限制认证 |
| ISO9001 | ISO9001 | 全球 | 国际质量管理体系认证 |
| UL | UL | 美国/加拿大 | 美国安全认证 |
| FDA | FDA | 美国 | 食品和药物管理局认证 |

**展示位置：** 产品详情页认证区域

### 4.2 贸易条款

**支持的贸易条款**

| 条款 | 说明 | 责任划分 |
|------|------|----------|
| FOB Shanghai/Ningbo/Shenzhen | 离岸价 | 卖方负责将货物送上船，费用到指定港口止 |
| CIF [Port] | 到岸价 | 卖方承担运费和保险到指定目的港 |
| EXW [City] | 工厂交货 | 买方到卖方工厂提货 |
| DDP | 完税后交货 | 卖方承担所有费用和风险直到到达买方指定地点 |

### 4.3 付款条款

**支持的付款方式**

| 付款方式 | 说明 | 适用场景 |
|----------|------|----------|
| T/T 30/70 | 电汇30%定金+70%发货前结清 | 首次合作常用 |
| T/T 50/50 | 电汇50%定金+50%发货前结清 | 平衡风险 |
| T/T 100% | 电汇100%预付 | 小额订单或信任客户 |
| L/C | 信用证付款 | 大额订单，银行担保 |
| L/C at sight | 即期信用证 | 风险最低，费用较高 |
| PayPal | 在线支付 | 方便快捷，有手续费(~4%) |
| West Union | 西联汇款 |小额或个人交易 |
| Trade Assurance | 阿里巴巴信保 | 平台担保交易 |

### 4.4 MOQ起订量

- 每个产品可设置独立的MOQ
- 前台产品详情页显示MOQ
- 询盘表单包含数量字段
- 支持LCL（不足一整箱）询价

### 4.5 交期承诺

- 产品可设置交期（如"15-20 days"、"25-35 days"）
- 支持按订单量计算交期
- 前台显示承诺交期范围
- 工厂产能信息展示

### 4.6 工厂实力展示

**工厂信息字段**

| 字段 | 说明 |
|------|------|
| 厂家名称 | 制造商名称 |
| 工厂地址 | 生产工厂地址 |
| 产能 | 月/年产能描述 |
| 成立年份 | 工厂经营年限 |
| 出口国家数 | 已出口的国家数量 |
| 年产值 | 年度生产总值 |

**展示位置：** 产品详情页工厂信息区域

### 4.7 贸易关键词SEO

**产品SEO字段**

| 字段 | 最大长度 | 说明 |
|------|----------|------|
| SEO标题(英文) | 60字符 | 英文搜索引擎标题 |
| SEO标题(中文) | 30字符 | 中文搜索引擎标题 |
| SEO描述(英文) | 160字符 | 英文Meta描述 |
| SEO描述(中文) | 80字符 | 中文Meta描述 |
| SEO关键词(英文) | 50字符 | 英文关键词，逗号分隔 |
| SEO关键词(中文) | 30字符 | 中文关键词，逗号分隔 |

**产品URL结构**

```
/products/[slug]
/zh/products/[slug]
```

**分类URL结构**

```
/categories/[slug]
/zh/categories/[slug]
```

---

## 5. 数据字典

### 5.1 产品表（Product）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | Int | 主键，自增 | 1 |
| categoryId | Int | 关联分类ID | 1 |
| sku | String | 产品唯一标识符 | "BS-200" |
| nameEn | String | 英文名称 | "Digital Body Scale BS-200" |
| nameZh | String | 中文名称 | "数字体重秤 BS-200" |
| slug | String | URL别名 | "digital-body-scale-bs-200" |
| descriptionEn | String | 英文详细描述 | 富文本内容 |
| descriptionZh | String | 中文详细描述 | 富文本内容 |
| shortDescEn | String | 英文简短描述 | "High-precision digital body scale" |
| shortDescZh | String | 中文简短描述 | "高精度数字体重秤" |
| mainImage | String | 主图URL | "https://cdn.example.com/bs-200.jpg" |
| videoUrl | String | 产品视频URL | "https://cdn.example.com/bs-200.mp4" |
| priceMin | Decimal | 最低价格(USD) | 15.00 |
| priceMax | Decimal | 最高价格(USD) | 25.00 |
| moq | Int | 最小起订量 | 100 |
| leadTime | String | 交期 | "15-20 days" |
| order | Int | 排序值 | 0 |
| isFeatured | Boolean | 是否精选 | true |
| isActive | Boolean | 是否启用 | true |
| seoTitleEn | String | SEO标题(英文) | "Digital Body Scale BS-200 - CC Scale" |
| seoTitleZh | String | SEO标题(中文) | "数字体重秤BS-200" |
| seoDescEn | String | SEO描述(英文) | "..." |
| seoDescZh | String | SEO描述(中文) | "..." |
| seoKeywordsEn | String | SEO关键词(英文) | "body scale,digital scale" |
| seoKeywordsZh | String | SEO关键词(中文) | "体重秤,数字秤" |
| coreSellingPointsEn | String | 核心卖点(JSON) | ["OEM available","ISO9001"] |
| coreSellingPointsZh | String | 核心卖点(中文JSON) | ["OEM可定制","ISO9001认证"] |
| applicationScenariosEn | String | 应用场景(英文) | "Home, Hospital, Gym" |
| applicationScenariosZh | String | 应用场景(中文) | "家庭、医院、健身房" |
| faqEn | String | FAQ(JSON) | '[{"q":"...","a":"..."}]' |
| faqZh | String | FAQ(中文JSON) | '[{"q":"...","a":"..."}]' |
| certifications | String | 认证(JSON数组) | '["CE","FCC","RoHS"]' |
| hsCode | String | HS编码 | "8423.82" |
| paymentTerms | String | 付款条款 | "T/T 30/70" |
| shippingTerms | String | 贸易条款 | "FOB Shanghai" |
| warrantyInfo | String | 保修信息 | "1 year warranty" |
| packagingInfoEn | String | 英文包装信息 | "10 pcs/carton, 42x38x28 cm" |
| packagingInfoZh | String | 中文包装信息 | "10个/箱，42x38x28厘米" |
| manufacturerName | String | 厂家名称 | "CC Scale Factory" |
| factoryLocation | String | 工厂地址 | "Shanghai, China" |
| productionCapacity | String | 产能描述 | "5,000 pcs/month" |
| productionCapacityUnit | String | 产能单位 | "pcs/month" |
| fobPort | String | FOB港口 | "Shanghai" |
| tradeKeywords | String | 贸易关键词(JSON) | '["wholesale","OEM"]' |
| targetMarkets | String | 目标市场(JSON) | '["Europe","America"]' |
| exportExperience | String | 出口经验 | "20+ countries" |
| factoryYears | Int | 工厂年限 | 20 |
| factoryCountries | Int | 出口国家数 | 50 |
| factoryCapacity | String | 工厂产能 | "60,000 pcs/year" |
| createdAt | DateTime | 创建时间 | 2026-01-01T00:00:00Z |
| updatedAt | DateTime | 更新时间 | 2026-01-01T00:00:00Z |

### 5.2 询盘表（Inquiry）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | Int | 主键，自增 | 1 |
| fullName | String | 客户姓名 | "John Smith" |
| email | String | 客户邮箱 | "john@example.com" |
| phone | String | 电话 | "+1 234 567 8900" |
| whatsapp | String | WhatsApp | "+1 234 567 8900" |
| company | String | 公司名称 | "ABC Trading Co." |
| country | String | 国家 | "United States" |
| city | String | 城市 | "New York" |
| message | String | 留言内容 | "I need a quote for..." |
| source | String | 来源追踪 | "organic" |
| trafficSource | Enum | 流量来源 | ORGANIC_SEARCH |
| utmSource | String | UTM来源 | "google" |
| utmMedium | String | UTM媒介 | "cpc" |
| utmCampaign | String | UTM广告系列 | "scale_promo" |
| utmContent | String | UTM内容 | "banner_1" |
| utmTerm | String | UTM关键词 | "digital scale" |
| referrer | String | 来源URL | "https://google.com" |
| ipAddress | String | IP地址 | "192.168.1.1" |
| userAgent | String | 用户代理 | "Mozilla/5.0..." |
| status | Enum | 询盘状态 | NEW |
| assignedToId | Int | 分配用户ID | 1 |
| notes | String | 处理备注 | "Called but no answer" |
| repliedAt | DateTime | 回复时间 | 2026-01-02T00:00:00Z |
| repliedBy | String | 回复人 | "sales@ccscale.com" |
| replyMethod | Enum | 回复方式 | EMAIL |
| closedReason | String | 关闭原因 | "Not interested" |
| createdAt | DateTime | 创建时间 | 2026-01-01T00:00:00Z |
| updatedAt | DateTime | 更新时间 | 2026-01-01T00:00:00Z |

**询盘状态枚举（InquiryStatus）**

| 值 | 说明 |
|------|------|
| NEW | 新询盘，待处理 |
| READ | 已读 |
| IN_PROGRESS | 处理中 |
| REPLIED | 已回复 |
| CLOSED | 已关闭 |
| SPAM | 垃圾询盘 |

**流量来源枚举（TrafficSource）**

| 值 | 说明 |
|------|------|
| DIRECT | 直接访问 |
| ORGANIC_SEARCH | 自然搜索 |
| PAID_SEARCH | 付费搜索 |
| SOCIAL_ORGANIC | 社交媒体自然流量 |
| SOCIAL_PAID | 社交媒体付费 |
| REFERRAL | 推荐链接 |
| EMAIL | 邮件营销 |
| AI_SEARCH | AI搜索 |
| DISPLAY | 显示广告 |
| VIDEO | 视频广告 |
| OTHER | 其他 |

### 5.3 用户表（User）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | Int | 主键，自增 | 1 |
| email | String | 登录邮箱（唯一） | "admin@ccscale.com" |
| password | String | 密码（加密） | "******" |
| name | String | 姓名 | "Admin" |
| role | Enum | 角色 | ADMIN |
| isActive | Boolean | 是否启用 | true |
| lastLogin | DateTime | 最后登录时间 | 2026-01-01T00:00:00Z |
| createdAt | DateTime | 创建时间 | 2026-01-01T00:00:00Z |
| updatedAt | DateTime | 更新时间 | 2026-01-01T00:00:00Z |

**角色枚举（Role）**

| 值 | 说明 | 权限 |
|------|------|------|
| ADMIN | 超级管理员 | 全部权限 |
| EDITOR | 管理员/编辑 | 产品和分类管理 |
| VIEWER | 查看者 | 只读 |

---

**文档版本：** 1.0
**创建日期：** 2026-05-04
**最后更新：** 2026-05-04
