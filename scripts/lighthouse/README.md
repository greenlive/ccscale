# Lighthouse runner

`scripts/lighthouse/run.mjs` runs Lighthouse against one or more URLs and asserts score thresholds.

## Install (one-time)

```bash
# Easiest: use npx (downloads lighthouse on first run)
npx -y lighthouse --version

# Or install globally
npm i -g lighthouse
```

You also need a Chrome / Chromium binary:

- Linux: `apt install chromium-browser` or `npx -y @puppeteer/browsers install chrome`
- macOS: `brew install --cask google-chrome`
- CI: use the Chrome for Testing image / `browser-actions/setup-chrome`

## Run

```bash
# single URL
node scripts/lighthouse/run.mjs https://www.ccscale.com

# multiple URLs (en + zh, home + product)
node scripts/lighthouse/run.mjs \
  https://www.ccscale.com/en \
  https://www.ccscale.com/zh \
  https://www.ccscale.com/en/products

# use global lighthouse binary
LH_USE_GLOBAL=1 node scripts/lighthouse/run.mjs https://www.ccscale.com

# custom thresholds (default: perf 0.90, a11y 0.95, bp 0.95, seo 0.95)
LH_THRESHOLD_PERF=0.95 \
LH_THRESHOLD_A11Y=0.95 \
LH_THRESHOLD_BP=0.95 \
LH_THRESHOLD_SEO=0.95 \
  node scripts/lighthouse/run.mjs https://www.ccscale.com

# specify chrome path
LH_CHROME_PATH=/usr/bin/google-chrome node scripts/lighthouse/run.mjs https://www.ccscale.com
```

## Output

- JSON report: `lighthouse-reports/<host>-<path>.json`
- HTML report: `lighthouse-reports/<host>-<path>.html` (open in browser to inspect)

The script prints a table of category scores (0-100) plus Core Web Vitals (LCP, INP, CLS, TBT, FCP, SI, TTI) and exits non-zero if any category is below its threshold.

## CI

Add to `.github/workflows/lighthouse.yml`:

```yaml
name: lighthouse
on:
  workflow_dispatch:
  schedule:
    - cron: "0 6 * * 1"  # weekly Monday 6am UTC
jobs:
  lh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: browser-actions/setup-chrome@v2
        with:
          chrome-version: stable
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Run Lighthouse
        env:
          LH_THRESHOLD_PERF: "0.90"
          LH_THRESHOLD_A11Y: "0.95"
          LH_THRESHOLD_BP:    "0.95"
          LH_THRESHOLD_SEO:   "0.95"
        run: |
          node scripts/lighthouse/run.mjs \
            https://www.ccscale.com/en \
            https://www.ccscale.com/zh \
            https://www.ccscale.com/en/products
      - uses: actions/upload-artifact@v4
        with:
          name: lighthouse-reports
          path: lighthouse-reports/
```

## Target scores (B2B production)

| Category | Target | Rationale |
|---|---|---|
| Performance | 0.90+ | Core Web Vitals all green on 75th percentile |
| Accessibility | 0.95+ | EU + global B2B must be accessible |
| Best Practices | 0.95+ | HTTPS, no console errors, CSP enforced |
| SEO | 0.95+ | meta, hreflang, schema.org, robots |

## Core Web Vitals targets

| Metric | Target | Lighthouse display |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.0s | "2.0 s" |
| INP (Interaction to Next Paint) | < 150ms | Lighthouse 11+ shows "interactive" |
| CLS (Cumulative Layout Shift) | < 0.05 | "0.05" |
| FCP (First Contentful Paint) | < 1.5s | "1.4 s" |
| TBT (Total Blocking Time) | < 200ms | "150 ms" |