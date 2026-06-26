# CC Scale B2B澶栬锤骞冲彴娴嬭瘯鏂囨。

**鏂囨。鐗堟湰**锛?.0
**鏇存柊鏃ユ湡**锛?026-05-04
**娴嬭瘯鐜**锛歐indows 11, Node.js 18+, Next.js 14, NestJS 10
**鏈嶅姟鍦板潃**锛?- Web 鍓嶇锛歨ttp://localhost:3000
- Admin 鍚庡彴锛歨ttp://localhost:3001
- API锛歨ttp://localhost:8000

---

## 1. 娴嬭瘯绛栫暐

### 1.1 娴嬭瘯绫诲瀷

| 娴嬭瘯绫诲瀷 | 鎻忚堪 | 宸ュ叿/妗嗘灦 |
|---------|------|----------|
| 鍗曞厓娴嬭瘯 | 楠岃瘉鐙珛鍑芥暟銆佺粍浠剁殑涓氬姟閫昏緫 | Vitest / Jest |
| 闆嗘垚娴嬭瘯 | 楠岃瘉妯″潡闂翠氦浜掋€丄PI鎺ュ彛銆佹暟鎹寔涔呭寲 | Vitest + Supertest |
| E2E娴嬭瘯 | 妯℃嫙鐢ㄦ埛鐪熷疄鎿嶄綔娴佺▼ | Playwright |
| 鎬ц兘娴嬭瘯 | 娴嬮噺椤甸潰鍔犺浇銆丄PI鍝嶅簲銆佹覆鏌撴€ц兘 | Lighthouse / PageSpeed Insights |
| 鍏煎鎬ф祴璇?| 楠岃瘉澶氭祻瑙堝櫒銆佸璁惧鏄剧ず涓€鑷存€?| Playwright Browser Matrix |

### 1.2 娴嬭瘯閲戝瓧濉?
```
                    /\
                   /E2E\
                  /------\
                 /闆嗘垚娴嬭瘯 \
                /----------\
               /  鍗曞厓娴嬭瘯   \
              /--------------\
```

- **鍗曞厓娴嬭瘯 (70%)**锛氳鐩栨牳蹇冧笟鍔￠€昏緫銆佸伐鍏峰嚱鏁般€佹暟鎹獙璇?- **闆嗘垚娴嬭瘯 (20%)**锛氳鐩朅PI璺敱銆佹暟鎹簱鎿嶄綔銆佹ā鍧楅棿浜や簰
- **E2E娴嬭瘯 (10%)**锛氳鐩栧叧閿敤鎴疯矾寰勶細鐧诲綍銆佷骇鍝佽浠枫€佽鐩樻彁浜?
### 1.3 娴嬭瘯瑕嗙洊鐜囩洰鏍?
| 灞傜骇 | 瑕嗙洊鐜囩洰鏍?|
|------|-----------|
| 鍗曞厓娴嬭瘯 | 鏍稿績妯″潡 > 80% |
| 闆嗘垚娴嬭瘯 | API绔偣 > 90% |
| E2E娴嬭瘯 | 鍏抽敭鐢ㄦ埛璺緞 100% |

---

## 2. 鍗曞厓娴嬭瘯

### 2.1 娴嬭瘯妗嗘灦閰嶇疆

椤圭洰鐩墠鏈畨瑁呭崟鍏冩祴璇曟鏋讹紝寤鸿瀹夎 Vitest銆?
**瀹夎鍛戒护**锛?
```bash
# API (NestJS)
cd apps/api
npm install -D vitest @nestjs/testing

# Web / Admin (Next.js)
cd apps/web
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Vitest 閰嶇疆鏂囦欢绀轰緥** (`apps/api/vitest.config.ts`)锛?
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

### 2.2 缂栧啓鍗曞厓娴嬭瘯

**绀轰緥锛氫骇鍝丏TO楠岃瘉娴嬭瘯** (`apps/api/src/products/dto/product.dto.spec.ts`)锛?
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
    dto.nameZh = '娴嬭瘯浜у搧';
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

**绀轰緥锛歓ustand Store 娴嬭瘯** (`apps/web/store/inquiry.spec.ts`)锛?
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

### 2.3 杩愯鍗曞厓娴嬭瘯

```bash
# 杩愯鎵€鏈夊崟鍏冩祴璇?cd apps/api && npx vitest run
cd apps/web && npx vitest run

# 鐩戝惉妯″紡锛堝紑鍙戞椂锛?cd apps/api && npx vitest
```

---

## 3. 闆嗘垚娴嬭瘯

### 3.1 API闆嗘垚娴嬭瘯

浣跨敤 Vitest + Supertest 娴嬭瘯 NestJS API 绔偣銆?
**瀹夎渚濊禆**锛?
```bash
cd apps/api
npm install -D supertest @types/supertest
```

**NestJS 娴嬭瘯妯″潡閰嶇疆** (`apps/api/src/app.e2e-spec.ts`)锛?
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
        .send({ email: 'admin@zzscale.com', password: 'admin123' })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@zzscale.com', password: 'wrongpassword' })
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

### 3.2 鏁版嵁搴撻泦鎴愭祴璇?
浣跨敤鍐呭瓨鏁版嵁搴撴垨娴嬭瘯鏁版嵁搴撹繘琛屾暟鎹眰娴嬭瘯銆?
**娴嬭瘯鏁版嵁搴撻厤缃?*锛?
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

## 4. E2E娴嬭瘯

### 4.1 Playwright閰嶇疆

椤圭洰宸蹭娇鐢?Playwright MCP 杩涜鎵嬪姩E2E娴嬭瘯銆傚缓璁厤缃嚜鍔ㄥ寲 Playwright 娴嬭瘯銆?
**瀹夎 Playwright**锛?
```bash
npm install -D @playwright/test
npx playwright install chromium
```

**閰嶇疆鏂囦欢** (`playwright.config.ts`)锛?
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

### 4.2 缂栧啓E2E娴嬭瘯

**鐩綍缁撴瀯**锛?
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

**绀轰緥锛氫骇鍝佸垪琛ㄩ〉娴嬭瘯** (`tests/e2e/web/products.spec.ts`)锛?
```typescript
import { test, expect } from '@playwright/test';

test.describe('浜у搧鍒楄〃椤?, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zh/products');
  });

  test('椤甸潰鏍囬姝ｇ‘', async ({ page }) => {
    await expect(page).toHaveTitle(/CC Scale/);
  });

  test('浜у搧鍒嗙被绛涢€夋甯稿伐浣?, async ({ page }) => {
    // 鐐瑰嚮"浣撻噸绉?鍒嗙被
    await page.click('button:has-text("浣撻噸绉?)');
    // 楠岃瘉URL鏇存柊
    await expect(page).toHaveURL(/category=body-scales/);
  });

  test('浜у搧鎼滅储鍔熻兘姝ｅ父', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="鎼滅储"]');
    await searchInput.fill('浣撻噸绉?);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/search=浣撻噸绉?);
  });

  test('浜у搧鍗＄墖鏄剧ず瀹屾暣淇℃伅', async ({ page }) => {
    const productCard = page.locator('[data-testid="product-card"]').first();
    await expect(productCard.locator('img')).toBeVisible();
    await expect(productCard.locator('h3')).toBeVisible();
  });

  test('鐐瑰嚮浜у搧璺宠浆鍒拌鎯呴〉', async ({ page }) => {
    await page.click('[data-testid="product-card"] >> nth=0');
    await expect(page).toHaveURL(/\/products\//);
  });

  test('鍔犲叆璇环杞﹀姛鑳芥甯?, async ({ page }) => {
    const addButton = page.locator('button:has-text("鍔犲叆璇环杞?)').first();
    await addButton.click();
    // 楠岃瘉璐墿杞﹁鏁版洿鏂?    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toBeVisible();
  });
});
```

**绀轰緥锛氳鐩樻彁浜ゆ祴璇?* (`tests/e2e/web/inquiry.spec.ts`)锛?
```typescript
import { test, expect } from '@playwright/test';

test.describe('璇㈢洏鎻愪氦娴佺▼', () => {
  test('瀹屾暣璇㈢洏鎻愪氦娴佺▼', async ({ page }) => {
    await page.goto('/zh/inquiry');

    // 楠岃瘉璇环鍗曚腑鏈変骇鍝?    const productItems = page.locator('[data-testid="inquiry-item"]');
    await expect(productItems.first()).toBeVisible();

    // 濉啓璇㈢洏琛ㄥ崟
    await page.fill('input[name="name"]', '寮犱笁');
    await page.fill('input[name="email"]', 'zhangsan@example.com');
    await page.fill('input[name="phone"]', '+86 13800138000');
    await page.fill('input[name="company"]', '娴嬭瘯鍏徃');
    await page.fill('input[name="country"]', '涓浗');
    await page.fill('input[name="city"]', '鏉窞');
    await page.fill('textarea[name="message"]', '鎴戜滑瀵规偍鐨勪骇鍝佹劅鍏磋叮锛岃鑱旂郴鎴戙€?);

    // 鎻愪氦琛ㄥ崟
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // 楠岃瘉鎻愪氦鎴愬姛
    await expect(page.locator('text=鎻愪氦鎴愬姛')).toBeVisible({ timeout: 10000 });
  });

  test('琛ㄥ崟蹇呭～瀛楁楠岃瘉', async ({ page }) => {
    await page.goto('/zh/inquiry');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // 楠岃瘉閿欒鎻愮ず
    await expect(page.locator('text=璇峰～鍐欏鍚?)).toBeVisible();
    await expect(page.locator('text=璇峰～鍐欓偖绠?)).toBeVisible();
  });
});
```

**绀轰緥锛欰dmin鐧诲綍娴嬭瘯** (`tests/e2e/admin/login.spec.ts`)锛?
```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin 鐧诲綍', () => {
  test('鎴愬姛鐧诲綍骞惰烦杞埌浠〃鏉?, async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    await page.fill('input[type="email"]', 'admin@zzscale.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3001/dashboard');
    await expect(page.locator('text=浠〃鏉?)).toBeVisible();
  });

  test('閿欒瀵嗙爜鐧诲綍澶辫触', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    await page.fill('input[type="email"]', 'admin@zzscale.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=鐧诲綍澶辫触')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('鏈櫥褰曡闂彈淇濇姢椤甸潰閲嶅畾鍚戝埌鐧诲綍椤?, async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard');
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('Token杩囨湡鑷姩閲嶅畾鍚?, async ({ page }) => {
    // 璁剧疆杩囨湡鐨則oken
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'expired_token');
    });

    await page.goto('http://localhost:3001/inquiries');
    await expect(page).toHaveURL('http://localhost:3001/login');
  });
});
```

### 4.3 杩愯E2E娴嬭瘯

```bash
# 杩愯鎵€鏈塃2E娴嬭瘯
npx playwright test

# 杩愯鐗瑰畾娴嬭瘯鏂囦欢
npx playwright test tests/e2e/web/products.spec.ts

# 杩愯鐗瑰畾娴嬭瘯鐢ㄤ緥
npx playwright test tests/e2e/web/products.spec.ts --grep "浜у搧鎼滅储"

# 浜や簰妯″紡锛堣皟璇曪級
npx playwright test --ui

# 鐢熸垚娴嬭瘯鎶ュ憡
npx playwright show-report
```

---

## 5. 娴嬭瘯鐢ㄤ緥

### 5.1 鍓嶅彴鍔熻兘娴嬭瘯

#### 5.1.1 浜у搧鍒楄〃椤垫祴璇?
| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| PL-001 | 椤甸潰鍔犺浇 | 璁块棶 /zh/products | 椤甸潰姝ｅ父鏄剧ず浜у搧鍒楄〃 | P0 |
| PL-002 | 椤甸潰鏍囬 | 璁块棶 /zh/products | 鏍囬鍖呭惈"CC Scale" | P1 |
| PL-003 | 浜у搧鍒嗙被绛涢€?| 鐐瑰嚮"浣撻噸绉?鍒嗙被 | 鍙樉绀轰綋閲嶇Г鍒嗙被浜у搧 | P0 |
| PL-004 | 浜у搧鎼滅储 | 杈撳叆"浣撻噸绉?鍥炶溅 | 鏄剧ず鎼滅储缁撴灉 | P0 |
| PL-005 | 浜у搧鍒嗛〉 | 鐐瑰嚮"涓嬩竴椤? | 鍔犺浇涓嬩竴椤典骇鍝?| P1 |
| PL-006 | 浜у搧鍗＄墖鍥剧墖 | 鏌ョ湅浜у搧鍗＄墖 | 鍥剧墖姝ｅ父鍔犺浇 | P1 |
| PL-007 | 鍔犲叆璇环杞?| 鐐瑰嚮"鍔犲叆璇环杞? | 璐墿杞﹁鏁?1 | P0 |
| PL-008 | 浜у搧璇︽儏璺宠浆 | 鐐瑰嚮浜у搧鍗＄墖 | 璺宠浆鍒颁骇鍝佽鎯呴〉 | P0 |

#### 5.1.2 浜у搧璇︽儏椤垫祴璇?
| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| PD-001 | 椤甸潰鍔犺浇 | 璁块棶鏈夋晥浜у搧slug | 鏄剧ず浜у搧璇︽儏 | P0 |
| PD-002 | 浜у搧鍥剧墖 | 鏌ョ湅浜у搧鍥剧墖 | 鍥剧墖姝ｇ‘鏄剧ず | P0 |
| PD-003 | 浜у搧瑙勬牸 | 鏌ョ湅瑙勬牸淇℃伅 | 瑙勬牸鍙傛暟瀹屾暣 | P1 |
| PD-004 | 浠锋牸鍖洪棿 | 鏌ョ湅浠锋牸 | 鏄剧ずMOQ鍜屼环鏍艰寖鍥?| P1 |
| PD-005 | 璇㈢洏鎸夐挳 | 鐐瑰嚮"璇环姝や骇鍝? | 寮瑰嚭璇㈢洏琛ㄥ崟鎴栬烦杞浠烽〉 | P0 |
| PD-006 | 鍒嗕韩鍔熻兘 | 鐐瑰嚮鍒嗕韩鎸夐挳 | 鏄剧ず鍒嗕韩閫夐」 | P2 |
| PD-007 | 鐩稿叧浜у搧 | 椤甸潰搴曢儴 | 鏄剧ず鐩稿叧浜у搧鎺ㄨ崘 | P2 |
| PD-008 | 杩斿洖鍒楄〃 | 鐐瑰嚮杩斿洖 | 杩斿洖浜у搧鍒楄〃椤?| P1 |

#### 5.1.3 璇㈢洏鎻愪氦娴嬭瘯

| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| IQ-001 | 椤甸潰鍔犺浇 | 璁块棶 /zh/inquiry | 鏄剧ず璇环鍗曞唴瀹?| P0 |
| IQ-002 | 浜у搧鏁伴噺淇敼 | 淇敼浜у搧鏁伴噺 | 鏁伴噺鏇存柊 | P0 |
| IQ-003 | 绉婚櫎浜у搧 | 鐐瑰嚮绉婚櫎鎸夐挳 | 浜у搧浠庤浠峰崟绉婚櫎 | P0 |
| IQ-004 | 娓呯┖璇环鍗?| 鐐瑰嚮"娓呯┖" | 鎵€鏈変骇鍝佺Щ闄?| P0 |
| IQ-005 | 琛ㄥ崟濉啓 | 濉啓鎵€鏈夊繀濉瓧娈?| 瀛楁姝ｇ‘淇濆瓨 | P0 |
| IQ-006 | 琛ㄥ崟楠岃瘉 | 鎻愪氦绌鸿〃鍗?| 鏄剧ず閿欒鎻愮ず | P0 |
| IQ-007 | 閭鏍煎紡楠岃瘉 | 杈撳叆鏃犳晥閭 | 鎻愮ず閭鏍煎紡閿欒 | P0 |
| IQ-008 | 璇㈢洏鎻愪氦 | 濉啓瀹屾暣鍚庢彁浜?| 鎻愪氦鎴愬姛鎻愮ず | P0 |
| IQ-009 | 鎻愪氦澶辫触 | 缃戠粶閿欒鏃舵彁浜?| 鏄剧ず閿欒淇℃伅 | P1 |

#### 5.1.4 澶氳瑷€鍒囨崲娴嬭瘯

| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| ML-001 | 璇█鍒囨崲 | 鐐瑰嚮EN/涓枃鍒囨崲 | 椤甸潰璇█鍒囨崲 | P0 |
| ML-002 | URL鏇存柊 | 鍒囨崲璇█ | URL浠?zh/鍙樹负/en/ | P0 |
| ML-003 | 鍐呭缈昏瘧 | 鍒囨崲鍒拌嫳鏂?| 鎵€鏈夊彲瑙佸唴瀹圭炕璇戜负鑻辨枃 | P0 |
| ML-004 | 璇█鎸佷箙鍖?| 鍒锋柊椤甸潰 | 淇濇寔褰撳墠璇█ | P1 |

#### 5.1.5 鍝嶅簲寮忓竷灞€娴嬭瘯

| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| RS-001 | 妗岄潰绔?| 1920px瀹藉害 | 姝ｅ父鏄剧ず涓夋爮甯冨眬 | P1 |
| RS-002 | 骞虫澘绔?| 768px瀹藉害 | 鍒囨崲涓轰袱鏍忓竷灞€ | P1 |
| RS-003 | 绉诲姩绔?| 375px瀹藉害 | 鍗曟爮甯冨眬锛岃彍鍗曟姌鍙?| P0 |
| RS-004 | 瑙︽懜鎿嶄綔 | 绉诲姩绔偣鍑?| 鎸夐挳鍝嶅簲姝ｅ父 | P1 |

### 5.2 鍚庡彴鍔熻兘娴嬭瘯

#### 5.2.1 鐧诲綍璁よ瘉娴嬭瘯

| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| AD-001 | 鎴愬姛鐧诲綍 | 姝ｇ‘璐﹀彿瀵嗙爜 | 璺宠浆浠〃鏉?| P0 |
| AD-002 | 閿欒瀵嗙爜 | 瀵嗙爜閿欒 | 鎻愮ず鐧诲綍澶辫触 | P0 |
| AD-003 | 绌虹櫧鎻愪氦 | 涓嶅～鍐呭鐩存帴鎻愪氦 | 琛ㄥ崟楠岃瘉鎻愮ず | P0 |
| AD-004 | 鏈櫥褰曡闂?| 鐩存帴璁块棶鍙椾繚鎶ら〉 | 閲嶅畾鍚戝埌鐧诲綍椤?| P0 |
| AD-005 | Token杩囨湡 | 杩囨湡token璁块棶API | 杩斿洖401 | P0 |
| AD-006 | 鐧诲嚭鍔熻兘 | 鐐瑰嚮閫€鍑烘寜閽?| 娓呴櫎token骞惰烦杞櫥褰曢〉 | P0 |

#### 5.2.2 浜у搧绠＄悊娴嬭瘯

| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| PM-001 | 浜у搧鍒楄〃 | 璁块棶浜у搧绠＄悊椤?| 鏄剧ず浜у搧鍒楄〃 | P0 |
| PM-002 | 浜у搧鎼滅储 | 鎼滅储浜у搧鍚嶇О | 鏄剧ず鎼滅储缁撴灉 | P1 |
| PM-003 | 娣诲姞浜у搧 | 濉啓琛ㄥ崟骞朵繚瀛?| 浜у搧鍒涘缓鎴愬姛 | P0 |
| PM-004 | 缂栬緫浜у搧 | 淇敼浜у搧淇℃伅骞朵繚瀛?| 浜у搧鏇存柊鎴愬姛 | P0 |
| PM-005 | 鍒犻櫎浜у搧 | 鍒犻櫎浜у搧 | 浜у搧浠庡垪琛ㄧЩ闄?| P0 |
| PM-006 | 鍥剧墖涓婁紶 | 涓婁紶浜у搧鍥剧墖 | 鍥剧墖涓婁紶骞舵樉绀?| P1 |
| PM-007 | Slug鑷姩鐢熸垚 | 杈撳叆浜у搧鍚?EN) | Slug鑷姩濉厖 | P2 |

#### 5.2.3 璇㈢洏绠＄悊娴嬭瘯

| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| IM-001 | 璇㈢洏鍒楄〃 | 璁块棶璇㈢洏绠＄悊椤?| 鏄剧ず璇㈢洏鍒楄〃 | P0 |
| IM-002 | 鐘舵€佺瓫閫?| 閫夋嫨鐘舵€佽繃婊?| 鏄剧ず璇ョ姸鎬佽鐩?| P1 |
| IM-003 | 鏉ユ簮绛涢€?| 閫夋嫨娓犻亾杩囨护 | 鏄剧ず璇ユ笭閬撹鐩?| P1 |
| IM-004 | 鏌ョ湅璇︽儏 | 鐐瑰嚮鏌ョ湅鎸夐挳 | 鏄剧ず璇㈢洏璇︽儏 | P0 |
| IM-005 | 鏇存柊鐘舵€?| 淇敼璇㈢洏鐘舵€?| 鐘舵€佹洿鏂版垚鍔?| P0 |
| IM-006 | 蹇嵎鍥炲 | 鐐瑰嚮鍥炲鎸夐挳 | 鏍囪涓哄凡鍥炲 | P0 |
| IM-007 | 璇㈢洏瓒呮椂鏍囪 | 鏌ョ湅瓒呮椂璇㈢洏 | 鏄剧ず瓒呮椂璀﹀憡 | P1 |

#### 5.2.4 鐢ㄦ埛鏉冮檺娴嬭瘯

| 鐢ㄤ緥ID | 娴嬭瘯椤?| 鎿嶄綔 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|--------|------|---------|--------|
| UP-001 | 鐢ㄦ埛鍒楄〃 | 绠＄悊鍛樻煡鐪嬬敤鎴?| 鏄剧ず鎵€鏈夌敤鎴?| P0 |
| UP-002 | 娣诲姞鐢ㄦ埛 | 鍒涘缓鏂扮敤鎴?| 鐢ㄦ埛鍒涘缓鎴愬姛 | P0 |
| UP-003 | 缂栬緫鐢ㄦ埛 | 淇敼鐢ㄦ埛淇℃伅 | 鐢ㄦ埛鏇存柊鎴愬姛 | P0 |
| UP-004 | 鍒犻櫎鐢ㄦ埛 | 鍒犻櫎鐢ㄦ埛璐﹀彿 | 鐢ㄦ埛浠庡垪琛ㄧЩ闄?| P0 |
| UP-005 | 瑙掕壊鏉冮檺 | 鏌ョ湅鑰呰鑹茬櫥褰?| 浠呭彲鏌ョ湅鏁版嵁 | P1 |
| UP-006 | 瑙掕壊鏉冮檺 | 缂栬緫鑰呰鑹茬櫥褰?| 鍙煡鐪嬪拰缂栬緫 | P1 |

### 5.3 API娴嬭瘯

#### 5.3.1 浜у搧API娴嬭瘯

| 鐢ㄤ緥ID | 鎺ュ彛 | 鏂规硶 | 娴嬭瘯鏁版嵁 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|------|------|---------|---------|--------|
| API-P-001 | /api/products | GET | - | 杩斿洖浜у搧鍒楄〃(200) | P0 |
| API-P-002 | /api/products | GET | ?categoryId=1 | 杩斿洖璇ュ垎绫讳骇鍝?200) | P0 |
| API-P-003 | /api/products | GET | ?search=浣撻噸绉?| 杩斿洖鎼滅储缁撴灉(200) | P0 |
| API-P-004 | /api/products/:id | GET | id=1 | 杩斿洖浜у搧璇︽儏(200) | P0 |
| API-P-005 | /api/products/:id | GET | id=999 | 杩斿洖404 | P0 |
| API-P-006 | /api/products | POST | 瀹屾暣浜у搧鏁版嵁 | 鍒涘缓浜у搧(201) | P0 |
| API-P-007 | /api/products | POST | 缂哄皯蹇呭～瀛楁 | 杩斿洖400楠岃瘉閿欒 | P0 |
| API-P-008 | /api/products/:id | PUT | 鏇存柊浜у搧鏁版嵁 | 鏇存柊浜у搧(200) | P0 |
| API-P-009 | /api/products/:id | DELETE | id=1 | 鍒犻櫎浜у搧(200) | P0 |

#### 5.3.2 璁よ瘉API娴嬭瘯

| 鐢ㄤ緥ID | 鎺ュ彛 | 鏂规硶 | 娴嬭瘯鏁版嵁 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|------|------|---------|---------|--------|
| API-A-001 | /api/auth/login | POST | 姝ｇ‘璐﹀彿瀵嗙爜 | 杩斿洖JWT token(201) | P0 |
| API-A-002 | /api/auth/login | POST | 閿欒瀵嗙爜 | 杩斿洖401 | P0 |
| API-A-003 | /api/auth/login | POST | 涓嶅瓨鍦ㄨ处鍙?| 杩斿洖401 | P0 |
| API-A-004 | /api/auth/register | POST | 鏂扮敤鎴锋暟鎹?| 鍒涘缓鐢ㄦ埛骞惰繑鍥瀟oken(201) | P1 |
| API-A-005 | /api/auth/profile | GET | 鏈夋晥Token | 杩斿洖鐢ㄦ埛淇℃伅(200) | P0 |
| API-A-006 | /api/auth/profile | GET | 杩囨湡/鏃犳晥Token | 杩斿洖401 | P0 |

#### 5.3.3 涓婁紶API娴嬭瘯

| 鐢ㄤ緥ID | 鎺ュ彛 | 鏂规硶 | 娴嬭瘯鏁版嵁 | 棰勬湡缁撴灉 | 浼樺厛绾?|
|--------|------|------|---------|---------|--------|
| API-U-001 | /api/upload | POST | 鍥剧墖鏂囦欢(JPG) | 杩斿洖鏂囦欢URL(201) | P0 |
| API-U-002 | /api/upload | POST | 鍥剧墖鏂囦欢(PNG) | 杩斿洖鏂囦欢URL(201) | P0 |
| API-U-003 | /api/upload | POST | PDF鏂囦欢 | 杩斿洖鏂囦欢URL(201) | P0 |
| API-U-004 | /api/upload | POST | 瓒呭ぇ鏂囦欢(>10MB) | 杩斿洖413閿欒 | P0 |
| API-U-005 | /api/upload | POST | 涓嶆敮鎸佹牸寮?.exe) | 杩斿洖400閿欒 | P0 |
| API-U-006 | /api/upload | POST | 鏃燭oken | 杩斿洖401 | P0 |

---

## 6. 鎬ц兘娴嬭瘯

### 6.1 棣栧睆鍔犺浇鏃堕棿

| 椤甸潰 | 鐩爣鍔犺浇鏃堕棿 | 娴嬮噺鏂规硶 |
|------|-------------|----------|
| 棣栭〉 | < 2s | Lighthouse FCP |
| 浜у搧鍒楄〃椤?| < 3s | Lighthouse FCP |
| 浜у搧璇︽儏椤?| < 2.5s | Lighthouse FCP |
| 璇㈢洏鎻愪氦椤?| < 2s | Lighthouse FCP |

**娴嬮噺鍛戒护**锛?
```bash
# 浣跨敤 Lighthouse CLI
npx lighthouse http://localhost:3000/zh --output html --output-path ./lighthouse-report.html
```

### 6.2 API鍝嶅簲鏃堕棿

| API绔偣 | 鐩爣鍝嶅簲鏃堕棿 | 浼樺厛绾?|
|---------|-------------|--------|
| GET /api/products | < 500ms | P0 |
| GET /api/products/:id | < 300ms | P0 |
| POST /api/auth/login | < 1s | P0 |
| POST /api/inquiries | < 1s | P0 |
| GET /api/analytics | < 2s | P1 |

**娴嬭瘯鑴氭湰** (`tests/performance/api-benchmark.ts`)锛?
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

### 6.3 Lighthouse瀹¤

浣跨敤 Playwright 闆嗘垚 Lighthouse锛?
```typescript
import { test, expect } from '@playwright/test';
import { chromium } from '@playwright/test';

test('Lighthouse performance audit', async ({ page }) => {
  const browser = await chromium.launch();
  const page2 = await browser.newPage();

  await page2.goto('http://localhost:3000/zh');

  // 绛夊緟椤甸潰瀹屽叏鍔犺浇
  await page2.waitForLoadState('networkidle');

  // Lighthouse 瀹¤
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

## 7. 鍏煎鎬ф祴璇?
### 7.1 娴忚鍣ㄥ吋瀹规€?
| 娴忚鍣?| 鏈€浣庣増鏈?| 娴嬭瘯閲嶇偣 |
|--------|---------|----------|
| Chrome | 90+ | 鏍稿績鍔熻兘 |
| Firefox | 88+ | CSS鍏煎鎬?|
| Safari | 14+ | WebKit鐗瑰畾 |
| Edge | 90+ | Chromium鍏煎鎬?|

**Playwright娴忚鍣ㄧ煩闃垫祴璇?*锛?
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

### 7.2 绉诲姩璁惧鍏煎鎬?
| 璁惧 | 灞忓箷灏哄 | 娴嬭瘯閲嶇偣 |
|------|---------|----------|
| iPhone 12 | 390x844 | 瑙︽懜浜や簰 |
| iPhone SE | 375x667 | 灏忓睆骞曢€傞厤 |
| iPad | 768x1024 | 骞虫澘甯冨眬 |
| Pixel 5 | 393x851 | Android鍏煎鎬?|

**鍝嶅簲寮忔祴璇曠敤渚?*锛?
```typescript
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`鍝嶅簲寮忓竷灞€ - ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/zh/products');

    // 楠岃瘉甯冨眬閫傚簲鎬?    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 绉诲姩绔獙璇佹眽鍫¤彍鍗?    if (viewport.name === 'mobile') {
      const menuButton = page.locator('[data-testid="mobile-menu-button"]');
      await expect(menuButton).toBeVisible();
    }
  });
}
```

---

## 8. 娴嬭瘯鎶ュ憡

### 8.1 娴嬭瘯鎶ュ憡妯℃澘

```markdown
# 娴嬭瘯鎶ュ憡 - [鐗堟湰鍙穄

**娴嬭瘯鏃ユ湡**锛歔鏃ユ湡]
**娴嬭瘯浜哄憳**锛歔濮撳悕]
**娴嬭瘯鐜**锛歔鐜淇℃伅]

## 娴嬭瘯鎬昏

| 妯″潡 | 鐢ㄤ緥鎬绘暟 | 閫氳繃 | 澶辫触 | 闃诲 |
|------|---------|------|------|------|
| [妯″潡1] | X | X | X | X |
| [妯″潡2] | X | X | X | X |
| **鍚堣** | **X** | **X** | **X** | **X** |

## 娴嬭瘯缁撴灉璇︽儏

### 閫氳繃鐨勬祴璇曠敤渚?
| 鐢ㄤ緥ID | 娴嬭瘯椤?| 缁撴灉 | 澶囨敞 |
|--------|--------|------|------|
| ... | ... | 閫氳繃 | - |

### 澶辫触鐨勬祴璇曠敤渚?
| 鐢ㄤ緥ID | 娴嬭瘯椤?| 瀹為檯缁撴灉 | 棰勬湡缁撴灉 | 鎴浘 |
|--------|--------|---------|---------|------|
| ... | ... | ... | ... | [閾炬帴] |

### 闃诲鐨勬祴璇曠敤渚?
| 鐢ㄤ緥ID | 娴嬭瘯椤?| 闃诲鍘熷洜 | 浼樺厛绾?|
|--------|--------|---------|--------|
| ... | ... | ... | P0 |

## Bug姹囨€?
| 浼樺厛绾?| Bug鎻忚堪 | 褰卞搷妯″潡 | 淇寤鸿 |
|--------|---------|---------|---------|
| P0 | ... | ... | ... |
| P1 | ... | ... | ... |

## 娴嬭瘯缁撹

[鎬荤粨娴嬭瘯鏄惁閫氳繃锛屾槸鍚﹀彲浠ュ彂甯僝
```

### 8.2 闂璺熻釜

浣跨敤浠ヤ笅鏍煎紡璺熻釜娴嬭瘯鍙戠幇鐨勯棶棰橈細

| 瀛楁 | 璇存槑 |
|------|------|
| Bug ID | 鍞竴鏍囪瘑绗?(濡侭UG-001) |
| 鏍囬 | 绠€娲佹弿杩伴棶棰?|
| 鎻忚堪 | 璇︾粏璇存槑 |
| 澶嶇幇姝ラ | 1. 2. 3. |
| 棰勬湡缁撴灉 | 搴旇濡備綍 |
| 瀹為檯缁撴灉 | 瀹為檯鍙戠敓浜嗕粈涔?|
| 浼樺厛绾?| P0/P1/P2/P3 |
| 鎸囨淳 | 璐熻矗浜?|
| 鐘舵€?| Open/In Progress/Resolved/Closed |
| 鎴浘/鏃ュ織 | 璇佹嵁 |

---

## 闄勫綍A锛氬凡鐭ラ棶棰樺垪琛?
鍩轰簬 2026-04-13 娴嬭瘯鎵ц鐨勫凡鐭ラ棶棰橈細

| 浼樺厛绾?| 闂鎻忚堪 | 褰卞搷椤甸潰 | 鐘舵€?|
|--------|---------|---------|------|
| P0 | Web璇环琛ㄥ崟鎻愪氦澶辫触 | 璇环鍗曢〉 | 寰呬慨澶?|
| P0 | inquiry.submit i18n key鏈炕璇?| 璇环鍗曢〉 | 寰呬慨澶?|
| P0 | inquiry.responseTime i18n key鏈炕璇?| 鑱旂郴鎴戜滑椤?| 寰呬慨澶?|
| P1 | /zh/downloads杩斿洖404 | 涓嬭浇涓績 | 寰呬慨澶?|
| P1 | Admin Token杩囨湡鏃犺嚜鍔ㄩ噸瀹氬悜 | 璇㈢洏绠＄悊 | 寰呬慨澶?|
| P2 | 浜у搧璇︽儏椤礟roduct Not Found | 浜у搧璇︽儏椤?| 寰呬慨澶?|
| P2 | Newsletter璁㈤槄鏃犲弽棣?| Footer | 寰呬慨澶?|
| P3 | React Hydration閿欒 | 鎵€鏈夐〉闈?| 寰呬慨澶?|

---

## 闄勫綍B锛氭祴璇曠幆澧冩惌寤?
### B.1 鏈湴鐜瑕佹眰

- Node.js >= 18
- npm >= 9
- SQLite (鎴?PostgreSQL/MySQL)
- 绔彛 3000, 3001, 8000 鍙敤

### B.2 娴嬭瘯鏁版嵁鍑嗗

```bash
# 鍒濆鍖栨祴璇曟暟鎹簱
cd apps/api
npm run db:seed

# 鍒涘缓娴嬭瘯璐﹀彿
# 閭: admin@zzscale.com
# 瀵嗙爜: admin123
```

### B.3 CI/CD闆嗘垚

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

*鏂囨。鐢熸垚鏃堕棿锛?026-05-04*
