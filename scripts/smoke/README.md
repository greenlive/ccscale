# Smoke Test

`scripts/smoke/smoke.mjs` - zero-dep E2E smoke (Node 20+).

## What it checks

1. **API**
   - `GET /api/health` returns 200 + `{status:"ok"}`
   - `GET /api/products?locale=en` returns array, valid pageSize bound
   - `pageSize=200` rejected (4xx)
   - `sortBy=DROP_TABLE` rejected (4xx)
   - `GET /api/categories?locale=en` returns array
   - 35 parallel GETs returns no 5xx (rate limit expected)
2. **Inquiry POST**
   - Valid body returns 200/201/400/403 (4xx acceptable when captcha is enforced)
   - Oversized message (3000 chars) rejected
   - Empty `items` array rejected
3. **Web** (skipped with `SMOKE_SKIP_BROWSER=1`)
   - `/`, `/en`, `/zh`, `/en/products`, `/en/inquiry` return 200
   - `/robots.txt` has `Sitemap:` directive
   - `/sitemap.xml` is a valid `<urlset>` with N urls
   - Security headers: HSTS, X-Frame-Options / CSP frame-ancestors, X-Content-Type-Options
   - Home page contains `"@type":"Organization"` JSON-LD
   - `/en` has `hreflang="en"` and `hreflang="zh"`

## Run

```bash
# local: web on 3000, api on 8000
pnpm dev &                                     # in another terminal
node scripts/smoke/smoke.mjs

# with env overrides
SMOKE_WEB=https://staging.ccscale.com \
SMOKE_API=https://api.staging.ccscale.com \
  node scripts/smoke/smoke.mjs

# skip web checks (api only)
SMOKE_SKIP_BROWSER=1 node scripts/smoke/smoke.mjs
```

## Exit codes

- `0` - all checks passed
- `1` - at least one failure (details printed)

## CI integration

Add to `.github/workflows/smoke.yml`:

```yaml
name: smoke
on:
  workflow_dispatch:
  push:
    branches: [main]
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: API smoke (production)
        env:
          SMOKE_WEB: https://www.ccscale.com
          SMOKE_API: https://api.ccscale.com
        run: node scripts/smoke/smoke.mjs
```
