# CC Scale B2B外贸平台测试文档

**文档版本**：1.0
**更新日期**：2026-05-04
**测试环境**：Windows 11, Node.js 18+, Next.js 14, NestJS 10
**服务地址**：
- Web 前端：http://localhost:3000
- Admin 后台：http://localhost:3001
- API：http://localhost:8000

---

## 1. 测试策略

### 1.1 测试类型

| 测试类型 | 描述 | 工具/框架 |
|---------|------|----------|
| 单元测试 | 验证独立函数、组件的业务逻辑 | Vitest / Jest |
| 集成测试 | 验证模块间交互、API接口、数据持久化 | Vitest + Supertest |
| E2E测试 | 模拟用户真实操作流程 | Playwright |
| 性能测试 | 测量页面加载、API响应、渲染性能 | Lighthouse / PageSpeed Insights |
| 兼容性测试 | 验证多浏览器、多设备显示一致性 | Playwright Browser Matrix |

### 1.2 测试金字塔

```
                    /\
                   /E2E\
                  /------\
                 /集成测试 \
                /----------\
               /  单元测试   \
              /--------------\
```

- **单元测试 (70%)**：覆盖核心业务逻辑、工具函数、数据验证
- **集成测试 (20%)**：覆盖API路由、数据库操作、模块间交互
- **E2E测试 (10%)**：覆盖关键用户路径：登录、产品询价、询盘提交

### 1.3 测试覆盖率目标

| 层级 | 覆盖率目标 |
|------|-----------|
| 单元测试 | 核心模块 > 80% |
| 集成测试 | API端点 > 90% |
| E2E测试 | 关键用户路径 100% |

---

## 2. 单元测试

### 2.1 测试框架配置

项目目前未安装单元测试框架，建议安装 Vitest。

**安装命令**：

```bash
# API (NestJS)
cd apps/api
npm install -D vitest @nestjs/testing

# Web / Admin (Next.js)
cd apps/web
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Vitest 配置文件示例** (`apps/api/vitest.config.ts`)：

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2.2 编写单元测试

**示例：产品DTO验证测试** (`apps/api/src/products/dto/product.dto.spec.ts`)：

```typescript
import { describe, it, expect } from 'vitest';
import { CreateProductDto } from './create-product.dto';
import { validate } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

describe('CreateProductDto', () => {
  it('should validate required fields', async () => {
    const dto = new CreateProductDto();
    dto.sku = 'TEST-001';
    dto.nameEn = 'Test Product';
    dto.nameZh = '测试产品';
    dto.slug = 'test-product';
    dto.categoryId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when required fields are missing', async () => {
    const dto = new CreateProductDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

**示例：Zustand Store 测试** (`apps/web/store/inquiry.spec.ts`)：

```typescript
import { describe, it, expect } from 'vitest';
import { useInquiryStore } from './inquiry';

describe('useInquiryStore', () => {
  it('should add item to cart', () => {
    const store = useInquiryStore.getState();
    store.addItem({ id: 1, name: 'Test', price: 100, quantity: 1 });

    const items = useInquiryStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Test');
  });

  it('should remove item from cart', () => {
    const store = useInquiryStore.getState();
    store.addItem({ id: 1, name: 'Test', price: 100, quantity: 1 });
    store.removeItem(1);

    const items = useInquiryStore.getState().items;
    expect(items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const store = useInquiryStore.getState();
    store.addItem({ id: 1, name: 'Test', price: 100, quantity: 1 });
    store.updateQuantity(1, 5);

    const item = useInquiryStore.getState().items.find(i => i.id === 1);
    expect(item?.quantity).toBe(5);
  });

  it('should clear cart', () => {
    const store = useInquiryStore.getState();
    store.addItem({ id: 1, name: 'Test', price: 100, quantity: 1 });
    store.addItem({ id: 2, name: 'Test2', price: 200, quantity: 2 });
    store.clearCart();

    const items = useInquiryStore.getState().items;
    expect(items).toHaveLength(0);
  });
});
```

### 2.3 运行单元测试

```bash
# 运行所有单元测试
cd apps/api && npx vitest run
cd apps/web && npx vitest run

# 监听模式（开发时）
cd apps/api && npx vitest
```

---

## 3. 集成测试

### 3.1 API集成测试

使用 Vitest + Supertest 测试 NestJS API 端点。

**安装依赖**：

```bash
cd apps/api
npm install -D supertest @types/supertest
```

**NestJS 测试模块配置** (`apps/api/src/app.e2e-spec.ts`)：

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestkit/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/products (GET)', () => {
    it('should return paginated products', () => {
      return request(app.getHttpServer())
        .get('/api/products')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should filter products by category', () => {
      return request(app.getHttpServer())
        .get('/api/products?categoryId=1')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should search products by keyword', () => {
      return request(app.getHttpServer())
        .get('/api/products?search=scale')
        .expect(200);
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should return JWT token with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@ccscale.com', password: 'admin123' })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@ccscale.com', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('/api/inquiries (POST)', () => {
    it('should create new inquiry', () => {
      return request(app.getHttpServer())
        .post('/api/inquiries')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+86 13800138000',
          company: 'Test Company',
          country: 'China',
          city: 'Beijing',
          message: 'Interested in your products',
          items: [{ productId: 1, quantity: 10 }],
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/api/inquiries')
        .send({ name: 'Test' })
        .expect(400);
    });
  });
});
```

### 3.2 数据库集成测试

使用内存数据库或测试数据库进行数据层测试。

**测试数据库配置**：

```typescript
// apps/api/src/database/database.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [Product, Category, Inquiry],
      synchronize: true,
    }),
  ],
})
export class TestDatabaseModule {}
```

---

## 4. E2E测试

### 4.1 Playwright配置

项目已使用 Playwright MCP 进行手动E2E测试。建议配置自动化 Playwright 测试。

**安装 Playwright**：

```bash
npm install -D @playwright/test
npx playwright install chromium
```

**配置文件** (`playwright.config.ts`)：

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

### 4.2 编写E2E测试

**目录结构**：

```
tests/
  e2e/
    web/
      products.spec.ts
      inquiry.spec.ts
      navigation.spec.ts
    admin/
      login.spec.ts
      products.spec.ts
      inquiries.spec.ts
```

**示例：产品列表页测试** (`tests/e2e/web/products.spec.ts`)：

```typescript
import { test, expect } from '@playwright/test';

test.describe('产品列表页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zh/products');
  });

  test('页面标题正确', async ({ page }) => {
    await expect(page).toHaveTitle(/CC Scale/);
  });

  test('产品分类筛选正常工作', async ({ page }) => {
    // 点击"体重秤"分类
    await page.click('button:has-text("体重秤")');
    // 验证URL更新
    await expect(page).toHaveURL(/category=body-scales/);
  });

  test('产品搜索功能正常', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await searchInput.fill('体重秤');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/search=体重秤/);
  });

  test('产品卡片显示完整信息', async ({ page }) => {
    const productCard = page.locator('[data-testid="product-card"]').first();
    await expect(productCard.locator('img')).toBeVisible();
    await expect(productCard.locator('h3')).toBeVisible();
  });

  test('点击产品跳转到详情页', async ({ page }) => {
    await page.click('[data-testid="product-card"] >> nth=0');
    await expect(page).toHaveURL(/\/products\//);
  });

  test('加入询价车功能正常', async ({ page }) => {
    const addButton = page.locator('button:has-text("加入询价车")').first();
    await addButton.click();
    // 验证购物车计数更新
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toBeVisible();
  });
});
```

**示例：询盘提交测试** (`tests/e2e/web/inquiry.spec.ts`)：

```typescript
import { test, expect } from '@playwright/test';

test.describe('询盘提交流程', () => {
  test('完整询盘提交流程', async ({ page }) => {
    await page.goto('/zh/inquiry');

    // 验证询价单中有产品
    const productItems = page.locator('[data-testid="inquiry-item"]');
    await expect(productItems.first()).toBeVisible();

    // 填写询盘表单
    await page.fill('input[name="name"]', '张三');
    await page.fill('input[name="email"]', 'zhangsan@example.com');
    await page.fill('input[name="phone"]', '+86 13800138000');
    await page.fill('input[name="company"]', '测试公司');
    await page.fill('input[name="country"]', '中国');
    await page.fill('input[name="city"]', '杭州');
    await page.fill('textarea[name="message"]', '我们对您的产品感兴趣，请联系我。');

    // 提交表单
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // 验证提交成功
    await expect(page.locator('text=提交成功')).toBeVisible({ timeout: 10000 });
  });

  test('表单必填字段验证', async ({ page }) => {
    await page.goto('/zh/inquiry');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // 验证错误提示
    await expect(page.locator('text=请填写姓名')).toBeVisible();
    await expect(page.locator('text=请填写邮箱')).toBeVisible();
  });
});
```

**示例：Admin登录测试** (`tests/e2e/admin/login.spec.ts`)：

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin 登录', () => {
  test('成功登录并跳转到仪表板', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    await page.fill('input[type="email"]', 'admin@ccscale.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3001/dashboard');
    await expect(page.locator('text=仪表板')).toBeVisible();
  });

  test('错误密码登录失败', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    await page.fill('input[type="email"]', 'admin@ccscale.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=登录失败')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('未登录访问受保护页面重定向到登录页', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard');
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('Token过期自动重定向', async ({ page }) => {
    // 设置过期的token
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'expired_token');
    });

    await page.goto('http://localhost:3001/inquiries');
    await expect(page).toHaveURL('http://localhost:3001/login');
  });
});
```

### 4.3 运行E2E测试

```bash
# 运行所有E2E测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/e2e/web/products.spec.ts

# 运行特定测试用例
npx playwright test tests/e2e/web/products.spec.ts --grep "产品搜索"

# 交互模式（调试）
npx playwright test --ui

# 生成测试报告
npx playwright show-report
```

---

## 5. 测试用例

### 5.1 前台功能测试

#### 5.1.1 产品列表页测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| PL-001 | 页面加载 | 访问 /zh/products | 页面正常显示产品列表 | P0 |
| PL-002 | 页面标题 | 访问 /zh/products | 标题包含"CC Scale" | P1 |
| PL-003 | 产品分类筛选 | 点击"体重秤"分类 | 只显示体重秤分类产品 | P0 |
| PL-004 | 产品搜索 | 输入"体重秤"回车 | 显示搜索结果 | P0 |
| PL-005 | 产品分页 | 点击"下一页" | 加载下一页产品 | P1 |
| PL-006 | 产品卡片图片 | 查看产品卡片 | 图片正常加载 | P1 |
| PL-007 | 加入询价车 | 点击"加入询价车" | 购物车计数+1 | P0 |
| PL-008 | 产品详情跳转 | 点击产品卡片 | 跳转到产品详情页 | P0 |

#### 5.1.2 产品详情页测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| PD-001 | 页面加载 | 访问有效产品slug | 显示产品详情 | P0 |
| PD-002 | 产品图片 | 查看产品图片 | 图片正确显示 | P0 |
| PD-003 | 产品规格 | 查看规格信息 | 规格参数完整 | P1 |
| PD-004 | 价格区间 | 查看价格 | 显示MOQ和价格范围 | P1 |
| PD-005 | 询盘按钮 | 点击"询价此产品" | 弹出询盘表单或跳转询价页 | P0 |
| PD-006 | 分享功能 | 点击分享按钮 | 显示分享选项 | P2 |
| PD-007 | 相关产品 | 页面底部 | 显示相关产品推荐 | P2 |
| PD-008 | 返回列表 | 点击返回 | 返回产品列表页 | P1 |

#### 5.1.3 询盘提交测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| IQ-001 | 页面加载 | 访问 /zh/inquiry | 显示询价单内容 | P0 |
| IQ-002 | 产品数量修改 | 修改产品数量 | 数量更新 | P0 |
| IQ-003 | 移除产品 | 点击移除按钮 | 产品从询价单移除 | P0 |
| IQ-004 | 清空询价单 | 点击"清空" | 所有产品移除 | P0 |
| IQ-005 | 表单填写 | 填写所有必填字段 | 字段正确保存 | P0 |
| IQ-006 | 表单验证 | 提交空表单 | 显示错误提示 | P0 |
| IQ-007 | 邮箱格式验证 | 输入无效邮箱 | 提示邮箱格式错误 | P0 |
| IQ-008 | 询盘提交 | 填写完整后提交 | 提交成功提示 | P0 |
| IQ-009 | 提交失败 | 网络错误时提交 | 显示错误信息 | P1 |

#### 5.1.4 多语言切换测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| ML-001 | 语言切换 | 点击EN/中文切换 | 页面语言切换 | P0 |
| ML-002 | URL更新 | 切换语言 | URL从/zh/变为/en/ | P0 |
| ML-003 | 内容翻译 | 切换到英文 | 所有可见内容翻译为英文 | P0 |
| ML-004 | 语言持久化 | 刷新页面 | 保持当前语言 | P1 |

#### 5.1.5 响应式布局测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| RS-001 | 桌面端 | 1920px宽度 | 正常显示三栏布局 | P1 |
| RS-002 | 平板端 | 768px宽度 | 切换为两栏布局 | P1 |
| RS-003 | 移动端 | 375px宽度 | 单栏布局，菜单折叠 | P0 |
| RS-004 | 触摸操作 | 移动端点击 | 按钮响应正常 | P1 |

### 5.2 后台功能测试

#### 5.2.1 登录认证测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| AD-001 | 成功登录 | 正确账号密码 | 跳转仪表板 | P0 |
| AD-002 | 错误密码 | 密码错误 | 提示登录失败 | P0 |
| AD-003 | 空白提交 | 不填内容直接提交 | 表单验证提示 | P0 |
| AD-004 | 未登录访问 | 直接访问受保护页 | 重定向到登录页 | P0 |
| AD-005 | Token过期 | 过期token访问API | 返回401 | P0 |
| AD-006 | 登出功能 | 点击退出按钮 | 清除token并跳转登录页 | P0 |

#### 5.2.2 产品管理测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| PM-001 | 产品列表 | 访问产品管理页 | 显示产品列表 | P0 |
| PM-002 | 产品搜索 | 搜索产品名称 | 显示搜索结果 | P1 |
| PM-003 | 添加产品 | 填写表单并保存 | 产品创建成功 | P0 |
| PM-004 | 编辑产品 | 修改产品信息并保存 | 产品更新成功 | P0 |
| PM-005 | 删除产品 | 删除产品 | 产品从列表移除 | P0 |
| PM-006 | 图片上传 | 上传产品图片 | 图片上传并显示 | P1 |
| PM-007 | Slug自动生成 | 输入产品名(EN) | Slug自动填充 | P2 |

#### 5.2.3 询盘管理测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| IM-001 | 询盘列表 | 访问询盘管理页 | 显示询盘列表 | P0 |
| IM-002 | 状态筛选 | 选择状态过滤 | 显示该状态询盘 | P1 |
| IM-003 | 来源筛选 | 选择渠道过滤 | 显示该渠道询盘 | P1 |
| IM-004 | 查看详情 | 点击查看按钮 | 显示询盘详情 | P0 |
| IM-005 | 更新状态 | 修改询盘状态 | 状态更新成功 | P0 |
| IM-006 | 快捷回复 | 点击回复按钮 | 标记为已回复 | P0 |
| IM-007 | 询盘超时标记 | 查看超时询盘 | 显示超时警告 | P1 |

#### 5.2.4 用户权限测试

| 用例ID | 测试项 | 操作 | 预期结果 | 优先级 |
|--------|--------|------|---------|--------|
| UP-001 | 用户列表 | 管理员查看用户 | 显示所有用户 | P0 |
| UP-002 | 添加用户 | 创建新用户 | 用户创建成功 | P0 |
| UP-003 | 编辑用户 | 修改用户信息 | 用户更新成功 | P0 |
| UP-004 | 删除用户 | 删除用户账号 | 用户从列表移除 | P0 |
| UP-005 | 角色权限 | 查看者角色登录 | 仅可查看数据 | P1 |
| UP-006 | 角色权限 | 编辑者角色登录 | 可查看和编辑 | P1 |

### 5.3 API测试

#### 5.3.1 产品API测试

| 用例ID | 接口 | 方法 | 测试数据 | 预期结果 | 优先级 |
|--------|------|------|---------|---------|--------|
| API-P-001 | /api/products | GET | - | 返回产品列表(200) | P0 |
| API-P-002 | /api/products | GET | ?categoryId=1 | 返回该分类产品(200) | P0 |
| API-P-003 | /api/products | GET | ?search=体重秤 | 返回搜索结果(200) | P0 |
| API-P-004 | /api/products/:id | GET | id=1 | 返回产品详情(200) | P0 |
| API-P-005 | /api/products/:id | GET | id=999 | 返回404 | P0 |
| API-P-006 | /api/products | POST | 完整产品数据 | 创建产品(201) | P0 |
| API-P-007 | /api/products | POST | 缺少必填字段 | 返回400验证错误 | P0 |
| API-P-008 | /api/products/:id | PUT | 更新产品数据 | 更新产品(200) | P0 |
| API-P-009 | /api/products/:id | DELETE | id=1 | 删除产品(200) | P0 |

#### 5.3.2 认证API测试

| 用例ID | 接口 | 方法 | 测试数据 | 预期结果 | 优先级 |
|--------|------|------|---------|---------|--------|
| API-A-001 | /api/auth/login | POST | 正确账号密码 | 返回JWT token(201) | P0 |
| API-A-002 | /api/auth/login | POST | 错误密码 | 返回401 | P0 |
| API-A-003 | /api/auth/login | POST | 不存在账号 | 返回401 | P0 |
| API-A-004 | /api/auth/register | POST | 新用户数据 | 创建用户并返回token(201) | P1 |
| API-A-005 | /api/auth/profile | GET | 有效Token | 返回用户信息(200) | P0 |
| API-A-006 | /api/auth/profile | GET | 过期/无效Token | 返回401 | P0 |

#### 5.3.3 上传API测试

| 用例ID | 接口 | 方法 | 测试数据 | 预期结果 | 优先级 |
|--------|------|------|---------|---------|--------|
| API-U-001 | /api/upload | POST | 图片文件(JPG) | 返回文件URL(201) | P0 |
| API-U-002 | /api/upload | POST | 图片文件(PNG) | 返回文件URL(201) | P0 |
| API-U-003 | /api/upload | POST | PDF文件 | 返回文件URL(201) | P0 |
| API-U-004 | /api/upload | POST | 超大文件(>10MB) | 返回413错误 | P0 |
| API-U-005 | /api/upload | POST | 不支持格式(.exe) | 返回400错误 | P0 |
| API-U-006 | /api/upload | POST | 无Token | 返回401 | P0 |

---

## 6. 性能测试

### 6.1 首屏加载时间

| 页面 | 目标加载时间 | 测量方法 |
|------|-------------|----------|
| 首页 | < 2s | Lighthouse FCP |
| 产品列表页 | < 3s | Lighthouse FCP |
| 产品详情页 | < 2.5s | Lighthouse FCP |
| 询盘提交页 | < 2s | Lighthouse FCP |

**测量命令**：

```bash
# 使用 Lighthouse CLI
npx lighthouse http://localhost:3000/zh --output html --output-path ./lighthouse-report.html
```

### 6.2 API响应时间

| API端点 | 目标响应时间 | 优先级 |
|---------|-------------|--------|
| GET /api/products | < 500ms | P0 |
| GET /api/products/:id | < 300ms | P0 |
| POST /api/auth/login | < 1s | P0 |
| POST /api/inquiries | < 1s | P0 |
| GET /api/analytics | < 2s | P1 |

**测试脚本** (`tests/performance/api-benchmark.ts`)：

```typescript
import { fetch } from 'undici';

async function benchmarkEndpoint(url: string, iterations = 10) {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await fetch(url);
    times.push(Date.now() - start);
  }

  const avg = times.reduce((a, b) => a + b) / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`${url}: Avg: ${avg}ms, Min: ${min}ms, Max: ${max}ms`);
}

await benchmarkEndpoint('http://localhost:8000/api/products');
await benchmarkEndpoint('http://localhost:8000/api/products/1');
```

### 6.3 Lighthouse审计

使用 Playwright 集成 Lighthouse：

```typescript
import { test, expect } from '@playwright/test';
import { chromium } from '@playwright/test';

test('Lighthouse performance audit', async ({ page }) => {
  const browser = await chromium.launch();
  const page2 = await browser.newPage();

  await page2.goto('http://localhost:3000/zh');

  // 等待页面完全加载
  await page2.waitForLoadState('networkidle');

  // Lighthouse 审计
  const lighthouse = await page2.evaluate(() => {
    return import('lighthouse').then(({ default: lh }) =>
      lh.startPageGather('mobile', {
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
      })
    );
  });

  console.log('Performance Score:', lighthouse.performance);
  expect(lighthouse.performance).toBeGreaterThan(80);

  await browser.close();
});
```

---

## 7. 兼容性测试

### 7.1 浏览器兼容性

| 浏览器 | 最低版本 | 测试重点 |
|--------|---------|----------|
| Chrome | 90+ | 核心功能 |
| Firefox | 88+ | CSS兼容性 |
| Safari | 14+ | WebKit特定 |
| Edge | 90+ | Chromium兼容性 |

**Playwright浏览器矩阵测试**：

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'edge', use: { channel: 'msedge' } },
  ],
});
```

### 7.2 移动设备兼容性

| 设备 | 屏幕尺寸 | 测试重点 |
|------|---------|----------|
| iPhone 12 | 390x844 | 触摸交互 |
| iPhone SE | 375x667 | 小屏幕适配 |
| iPad | 768x1024 | 平板布局 |
| Pixel 5 | 393x851 | Android兼容性 |

**响应式测试用例**：

```typescript
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`响应式布局 - ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/zh/products');

    // 验证布局适应性
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 移动端验证汉堡菜单
    if (viewport.name === 'mobile') {
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(menuButton).toBeVisible();
    }
  });
}
```

---

## 8. 测试报告

### 8.1 测试报告模板

```markdown
# 测试报告 - [版本号]

**测试日期**：[日期]
**测试人员**：[姓名]
**测试环境**：[环境信息]

## 测试总览

| 模块 | 用例总数 | 通过 | 失败 | 阻塞 |
|------|---------|------|------|------|
| [模块1] | X | X | X | X |
| [模块2] | X | X | X | X |
| **合计** | **X** | **X** | **X** | **X** |

## 测试结果详情

### 通过的测试用例

| 用例ID | 测试项 | 结果 | 备注 |
|--------|--------|------|------|
| ... | ... | 通过 | - |

### 失败的测试用例

| 用例ID | 测试项 | 实际结果 | 预期结果 | 截图 |
|--------|--------|---------|---------|------|
| ... | ... | ... | ... | [链接] |

### 阻塞的测试用例

| 用例ID | 测试项 | 阻塞原因 | 优先级 |
|--------|--------|---------|--------|
| ... | ... | ... | P0 |

## Bug汇总

| 优先级 | Bug描述 | 影响模块 | 修复建议 |
|--------|---------|---------|---------|
| P0 | ... | ... | ... |
| P1 | ... | ... | ... |

## 测试结论

[总结测试是否通过，是否可以发布]
```

### 8.2 问题跟踪

使用以下格式跟踪测试发现的问题：

| 字段 | 说明 |
|------|------|
| Bug ID | 唯一标识符 (如BUG-001) |
| 标题 | 简洁描述问题 |
| 描述 | 详细说明 |
| 复现步骤 | 1. 2. 3. |
| 预期结果 | 应该如何 |
| 实际结果 | 实际发生了什么 |
| 优先级 | P0/P1/P2/P3 |
| 指派 | 负责人 |
| 状态 | Open/In Progress/Resolved/Closed |
| 截图/日志 | 证据 |

---

## 附录A：已知问题列表

基于 2026-04-13 测试执行的已知问题：

| 优先级 | 问题描述 | 影响页面 | 状态 |
|--------|---------|---------|------|
| P0 | Web询价表单提交失败 | 询价单页 | 待修复 |
| P0 | inquiry.submit i18n key未翻译 | 询价单页 | 待修复 |
| P0 | inquiry.responseTime i18n key未翻译 | 联系我们页 | 待修复 |
| P1 | /zh/downloads返回404 | 下载中心 | 待修复 |
| P1 | Admin Token过期无自动重定向 | 询盘管理 | 待修复 |
| P2 | 产品详情页Product Not Found | 产品详情页 | 待修复 |
| P2 | Newsletter订阅无反馈 | Footer | 待修复 |
| P3 | React Hydration错误 | 所有页面 | 待修复 |

---

## 附录B：测试环境搭建

### B.1 本地环境要求

- Node.js >= 18
- npm >= 9
- SQLite (或 PostgreSQL/MySQL)
- 端口 3000, 3001, 8000 可用

### B.2 测试数据准备

```bash
# 初始化测试数据库
cd apps/api
npm run db:seed

# 创建测试账号
# 邮箱: admin@ccscale.com
# 密码: admin123
```

### B.3 CI/CD集成

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:unit

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

*文档生成时间：2026-05-04*
