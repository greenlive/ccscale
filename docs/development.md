# CC Scale B2B澶栬锤骞冲彴寮€鍙戞枃妗?
## 1. 寮€鍙戠幆澧冩惌寤?
### 1.1 Node.js鐗堟湰瑕佹眰

- **鏈€浣庣増鏈?*: Node.js 18.x
- **鎺ㄨ崘鐗堟湰**: Node.js 20.x LTS
- **鍖呯鐞嗗櫒**: npm 10.x (闅?Node.js 20 LTS 涓€璧峰畨瑁?

```bash
# 妫€鏌?Node.js 鐗堟湰
node --version

# 妫€鏌?npm 鐗堟湰
npm --version
```

### 1.2 鐜鍙橀噺閰嶇疆

浠?`.env.example` 澶嶅埗鍒涘缓 `.env` 鏂囦欢锛?
```bash
# 杩涘叆 api 鐩綍
cd apps/api

# 澶嶅埗鐜鍙橀噺妯℃澘
cp .env.example .env
```

**鍏抽敭鐜鍙橀噺璇存槑**:

| 鍙橀噺鍚?| 璇存槑 | 绀轰緥鍊?|
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL鏁版嵁搴撹繛鎺ヤ覆 | `postgresql://zzscale:zzscale123@localhost:5432/zzscale` |
| `JWT_SECRET` | JWT绛惧悕瀵嗛挜锛堢敓浜х幆澧冨繀椤讳慨鏀癸級 | `your-super-secret-jwt-key-change-in-production-min-32-chars` |
| `JWT_EXPIRES_IN` | Token杩囨湡鏃堕棿 | `24h` |
| `PORT` | API鏈嶅姟绔彛 | `3002` |
| `CORS_ORIGIN` | 鍏佽鐨勮法鍩熸潵婧?| `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | API鍦板潃锛堝墠绔敤锛?| `http://localhost:3002` |
| `NEXT_PUBLIC_WEB_URL` | 鍓嶅彴缃戠珯鍦板潃 | `http://localhost:3000` |
| `NEXT_PUBLIC_ADMIN_URL` | 绠＄悊鍚庡彴鍦板潃 | `http://localhost:3001` |

### 1.3 鏁版嵁搴撻厤缃?
鏈」鐩娇鐢?Prisma 浣滀负 ORM锛屾敮鎸?PostgreSQL銆?
**鏈湴寮€鍙戞暟鎹簱璁剧疆**:

1. 瀹夎 PostgreSQL锛堟帹鑽愪娇鐢?Docker锛?

```bash
# 浣跨敤 Docker 鍚姩 PostgreSQL
docker run -d \
  --name zzscale-postgres \
  -e POSTGRES_USER=zzscale \
  -e POSTGRES_PASSWORD=zzscale123 \
  -e POSTGRES_DB=zzscale \
  -p 5432:5432 \
  postgres:15
```

2. 閰嶇疆鏁版嵁搴撹繛鎺ュ瓧绗︿覆鍒?`.env`:

```
DATABASE_URL="postgresql://zzscale:zzscale123@localhost:5432/zzscale?schema=public"
```

3. 杩愯鏁版嵁搴撹縼绉?

```bash
cd packages/database
npx prisma migrate dev
```

4. 濉厖绉嶅瓙鏁版嵁锛堝彲閫夛級:

```bash
cd packages/database
npx prisma db seed
```

### 1.4 IDE鎺ㄨ崘閰嶇疆

**鎺ㄨ崘IDE**: VS Code

**蹇呴渶鎻掍欢**:

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript Importer

**VS Code 璁剧疆** (`.vscode/settings.json`):

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

## 2. 椤圭洰鍚姩

### 2.1 瀹夎渚濊禆

鍦ㄩ」鐩牴鐩綍鎵ц锛?
```bash
# 瀹夎鎵€鏈夊伐浣滃尯渚濊禆
npm install
```

杩欎細鏍规嵁 `package.json` 涓殑 `workspaces` 閰嶇疆锛屽畨瑁呮墍鏈夊瓙椤圭洰鐨勪緷璧栥€?
### 2.2 鍚姩寮€鍙戞湇鍔″櫒

**鏂瑰紡涓€锛氫竴閿惎鍔ㄦ墍鏈夋湇鍔?*

```bash
# 浠庢牴鐩綍鍚姩鎵€鏈夊簲鐢紙浣跨敤 turbo锛?npm run dev
```

**鏂瑰紡浜岋細鍒嗗埆鍚姩鍚勬湇鍔?*

```bash
# 鍚姩鍓嶅彴缃戠珯 (http://localhost:3000)
cd apps/web && npm run dev

# 鍚姩绠＄悊鍚庡彴 (http://localhost:3001)
cd apps/admin && npm run dev

# 鍚姩API鏈嶅姟 (http://localhost:3002)
cd apps/api && npm run dev
```

### 2.3 璁块棶鍦板潃

| 搴旂敤 | 鍦板潃 | 璇存槑 |
|------|------|------|
| 鍓嶅彴缃戠珯 | http://localhost:3000 | 闈㈠悜娴峰涔板鐨凚2B灞曠ず绔?|
| 绠＄悊鍚庡彴 | http://localhost:3001 | 鍐呴儴杩愯惀绠＄悊绯荤粺 |
| API鏈嶅姟 | http://localhost:3002 | RESTful API 鎺ュ彛 |
| Swagger鏂囨。 | http://localhost:3002/api/docs | API鎺ュ彛鏂囨。 |

---

## 3. 浠ｇ爜瑙勮寖

### 3.1 TypeScript瑙勮寖

**绫诲瀷瀹氫箟**:

- 浼樺厛浣跨敤鎺ュ彛瀹氫箟瀵硅薄缁撴瀯
- 浣跨敤 `type` 瀹氫箟鑱斿悎绫诲瀷鍜屽伐鍏风被鍨?- 閬垮厤浣跨敤 `any`锛屽敖閲忎娇鐢?`unknown` 閰嶅悎绫诲瀷鏀剁獎

```typescript
// 鎺ㄨ崘锛氫娇鐢ㄦ帴鍙ｅ畾涔?interface Product {
  id: number;
  nameEn: string;
  nameZh: string;
}

// 鎺ㄨ崘锛氫娇鐢?type 瀹氫箟鑱斿悎绫诲瀷
type ProductStatus = 'active' | 'inactive';

// 涓嶆帹鑽愶細閬垮厤 any
function processData(data: any) { ... }
```

**瀵煎叆瑙勮寖**:

```typescript
// 鎸夐『搴忓垎缁勫鍏?// 1. Node.js 鍐呯疆妯″潡
import { readFile } from 'fs';

// 2. 绗笁鏂瑰寘
import { IsString, IsNumber } from 'class-validator';

// 3. 鐩稿璺緞锛堟寜娣卞害浠庤繎鍒拌繙锛?import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';

// 4. 宸ヤ綔鍖哄寘鍒悕
import { Button } from '@cc-scale/ui';
```

### 3.2 缁勪欢鍛藉悕瑙勮寖

**React 缁勪欢鍛藉悕**:

- 浣跨敤 PascalCase锛堝 `ProductCard`銆乣SearchBar`锛?- 缁勪欢鏂囦欢涓庣粍浠跺悕淇濇寔涓€鑷?- 椤甸潰缁勪欢鏀惧湪 `page.tsx` 鏂囦欢涓?
```typescript
// 鏂囦欢: components/ProductCard.tsx
export function ProductCard() { ... }

// 椤甸潰鏂囦欢: app/products/page.tsx
export default function ProductsPage() { ... }
```

**NestJS 鎺у埗鍣?鏈嶅姟鍛藉悕**:

- 鎺у埗鍣細`{Resource}Controller`锛堝 `ProductsController`锛?- 鏈嶅姟锛歚{Resource}Service`锛堝 `ProductsService`锛?- 妯″潡锛歚{Resource}Module`锛堝 `ProductsModule`锛?
### 3.3 鏍峰紡瑙勮寖

**Tailwind CSS 浣跨敤瑙勮寖**:

- 浣跨敤璇箟鍖栫殑 class 鍚嶇О
- 閬垮厤鍐呰仈澶嶆潅鏍峰紡锛屼繚鎸佷唬鐮佸彲璇绘€?- 鍝嶅簲寮忚璁′娇鐢ㄥ畼鏂瑰墠缂€ (`sm:`, `md:`, `lg:`, `xl:`)

```tsx
// 鎺ㄨ崘
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// 涓嶆帹鑽愶紙杩囧害宓屽锛?<div className="wrapper">
  <div className="inner">
    <div className="content">...</div>
  </div>
</div>
```

**缁勪欢鏍峰紡鍒嗙**:

- UI缁勪欢鏍峰紡浣跨敤 Tailwind
- 澶嶆潅甯冨眬鏍峰紡浣跨敤 CSS Modules 鎴?Tailwind `@apply`
- 閬垮厤鍦?JSX 涓洿鎺ュ啓澶ч噺鏍峰紡绫?
### 3.4 Git鎻愪氦瑙勮寖

**鎻愪氦淇℃伅鏍煎紡**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 绫诲瀷**:

| 绫诲瀷 | 璇存槑 |
|------|------|
| `feat` | 鏂板姛鑳?|
| `fix` | Bug淇 |
| `docs` | 鏂囨。鍙樻洿 |
| `style` | 浠ｇ爜鏍煎紡锛堜笉褰卞搷鍔熻兘锛?|
| `refactor` | 閲嶆瀯 |
| `test` | 娴嬭瘯鐩稿叧 |
| `chore` | 鏋勫缓/宸ュ叿鍙樻洿 |

**绀轰緥**:

```bash
# 鏂板姛鑳?git commit -m "feat(product): add product slug generation"

# Bug淇
git commit -m "fix(inquiry): resolve email notification failure"

# 鏂囨。鏇存柊
git commit -m "docs: update API documentation for products"
```

---

## 4. 鏍稿績妯″潡寮€鍙?
### 4.1 浜у搧绠＄悊

浜у搧妯″潡浣嶄簬 `apps/api/src/products/`锛屽寘鍚互涓嬫牳蹇冩枃浠讹細

```
products/
鈹溾攢鈹€ products.module.ts      # 妯″潡瀹氫箟
鈹溾攢鈹€ products.controller.ts  # 璺敱澶勭悊
鈹溾攢鈹€ products.service.ts     # 涓氬姟閫昏緫
鈹斺攢鈹€ dto/
    鈹斺攢鈹€ product.dto.ts      # 鏁版嵁浼犺緭瀵硅薄
```

**鍒涘缓浜у搧鐨勫熀鏈祦绋?*:

```typescript
// 1. 鍦?DTO 涓畾涔夊垱寤烘暟鎹粨鏋?// apps/api/src/products/dto/product.dto.ts

export class CreateProductDto {
  @IsNumber()
  categoryId: number;

  @IsString()
  nameEn: string;

  @IsString()
  nameZh: string;

  @IsString()
  slug: string;

  // ... 鍏朵粬瀛楁
}

// 2. 鍦?Service 涓疄鐜板垱寤洪€昏緫
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

**浜у搧鍏宠仈鏁版嵁澶勭悊**:

- **瑙勬牸 (Specs)**: 閫氳繃 `ProductSpec` 妯″瀷瀛樺偍 key-value 閿€煎
- **鍥剧墖 (Images)**: 閫氳繃 `ProductImage` 妯″瀷瀛樺偍澶氬紶鍥剧墖
- **鍒嗙被 (Category)**: 閫氳繃 `ProductCategory` 妯″瀷澶氬涓€鍏宠仈

### 4.2 璇㈢洏绠＄悊

璇㈢洏妯″潡浣嶄簬 `apps/api/src/inquiries/`锛屾牳蹇冩暟鎹粨鏋勶細

```typescript
// 璇㈢洏鐘舵€佹灇涓?enum InquiryStatus {
  NEW,           // 鏂拌鐩?  READ,          // 宸茶
  IN_PROGRESS,   // 澶勭悊涓?  REPLIED,       // 宸插洖澶?  CLOSED,        // 宸插叧闂?  SPAM,          // 鍨冨溇璇㈢洏
}
```

**璇㈢洏鏉ユ簮杩借釜瀛楁**:

- `trafficSource`: 娴侀噺鏉ユ簮绫诲瀷
- `utmSource/Medium/Campaign/Content/Term`: UTM鍙傛暟
- `referrer`: 鏉ユ簮椤甸潰
- `ipAddress/userAgent`: 璁垮淇℃伅

### 4.3 璁よ瘉绯荤粺

璁よ瘉妯″潡浣嶄簬 `apps/api/src/auth/`锛屼娇鐢?JWT 瀹炵幇鏃犵姸鎬佽璇併€?
**鏍稿績绔偣**:

| 鏂规硶 | 璺緞 | 璇存槑 | 璁よ瘉 |
|------|------|------|------|
| POST | `/auth/login` | 鐢ㄦ埛鐧诲綍 | 鍚?|
| POST | `/auth/refresh` | 鍒锋柊Token | 鍚?|
| POST | `/auth/register` | 娉ㄥ唽鐢ㄦ埛 | 鏄?(Admin) |
| GET | `/auth/me` | 鑾峰彇褰撳墠鐢ㄦ埛 | 鏄?|
| PUT | `/auth/password` | 淇敼瀵嗙爜 | 鏄?|

**JWT Token 缁撴瀯**:

```typescript
// Payload 鍖呭惈
{
  sub: number,    // 鐢ㄦ埛ID
  email: string,  // 鐢ㄦ埛閭
  role: Role,     // 鐢ㄦ埛瑙掕壊 (ADMIN/EDITOR/VIEWER)
}

// Token 绫诲瀷
- accessToken: 24灏忔椂鏈夋晥鏈?- refreshToken: 7澶╂湁鏁堟湡
```

**瑙掕壊鏉冮檺**:

| 瑙掕壊 | 璇存槑 |
|------|------|
| `ADMIN` | 绠＄悊鍛橈紝鎷ユ湁鍏ㄩ儴鏉冮檺 |
| `EDITOR` | 缂栬緫锛屽彲绠＄悊鍐呭浣嗘棤娉曠鐞嗙敤鎴?|
| `VIEWER` | 璁垮锛屼粎鍙煡鐪嬫暟鎹?|

### 4.4 鏂囦欢涓婁紶

涓婁紶妯″潡浣嶄簬 `apps/api/src/upload/`锛屾敮鎸佸绉嶆枃浠剁被鍨嬪拰澶у皬闄愬埗銆?
**涓婁紶绫诲瀷閰嶇疆**:

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

**API绔偣**:

| 鏂规硶 | 璺緞 | 璇存槑 |
|------|------|------|
| POST | `/upload/:uploadType` | 鍗曟枃浠朵笂浼?|
| POST | `/upload/:uploadType/multiple` | 澶氭枃浠朵笂浼?(鏈€澶?0涓? |
| DELETE | `/upload/:uploadType/:filename` | 鍒犻櫎鏂囦欢 |

---

## 5. API寮€鍙戞寚鍗?
### 5.1 RESTful瑙勮寖

**URL璁捐鍘熷垯**:

- 浣跨敤鍚嶈瘝鑰岄潪鍔ㄨ瘝
- 浣跨敤澶嶆暟褰㈠紡
- 浣跨敤灏忓啓瀛楁瘝
- 浣跨敤杩炲瓧绗﹀垎闅斿崟璇?
**HTTP鏂规硶浣跨敤**:

| 鏂规硶 | 鐢ㄩ€?| 绀轰緥 |
|------|------|------|
| GET | 鑾峰彇璧勬簮 | `GET /products` |
| POST | 鍒涘缓璧勬簮 | `POST /products` |
| PUT | 鏇存柊璧勬簮锛堝叏閮級 | `PUT /products/123` |
| PATCH | 閮ㄥ垎鏇存柊 | `PATCH /products/123` |
| DELETE | 鍒犻櫎璧勬簮 | `DELETE /products/123` |

### 5.2 DTO瀹氫箟

浣跨敤 `class-validator` 鍜?`class-transformer` 瀹炵幇DTO楠岃瘉鍜岃浆鎹€?
```typescript
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: '浜у搧鍚嶇О锛堣嫳鏂囷級' })
  @IsString()
  nameEn: string;

  @ApiPropertyOptional({ description: '浠锋牸鍖洪棿锛堟渶灏忓€硷級' })
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

### 5.3 楠岃瘉绠￠亾

NestJS閫氳繃鍏ㄥ眬绠￠亾鍚敤楠岃瘉锛?
```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // 绉婚櫎鏈畾涔夌殑灞炴€?  forbidNonWhitelisted: true, // 鎶涘嚭閿欒鑰岄潪绉婚櫎
  transform: true,           // 鑷姩杞崲绫诲瀷
  transformOptions: { enableImplicitConversion: true },
}));
```

### 5.4 閿欒澶勭悊

**HTTP鐘舵€佺爜瑙勮寖**:

| 鐘舵€佺爜 | 璇存槑 |
|--------|------|
| 200 | 鎴愬姛 |
| 201 | 鍒涘缓鎴愬姛 |
| 204 | 鍒犻櫎鎴愬姛锛堟棤杩斿洖鍐呭锛?|
| 400 | 璇锋眰鍙傛暟閿欒 |
| 401 | 鏈璇?|
| 403 | 鏃犳潈闄?|
| 404 | 璧勬簮涓嶅瓨鍦?|
| 409 | 璧勬簮鍐茬獊锛堝閭宸插瓨鍦級 |
| 429 | 璇锋眰杩囦簬棰戠箒 |
| 500 | 鏈嶅姟鍣ㄥ唴閮ㄩ敊璇?|

**鑷畾涔夊紓甯稿鐞?*:

```typescript
// 浣跨敤鍐呯疆寮傚父
throw new NotFoundException(`Product with ID ${id} not found`);

// 鑷畾涔変笟鍔″紓甯?throw new BadRequestException('Invalid product data');
```

---

## 6. 鏁版嵁搴撴搷浣?
### 6.1 Prisma鍩烘湰鎿嶄綔

**鏌ヨ鎿嶄綔**:

```typescript
// 鑾峰彇鎵€鏈変骇鍝?const products = await prisma.product.findMany({
  where: { isActive: true },
  include: { category: true, images: true },
  orderBy: { order: 'asc' },
});

// 鑾峰彇鍗曚釜浜у搧
const product = await prisma.product.findUnique({
  where: { id: 1 },
  include: { specs: true, images: true },
});
```

**鍒涘缓鎿嶄綔**:

```typescript
const newProduct = await prisma.product.create({
  data: {
    nameEn: 'Industrial Scale',
    nameZh: '宸ヤ笟绉?,
    sku: 'SCALE-001',
    slug: 'industrial-scale',
    categoryId: 1,
  },
});
```

**鏇存柊鎿嶄綔**:

```typescript
const updated = await prisma.product.update({
  where: { id: 1 },
  data: {
    priceMin: 99.99,
    isFeatured: true,
  },
});
```

**鍒犻櫎鎿嶄綔**:

```typescript
// 鍗曟潯鍒犻櫎
await prisma.product.delete({ where: { id: 1 } });

// 鎵归噺鍒犻櫎
await prisma.product.deleteMany({ where: { isActive: false } });
```

### 6.2 杩佺Щ绠＄悊

```bash
# 鍒涘缓鏂拌縼绉?cd packages/database
npx prisma migrate dev --name add_product_field

# 搴旂敤杩佺Щ鍒版暟鎹簱
npx prisma migrate deploy

# 閲嶇疆鏁版嵁搴擄紙鎱庣敤锛?npx prisma migrate reset

# 鏌ョ湅杩佺Щ鐘舵€?npx prisma migrate status

# 鐢熸垚 Prisma Client锛堣縼绉诲悗鑷姩鎵ц锛?npx prisma generate
```

### 6.3 绉嶅瓙鏁版嵁

绉嶅瓙鏂囦欢浣嶄簬 `packages/database/prisma/seed.ts`銆?
```bash
# 杩愯绉嶅瓙鏁版嵁
cd packages/database
npx prisma db seed
```

**绉嶅瓙鏁版嵁绀轰緥**:

```typescript
// packages/database/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 鍒涘缓绠＄悊鍛樼敤鎴?  await prisma.user.upsert({
    where: { email: 'admin@zzscale.com' },
    update: {},
    create: {
      email: 'admin@zzscale.com',
      password: 'admin123', // 瀹為檯浣跨敤 bcrypt 鍔犲瘑
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // 鍒涘缓绀轰緥鍒嗙被
  await prisma.productCategory.createMany({
    data: [
      { nameEn: 'Industrial Scales', nameZh: '宸ヤ笟琛″櫒', slug: 'industrial-scales' },
      { nameEn: 'Precision Balances', nameZh: '绮惧瘑澶╁钩', slug: 'precision-balances' },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 7. 澶氳瑷€瀹炵幇

### 7.1 i18n閰嶇疆

椤圭洰浣跨敤 `next-intl` 瀹炵幇鍓嶅彴澶氳瑷€锛宍@cc-scale/i18n` 鍖呯鐞嗙炕璇戞枃浠躲€?
**缈昏瘧鏂囦欢浣嶇疆**:

```
packages/i18n/
鈹溾攢鈹€ messages/
鈹?  鈹溾攢鈹€ en.json    # 鑻辨枃缈昏瘧
鈹?  鈹斺攢鈹€ zh.json    # 涓枃缈昏瘧
鈹斺攢鈹€ src/
    鈹斺攢鈹€ index.ts   # 瀵煎嚭閰嶇疆
```

**鍓嶅彴璇█璺敱**:

- `/en/...` - 鑻辨枃鐗堟湰
- `/zh/...` - 涓枃鐗堟湰

### 7.2 缈昏瘧绠＄悊

**浣跨敤缈昏瘧閿?*:

```typescript
// 鍦ㄧ粍浠朵腑浣跨敤
import { useTranslations } from 'next-intl';

export function ProductTitle() {
  const t = useTranslations('products');
  return <h1>{t('title')}</h1>;
}

// 宓屽閿?{t('specifications.viewDetails')}
```

**缈昏瘧鏂囦欢缁撴瀯**:

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

### 7.3 娣诲姞鏂拌瑷€

1. 鍦?`packages/i18n/messages/` 涓嬪垱寤烘柊鐨勭炕璇戞枃浠讹紙濡?`ja.json`锛?
2. 鍦?`next.config.js` 涓厤缃?locales:

```javascript
// apps/web/next.config.js
const nextConfig = {
  // ...
};

module.exports = withNextIntl(nextConfig);
```

3. 娣诲姞璇█鍒囨崲缁勪欢鍒板鑸爮

---

## 8. 甯哥敤鍛戒护

### 8.1 寮€鍙戝懡浠?
```bash
# 瀹夎鎵€鏈変緷璧?npm install

# 鍚姩鎵€鏈夊紑鍙戞湇鍔?npm run dev

# 鍚姩鍓嶅彴缃戠珯 (http://localhost:3000)
cd apps/web && npm run dev

# 鍚姩绠＄悊鍚庡彴 (http://localhost:3001)
cd apps/admin && npm run dev

# 鍚姩API鏈嶅姟 (http://localhost:3002)
cd apps/api && npm run dev

# 浠ｇ爜鏍煎紡妫€鏌?npm run lint

# 浠ｇ爜鑷姩鏍煎紡鍖?npm run format
```

### 8.2 鏋勫缓鍛戒护

```bash
# 鏋勫缓鎵€鏈夊簲鐢?npm run build

# 鏋勫缓鍗曚釜搴旂敤
cd apps/web && npm run build
cd apps/admin && npm run build
cd apps/api && npm run build

# API 鐢熶骇鐜鏋勫缓
cd apps/api && npm run build

# 鍚姩 API 鐢熶骇鏈嶅姟
cd apps/api && npm run start:prod
```

### 8.3 鏁版嵁搴撳懡浠?
```bash
# Prisma 鍛戒护锛堜綅浜?packages/database 鐩綍锛?cd packages/database

# 鐢熸垚 Prisma Client
npx prisma generate

# 鍒涘缓杩佺Щ
npx prisma migrate dev --name migration_name

# 搴旂敤杩佺Щ
npx prisma migrate deploy

# 閲嶇疆鏁版嵁搴擄紙娓呴櫎鎵€鏈夋暟鎹級
npx prisma migrate reset

# 鏌ョ湅鏁版嵁搴撶姸鎬?npx prisma migrate status

# 濉厖绉嶅瓙鏁版嵁
npx prisma db seed

# 鏌ョ湅鏁版嵁搴撳唴瀹癸紙闇€瀹夎 prisma studio锛?npx prisma studio

# 鎷夊彇鏁版嵁搴撶粨鏋勫埌 Prisma schema
npx prisma db pull
```

---

## 闄勫綍

### A. 鎶€鏈爤閫熸煡琛?
| 搴旂敤 | 妗嗘灦 | 绔彛 | 涓昏鎶€鏈?|
|------|------|------|----------|
| web | Next.js 14 | 3000 | React 18, TypeScript, Tailwind, React Query, next-intl |
| admin | Next.js 14 | 3001 | React 18, TypeScript, Tailwind, React Query, React Hook Form |
| api | NestJS | 3002 | TypeScript, Prisma, JWT, Swagger |

### B. 鐩綍缁撴瀯閫熸煡

```
by_claude_vol/
鈹溾攢鈹€ apps/
鈹?  鈹溾攢鈹€ web/                 # 鍓嶅彴缃戠珯 (Next.js 14 App Router)
鈹?  鈹溾攢鈹€ admin/               # 绠＄悊鍚庡彴 (Next.js 14 Pages Router)
鈹?  鈹斺攢鈹€ api/                 # API鏈嶅姟 (NestJS)
鈹溾攢鈹€ packages/
鈹?  鈹溾攢鈹€ database/            # Prisma 鏁版嵁搴撴ā鍨?鈹?  鈹溾攢鈹€ ui/                  # 鍏变韩 UI 缁勪欢搴?鈹?  鈹溾攢鈹€ i18n/                # 鍥介檯鍖栭厤缃?鈹?  鈹斺攢鈹€ shared-types/       # 鍏变韩绫诲瀷瀹氫箟
鈹溾攢鈹€ docs/                    # 椤圭洰鏂囨。
鈹斺攢鈹€ package.json             # 鏍?workspace 閰嶇疆
```

### C. 甯哥敤绔彛鏄犲皠

| 鏈嶅姟 | 绔彛 | 璁块棶鍦板潃 |
|------|------|----------|
| 鍓嶅彴缃戠珯 | 3000 | http://localhost:3000 |
| 绠＄悊鍚庡彴 | 3001 | http://localhost:3001 |
| API鏈嶅姟 | 3002 | http://localhost:3002 |
| Swagger鏂囨。 | 3002/api/docs | http://localhost:3002/api/docs |
| Prisma Studio | 5555 | http://localhost:5555 |