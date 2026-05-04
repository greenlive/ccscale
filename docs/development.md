# CC Scale B2B外贸平台开发文档

## 1. 开发环境搭建

### 1.1 Node.js版本要求

- **最低版本**: Node.js 18.x
- **推荐版本**: Node.js 20.x LTS
- **包管理器**: npm 10.x (随 Node.js 20 LTS 一起安装)

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

### 1.2 环境变量配置

从 `.env.example` 复制创建 `.env` 文件：

```bash
# 进入 api 目录
cd apps/api

# 复制环境变量模板
cp .env.example .env
```

**关键环境变量说明**:

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL数据库连接串 | `postgresql://ccscale:ccscale123@localhost:5432/ccscale` |
| `JWT_SECRET` | JWT签名密钥（生产环境必须修改） | `your-super-secret-jwt-key-change-in-production-min-32-chars` |
| `JWT_EXPIRES_IN` | Token过期时间 | `24h` |
| `PORT` | API服务端口 | `3002` |
| `CORS_ORIGIN` | 允许的跨域来源 | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | API地址（前端用） | `http://localhost:3002` |
| `NEXT_PUBLIC_WEB_URL` | 前台网站地址 | `http://localhost:3000` |
| `NEXT_PUBLIC_ADMIN_URL` | 管理后台地址 | `http://localhost:3001` |

### 1.3 数据库配置

本项目使用 Prisma 作为 ORM，支持 PostgreSQL。

**本地开发数据库设置**:

1. 安装 PostgreSQL（推荐使用 Docker）:

```bash
# 使用 Docker 启动 PostgreSQL
docker run -d \
  --name ccscale-postgres \
  -e POSTGRES_USER=ccscale \
  -e POSTGRES_PASSWORD=ccscale123 \
  -e POSTGRES_DB=ccscale \
  -p 5432:5432 \
  postgres:15
```

2. 配置数据库连接字符串到 `.env`:

```
DATABASE_URL="postgresql://ccscale:ccscale123@localhost:5432/ccscale?schema=public"
```

3. 运行数据库迁移:

```bash
cd packages/database
npx prisma migrate dev
```

4. 填充种子数据（可选）:

```bash
cd packages/database
npx prisma db seed
```

### 1.4 IDE推荐配置

**推荐IDE**: VS Code

**必需插件**:

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript Importer

**VS Code 设置** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 2. 项目启动

### 2.1 安装依赖

在项目根目录执行：

```bash
# 安装所有工作区依赖
npm install
```

这会根据 `package.json` 中的 `workspaces` 配置，安装所有子项目的依赖。

### 2.2 启动开发服务器

**方式一：一键启动所有服务**

```bash
# 从根目录启动所有应用（使用 turbo）
npm run dev
```

**方式二：分别启动各服务**

```bash
# 启动前台网站 (http://localhost:3000)
cd apps/web && npm run dev

# 启动管理后台 (http://localhost:3001)
cd apps/admin && npm run dev

# 启动API服务 (http://localhost:3002)
cd apps/api && npm run dev
```

### 2.3 访问地址

| 应用 | 地址 | 说明 |
|------|------|------|
| 前台网站 | http://localhost:3000 | 面向海外买家的B2B展示站 |
| 管理后台 | http://localhost:3001 | 内部运营管理系统 |
| API服务 | http://localhost:3002 | RESTful API 接口 |
| Swagger文档 | http://localhost:3002/api/docs | API接口文档 |

---

## 3. 代码规范

### 3.1 TypeScript规范

**类型定义**:

- 优先使用接口定义对象结构
- 使用 `type` 定义联合类型和工具类型
- 避免使用 `any`，尽量使用 `unknown` 配合类型收窄

```typescript
// 推荐：使用接口定义
interface Product {
  id: number;
  nameEn: string;
  nameZh: string;
}

// 推荐：使用 type 定义联合类型
type ProductStatus = 'active' | 'inactive';

// 不推荐：避免 any
function processData(data: any) { ... }
```

**导入规范**:

```typescript
// 按顺序分组导入
// 1. Node.js 内置模块
import { readFile } from 'fs';

// 2. 第三方包
import { IsString, IsNumber } from 'class-validator';

// 3. 相对路径（按深度从近到远）
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';

// 4. 工作区包别名
import { Button } from '@cc-scale/ui';
```

### 3.2 组件命名规范

**React 组件命名**:

- 使用 PascalCase（如 `ProductCard`、`SearchBar`）
- 组件文件与组件名保持一致
- 页面组件放在 `page.tsx` 文件中

```typescript
// 文件: components/ProductCard.tsx
export function ProductCard() { ... }

// 页面文件: app/products/page.tsx
export default function ProductsPage() { ... }
```

**NestJS 控制器/服务命名**:

- 控制器：`{Resource}Controller`（如 `ProductsController`）
- 服务：`{Resource}Service`（如 `ProductsService`）
- 模块：`{Resource}Module`（如 `ProductsModule`）

### 3.3 样式规范

**Tailwind CSS 使用规范**:

- 使用语义化的 class 名称
- 避免内联复杂样式，保持代码可读性
- 响应式设计使用官方前缀 (`sm:`, `md:`, `lg:`, `xl:`)

```tsx
// 推荐
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// 不推荐（过度嵌套）
<div className="wrapper">
  <div className="inner">
    <div className="content">...</div>
  </div>
</div>
```

**组件样式分离**:

- UI组件样式使用 Tailwind
- 复杂布局样式使用 CSS Modules 或 Tailwind `@apply`
- 避免在 JSX 中直接写大量样式类

### 3.4 Git提交规范

**提交信息格式**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**:

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

**示例**:

```bash
# 新功能
git commit -m "feat(product): add product slug generation"

# Bug修复
git commit -m "fix(inquiry): resolve email notification failure"

# 文档更新
git commit -m "docs: update API documentation for products"
```

---

## 4. 核心模块开发

### 4.1 产品管理

产品模块位于 `apps/api/src/products/`，包含以下核心文件：

```
products/
├── products.module.ts      # 模块定义
├── products.controller.ts  # 路由处理
├── products.service.ts     # 业务逻辑
└── dto/
    └── product.dto.ts      # 数据传输对象
```

**创建产品的基本流程**:

```typescript
// 1. 在 DTO 中定义创建数据结构
// apps/api/src/products/dto/product.dto.ts

export class CreateProductDto {
  @IsNumber()
  categoryId: number;

  @IsString()
  nameEn: string;

  @IsString()
  nameZh: string;

  @IsString()
  slug: string;

  // ... 其他字段
}

// 2. 在 Service 中实现创建逻辑
// apps/api/src/products/products.service.ts

async create(createProductDto: CreateProductDto) {
  const { specs, images, ...productData } = createProductDto;

  return prisma.product.create({
    data: {
      ...productData,
      specs: specs ? { create: specs } : undefined,
      images: images?.length ? { create: images } : undefined,
    },
    include: { category: true, images: true, specs: true },
  });
}
```

**产品关联数据处理**:

- **规格 (Specs)**: 通过 `ProductSpec` 模型存储 key-value 键值对
- **图片 (Images)**: 通过 `ProductImage` 模型存储多张图片
- **分类 (Category)**: 通过 `ProductCategory` 模型多对一关联

### 4.2 询盘管理

询盘模块位于 `apps/api/src/inquiries/`，核心数据结构：

```typescript
// 询盘状态枚举
enum InquiryStatus {
  NEW,           // 新询盘
  READ,          // 已读
  IN_PROGRESS,   // 处理中
  REPLIED,       // 已回复
  CLOSED,        // 已关闭
  SPAM,          // 垃圾询盘
}
```

**询盘来源追踪字段**:

- `trafficSource`: 流量来源类型
- `utmSource/Medium/Campaign/Content/Term`: UTM参数
- `referrer`: 来源页面
- `ipAddress/userAgent`: 访客信息

### 4.3 认证系统

认证模块位于 `apps/api/src/auth/`，使用 JWT 实现无状态认证。

**核心端点**:

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/auth/login` | 用户登录 | 否 |
| POST | `/auth/refresh` | 刷新Token | 否 |
| POST | `/auth/register` | 注册用户 | 是 (Admin) |
| GET | `/auth/me` | 获取当前用户 | 是 |
| PUT | `/auth/password` | 修改密码 | 是 |

**JWT Token 结构**:

```typescript
// Payload 包含
{
  sub: number,    // 用户ID
  email: string,  // 用户邮箱
  role: Role,     // 用户角色 (ADMIN/EDITOR/VIEWER)
}

// Token 类型
- accessToken: 24小时有效期
- refreshToken: 7天有效期
```

**角色权限**:

| 角色 | 说明 |
|------|------|
| `ADMIN` | 管理员，拥有全部权限 |
| `EDITOR` | 编辑，可管理内容但无法管理用户 |
| `VIEWER` | 访客，仅可查看数据 |

### 4.4 文件上传

上传模块位于 `apps/api/src/upload/`，支持多种文件类型和大小限制。

**上传类型配置**:

```typescript
const UPLOAD_TYPE_MIME_TYPES = {
  'product-image': ['image/jpeg', 'image/png', 'image/webp'],
  'product-video': ['video/mp4', 'video/webm'],
  'testimonial': ['image/jpeg', 'image/png'],
  'client-logo': ['image/png', 'image/svg+xml'],
  'factory-image': ['image/jpeg', 'image/png'],
  'general': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

const UPLOAD_TYPE_MAX_SIZES = {
  'product-image': 10 * 1024 * 1024,  // 10MB
  'product-video': 200 * 1024 * 1024, // 200MB
  'testimonial': 5 * 1024 * 1024,     // 5MB
  'client-logo': 2 * 1024 * 1024,      // 2MB
  'factory-image': 15 * 1024 * 1024,   // 15MB
  'general': 10 * 1024 * 1024,         // 10MB
};
```

**API端点**:

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/upload/:uploadType` | 单文件上传 |
| POST | `/upload/:uploadType/multiple` | 多文件上传 (最多20个) |
| DELETE | `/upload/:uploadType/:filename` | 删除文件 |

---

## 5. API开发指南

### 5.1 RESTful规范

**URL设计原则**:

- 使用名词而非动词
- 使用复数形式
- 使用小写字母
- 使用连字符分隔单词

**HTTP方法使用**:

| 方法 | 用途 | 示例 |
|------|------|------|
| GET | 获取资源 | `GET /products` |
| POST | 创建资源 | `POST /products` |
| PUT | 更新资源（全部） | `PUT /products/123` |
| PATCH | 部分更新 | `PATCH /products/123` |
| DELETE | 删除资源 | `DELETE /products/123` |

### 5.2 DTO定义

使用 `class-validator` 和 `class-transformer` 实现DTO验证和转换。

```typescript
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: '产品名称（英文）' })
  @IsString()
  nameEn: string;

  @ApiPropertyOptional({ description: '价格区间（最小值）' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  priceMin?: number;

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @IsOptional()
  images?: ProductImageDto[];
}
```

### 5.3 验证管道

NestJS通过全局管道启用验证：

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // 移除未定义的属性
  forbidNonWhitelisted: true, // 抛出错误而非移除
  transform: true,           // 自动转换类型
  transformOptions: { enableImplicitConversion: true },
}));
```

### 5.4 错误处理

**HTTP状态码规范**:

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 删除成功（无返回内容） |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如邮箱已存在） |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

**自定义异常处理**:

```typescript
// 使用内置异常
throw new NotFoundException(`Product with ID ${id} not found`);

// 自定义业务异常
throw new BadRequestException('Invalid product data');
```

---

## 6. 数据库操作

### 6.1 Prisma基本操作

**查询操作**:

```typescript
// 获取所有产品
const products = await prisma.product.findMany({
  where: { isActive: true },
  include: { category: true, images: true },
  orderBy: { order: 'asc' },
});

// 获取单个产品
const product = await prisma.product.findUnique({
  where: { id: 1 },
  include: { specs: true, images: true },
});
```

**创建操作**:

```typescript
const newProduct = await prisma.product.create({
  data: {
    nameEn: 'Industrial Scale',
    nameZh: '工业秤',
    sku: 'SCALE-001',
    slug: 'industrial-scale',
    categoryId: 1,
  },
});
```

**更新操作**:

```typescript
const updated = await prisma.product.update({
  where: { id: 1 },
  data: {
    priceMin: 99.99,
    isFeatured: true,
  },
});
```

**删除操作**:

```typescript
// 单条删除
await prisma.product.delete({ where: { id: 1 } });

// 批量删除
await prisma.product.deleteMany({ where: { isActive: false } });
```

### 6.2 迁移管理

```bash
# 创建新迁移
cd packages/database
npx prisma migrate dev --name add_product_field

# 应用迁移到数据库
npx prisma migrate deploy

# 重置数据库（慎用）
npx prisma migrate reset

# 查看迁移状态
npx prisma migrate status

# 生成 Prisma Client（迁移后自动执行）
npx prisma generate
```

### 6.3 种子数据

种子文件位于 `packages/database/prisma/seed.ts`。

```bash
# 运行种子数据
cd packages/database
npx prisma db seed
```

**种子数据示例**:

```typescript
// packages/database/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建管理员用户
  await prisma.user.upsert({
    where: { email: 'admin@ccscale.com' },
    update: {},
    create: {
      email: 'admin@ccscale.com',
      password: 'admin123', // 实际使用 bcrypt 加密
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // 创建示例分类
  await prisma.productCategory.createMany({
    data: [
      { nameEn: 'Industrial Scales', nameZh: '工业衡器', slug: 'industrial-scales' },
      { nameEn: 'Precision Balances', nameZh: '精密天平', slug: 'precision-balances' },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 7. 多语言实现

### 7.1 i18n配置

项目使用 `next-intl` 实现前台多语言，`@cc-scale/i18n` 包管理翻译文件。

**翻译文件位置**:

```
packages/i18n/
├── messages/
│   ├── en.json    # 英文翻译
│   └── zh.json    # 中文翻译
└── src/
    └── index.ts   # 导出配置
```

**前台语言路由**:

- `/en/...` - 英文版本
- `/zh/...` - 中文版本

### 7.2 翻译管理

**使用翻译键**:

```typescript
// 在组件中使用
import { useTranslations } from 'next-intl';

export function ProductTitle() {
  const t = useTranslations('products');
  return <h1>{t('title')}</h1>;
}

// 嵌套键
{t('specifications.viewDetails')}
```

**翻译文件结构**:

```json
{
  "products": {
    "title": "Our Products",
    "categories": "Categories",
    "viewDetails": "View Details",
    "specifications": {
      "weight": "Weight",
      "capacity": "Capacity"
    }
  }
}
```

### 7.3 添加新语言

1. 在 `packages/i18n/messages/` 下创建新的翻译文件（如 `ja.json`）

2. 在 `next.config.js` 中配置 locales:

```javascript
// apps/web/next.config.js
const nextConfig = {
  // ...
};

module.exports = withNextIntl(nextConfig);
```

3. 添加语言切换组件到导航栏

---

## 8. 常用命令

### 8.1 开发命令

```bash
# 安装所有依赖
npm install

# 启动所有开发服务
npm run dev

# 启动前台网站 (http://localhost:3000)
cd apps/web && npm run dev

# 启动管理后台 (http://localhost:3001)
cd apps/admin && npm run dev

# 启动API服务 (http://localhost:3002)
cd apps/api && npm run dev

# 代码格式检查
npm run lint

# 代码自动格式化
npm run format
```

### 8.2 构建命令

```bash
# 构建所有应用
npm run build

# 构建单个应用
cd apps/web && npm run build
cd apps/admin && npm run build
cd apps/api && npm run build

# API 生产环境构建
cd apps/api && npm run build

# 启动 API 生产服务
cd apps/api && npm run start:prod
```

### 8.3 数据库命令

```bash
# Prisma 命令（位于 packages/database 目录）
cd packages/database

# 生成 Prisma Client
npx prisma generate

# 创建迁移
npx prisma migrate dev --name migration_name

# 应用迁移
npx prisma migrate deploy

# 重置数据库（清除所有数据）
npx prisma migrate reset

# 查看数据库状态
npx prisma migrate status

# 填充种子数据
npx prisma db seed

# 查看数据库内容（需安装 prisma studio）
npx prisma studio

# 拉取数据库结构到 Prisma schema
npx prisma db pull
```

---

## 附录

### A. 技术栈速查表

| 应用 | 框架 | 端口 | 主要技术 |
|------|------|------|----------|
| web | Next.js 14 | 3000 | React 18, TypeScript, Tailwind, React Query, next-intl |
| admin | Next.js 14 | 3001 | React 18, TypeScript, Tailwind, React Query, React Hook Form |
| api | NestJS | 3002 | TypeScript, Prisma, JWT, Swagger |

### B. 目录结构速查

```
by_claude_vol/
├── apps/
│   ├── web/                 # 前台网站 (Next.js 14 App Router)
│   ├── admin/               # 管理后台 (Next.js 14 Pages Router)
│   └── api/                 # API服务 (NestJS)
├── packages/
│   ├── database/            # Prisma 数据库模型
│   ├── ui/                  # 共享 UI 组件库
│   ├── i18n/                # 国际化配置
│   └── shared-types/       # 共享类型定义
├── docs/                    # 项目文档
└── package.json             # 根 workspace 配置
```

### C. 常用端口映射

| 服务 | 端口 | 访问地址 |
|------|------|----------|
| 前台网站 | 3000 | http://localhost:3000 |
| 管理后台 | 3001 | http://localhost:3001 |
| API服务 | 3002 | http://localhost:3002 |
| Swagger文档 | 3002/api/docs | http://localhost:3002/api/docs |
| Prisma Studio | 5555 | http://localhost:5555 |