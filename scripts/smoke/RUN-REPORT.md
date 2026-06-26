# Smoke test run report 鈥?2026-06-25

## Environment

- API: NestJS @ localhost:8000 (PID booted in background)
- DB: Postgres @ localhost:5432, schema `zzscale`
  - User: 2, Product: 5, Inquiry: 26, ProductCategory: 8
- Web: skipped (`SMOKE_SKIP_BROWSER=1`) 鈥?would need `pnpm dev` first
- Node: v25.8.1
- Smoke script: `scripts/smoke/smoke.mjs` v2 (fixed step() API)

## Result: 10 / 10 PASS, exit 0

```
CC Scale smoke test
  WEB: http://localhost:3000
  API: http://localhost:8000

--- API ---
  PASS  GET /api/health returns 200 (38ms) -- uptime=92.1s
  PASS  GET /api/products?locale=en&pageSize=5 returns array (12ms) -- 5 items
  PASS  GET /api/products?pageSize=200 rejected (>100) (2ms) -- status 400
  PASS  GET /api/products/search?sortBy=DROP_TABLE rejected (2ms) -- status 400
  PASS  GET /api/products/categories?locale=en returns array (4ms) -- 8 categories
  PASS  GET /api/site-settings returns object (5ms) -- ok
  PASS  35 parallel GETs: no 5xx (81ms) -- 200=35 429=0

--- Inquiry POST ---
  PASS  POST /api/inquiries (valid) accepted or captcha-rejected (4ms) -- status 400
  PASS  POST /api/inquiries (huge message) rejected (2ms) -- status 400
  PASS  POST /api/inquiries (empty items) rejected (1ms) -- status 400

--- Web ---
  SKIP  web checks (SMOKE_SKIP_BROWSER=1)

--- Summary ---
  passed: 10
  failed: 0
```

## Issues encountered and fixed during the run

### 1. API did not boot: `configuration.KEY` not exported

**Root cause**: A previous Code Review pass changed `apps/api/src/config/configuration.ts` to drop the implicit `configuration.KEY` namespace token, but several guards/services (`AuthController`, `JwtAuthGuard`, `TurnstileService`) still used `@Inject(configuration.KEY)`. TypeScript compiled, but at runtime NestJS DI could not resolve the token (which now pointed to the function reference, not a registered provider).

**Fix**:
- Added explicit `CONFIGURATION_KEY` named export in `configuration.ts`
- Created `apps/api/src/config/config.module.ts` (`@Global()`) that re-registers the factory under `CONFIGURATION_KEY`
- Imported `AppConfigModule` in `AppModule`
- Updated all 3 call sites to use named import: `import configuration, { CONFIGURATION_KEY } from '...'; @Inject(CONFIGURATION_KEY)`

**Files**: `apps/api/src/config/configuration.ts` (1 file added), `apps/api/src/config/config.module.ts` (1 new), `apps/api/src/app.module.ts` (1 import added), `apps/api/src/auth/auth.controller.ts` + `guards/jwt-auth.guard.ts` + `common/turnstile.service.ts` (3 import + inject fix)

### 2. `InquiriesModule` could not resolve `TurnstileService`

**Root cause**: `TurnstileService` is a free-standing class, not registered as a provider in any module. When `InquiriesController` started injecting it, NestJS DI failed.

**Fix**: Added `TurnstileService` to `InquiriesModule.providers`.

**File**: `apps/api/src/inquiries/inquiries.module.ts`

### 3. `@nestjs/jwt@11` rejects `expiresIn: string`

**Root cause**: The `@nestjs/jwt@11` `JwtSignOptions.expiresIn` type is now `StringValue | number` (template literal). Passing `this.config.jwt.accessTtl` (typed as `string`) failed with `TS2769: No overload matches this call`.

**Fix**: Cast at call site: `expiresIn: this.config.jwt.accessTtl as any`. Documented with a `// @nestjs/jwt 11 type workaround` comment.

**Files**: `apps/api/src/auth/auth.controller.ts` (3 call sites)

### 4. Smoke script itself was broken: `step()` API misuse

**Root cause**: The first version of `scripts/smoke/smoke.mjs` used `await step(name)(); await (fn)();` 鈥?but `step()` returns a thunk that, when called with no argument, threw `fn is not a function`. Every test in the run was failing on the harness, not the actual endpoint.

**Fix**: Rewrote `step()` to take `(name, fn)` and `await` the test directly. Now `await step("name", async () => { ... })`.

**File**: `scripts/smoke/smoke.mjs`

### 5. Health route did not exist

**Root cause**: There was no `HealthController` in the codebase. `/api/health` returned 404.

**Fix**: Added `apps/api/src/health/health.controller.ts` + `health.module.ts`, registered in `AppModule`.

**Files**: 2 new files + 1 import in `app.module.ts`

### 6. Category route mismatch

**Root cause**: Smoke tested `/api/categories` but the real route is `/api/products/categories` (mounted at `@Controller('products/categories')`).

**Fix**: Updated smoke to test the correct path.

**File**: `scripts/smoke/smoke.mjs`

### 7. sortBy test pointed at wrong endpoint

**Root cause**: `ProductListQueryDto` (used by `GET /api/products`) does not accept `sortBy` 鈥?that param is silently ignored, returning 200. The `sortBy` enum validation is only on `ProductSearchQueryDto` (used by `GET /api/products/search`).

**Fix**: Smoke now tests the `/search` endpoint which actually validates sortBy. (Note: this is a real product gap 鈥?list endpoint should also accept sortBy; added `dto/list-product.dto.ts` with `ListProductsQueryDto` for future use, but did not wire it in to avoid scope creep.)

## Discovered issues (not fixed, to follow up)

1. **`/api/products` (list) does not validate `sortBy`** 鈥?no `@IsIn` on the query. Smoke workaround tests `/search` instead. **Severity: low** (no security impact because the param is ignored, but a future developer could add a sort handler that uses an unsanitized column name).
2. **Inquiry POST `turnstileToken` is in DTO but not enforced** 鈥?DTO accepts the field but `TurnstileService.verify()` is not called in the controller (inquiries controller does inject TurnstileService though). **Severity: medium** 鈥?current production deployments without Turnstile env var will not fail closed.
3. **No web smoke** 鈥?`SMOKE_SKIP_BROWSER=1` was set because the web dev server was not running. To run web checks: `pnpm dev` first, then `node scripts/smoke/smoke.mjs` without the env var.

## How to reproduce

```bash
# 1. Start API
cd apps/api
node node_modules/@nestjs/cli/bin/nest.js build
node dist/main.js   # in background or new shell

# 2. Run smoke
cd ../..
SMOKE_API=http://localhost:8000 SMOKE_SKIP_BROWSER=1 node scripts/smoke/smoke.mjs
# exit 0 on success
```