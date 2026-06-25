#!/usr/bin/env node
// scripts/smoke/smoke.mjs
// End-to-end smoke test: web pages + API health + inquiry submission.
// Zero external deps (Node 20+). Run with: node scripts/smoke/smoke.mjs

const BASE = process.env.SMOKE_WEB || "http://localhost:3000";
const API  = process.env.SMOKE_API || "http://localhost:8000";
const SKIP_BROWSER = process.env.SMOKE_SKIP_BROWSER === "1";

let passed = 0, failed = 0;
const errors = [];

async function get(url, opts = {}) {
  return await fetch(url, { redirect: "manual", ...opts });
}

async function jget(url) {
  const r = await get(url);
  if (!r.ok) throw new Error("GET " + url + " -> " + r.status);
  return await r.json();
}

async function step(name, fn) {
  const t0 = Date.now();
  try {
    const detail = await fn();
    const ms = Date.now() - t0;
    passed++;
    console.log("  PASS  " + name + " (" + ms + "ms)" + (detail ? " -- " + detail : ""));
    return true;
  } catch (e) {
    failed++;
    errors.push({ name, error: e.message || String(e) });
    console.log("  FAIL  " + name + " -- " + (e.message || e));
    return false;
  }
}

console.log("CC Scale smoke test");
console.log("  WEB:", BASE);
console.log("  API:", API);
console.log("");

// ---------- API ----------
console.log("--- API ---");

await step("GET /api/health returns 200", async () => {
  const r = await get(API + "/api/health");
  if (r.status !== 200) throw new Error("status " + r.status);
  const j = await r.json();
  if (j.status !== "ok") throw new Error("status=" + j.status);
  return "uptime=" + (j.uptime ? j.uptime.toFixed(1) + "s" : "n/a");
});

await step("GET /api/products?locale=en&pageSize=5 returns array", async () => {
  const j = await jget(API + "/api/products?locale=en&pageSize=5");
  const arr = j.data ?? j.items ?? j;
  if (!Array.isArray(arr)) throw new Error("not array: keys=" + Object.keys(j).join(","));
  return arr.length + " items";
});

await step("GET /api/products?pageSize=200 rejected (>100)", async () => {
  const r = await get(API + "/api/products?locale=en&pageSize=200");
  if (r.status < 400) throw new Error("expected 4xx, got " + r.status);
  return "status " + r.status;
});

await step("GET /api/products/search?sortBy=DROP_TABLE rejected", async () => {
  const r = await get(API + "/api/products/search?locale=en&sortBy=DROP_TABLE");
  if (r.status < 400) throw new Error("expected 4xx, got " + r.status);
  return "status " + r.status;
});

await step("GET /api/products/categories?locale=en returns array", async () => {
  const j = await jget(API + "/api/products/categories?locale=en");
  const arr = j.data ?? j.items ?? j;
  if (!Array.isArray(arr)) throw new Error("not array");
  return arr.length + " categories";
});

await step("GET /api/site-settings returns object", async () => {
  const r = await get(API + "/api/site-settings?locale=en");
  if (r.status !== 200) throw new Error("status " + r.status);
  return "ok";
});

await step("35 parallel GETs: no 5xx", async () => {
  const results = await Promise.all(
    Array.from({ length: 35 }, () => get(API + "/api/products?locale=en&pageSize=1"))
  );
  const codes = results.map(r => r.status);
  const bad = codes.filter(c => c >= 500);
  if (bad.length) throw new Error(bad.length + " 5xx: " + bad.join(","));
  return "200=" + codes.filter(c => c === 200).length + " 429=" + codes.filter(c => c === 429).length;
});

// ---------- Inquiry POST ----------
console.log("");
console.log("--- Inquiry POST ---");

await step("POST /api/inquiries (valid) accepted or captcha-rejected", async () => {
  const body = {
    name: "Smoke Test Buyer",
    email: "smoke@example.com",
    company: "Acme Imports GmbH",
    country: "DE",
    phone: "+491700000000",
    message: "Please quote FOB Shanghai for 200 units of CC-100 scale.",
    items: [{ productId: "smoke-product-id", quantity: 200 }],
    turnstileToken: "XXXX.DUMMY.TOKEN.XXXX",
  };
  const r = await fetch(API + "/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (![200, 201, 400, 403].includes(r.status)) {
    throw new Error("unexpected status " + r.status);
  }
  return "status " + r.status;
});

await step("POST /api/inquiries (huge message) rejected", async () => {
  const body = { name: "X", email: "x@x.com", message: "A".repeat(3000), items: [] };
  const r = await fetch(API + "/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (r.status < 400) throw new Error("expected 4xx, got " + r.status);
  return "status " + r.status;
});

await step("POST /api/inquiries (empty items) rejected", async () => {
  const body = { name: "X", email: "x@x.com", message: "hi", items: [] };
  const r = await fetch(API + "/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (r.status < 400) throw new Error("expected 4xx, got " + r.status);
  return "status " + r.status;
});

// ---------- Web ----------
console.log("");
console.log("--- Web ---");

if (SKIP_BROWSER) {
  console.log("  SKIP  web checks (SMOKE_SKIP_BROWSER=1)");
} else {
  await step("GET / 200", async () => {
    const r = await get(BASE + "/");
    if (r.status !== 200) throw new Error("status " + r.status);
  });

  await step("GET /zh 200 (default locale)", async () => {
    const r = await get(BASE + "/zh");
    if (r.status !== 200) throw new Error("status " + r.status);
  });

  await step("GET /en (200 or locale-redirect)", async () => {
    const r = await get(BASE + "/en");
    // 200 = served; 307 = middleware redirect (no cookie, no Accept-Language match)
    if (r.status === 307 || r.status === 308) return "redirect";
    if (r.status !== 200) throw new Error("status " + r.status);
  });

  await step("GET /zh/products 200", async () => {
    const r = await get(BASE + "/zh/products");
    if (r.status !== 200) throw new Error("status " + r.status);
  });

  await step("GET /en/products (200 or redirect)", async () => {
    const r = await get(BASE + "/en/products");
    if (r.status === 307 || r.status === 308) return "redirect";
    if (r.status !== 200) throw new Error("status " + r.status);
  });

  await step("GET /zh/inquiry 200", async () => {
    const r = await get(BASE + "/zh/inquiry");
    if (r.status !== 200) throw new Error("status " + r.status);
  });

  await step("GET /robots.txt 200 and has Sitemap directive", async () => {
    const r = await get(BASE + "/robots.txt");
    if (r.status !== 200) throw new Error("status " + r.status);
    const t = await r.text();
    if (!t.includes("Sitemap:")) throw new Error("no Sitemap directive");
  });

  await step("GET /sitemap.xml 200 with <urlset>", async () => {
    // Sitemap lives at /zh/sitemap.xml (per [locale] route)
    const r = await get(BASE + "/zh/sitemap.xml");
    if (r.status !== 200) throw new Error("status " + r.status);
    const t = await r.text();
    if (!t.includes("<urlset")) throw new Error("no <urlset>");
    return (t.match(/<url>/g) || []).length + " urls";
  });

  await step("Security headers present (X-Content-Type-Options)", async () => {
    const r = await get(BASE + "/");
    const h = r.headers;
    if (!h.get("x-content-type-options")) throw new Error("missing X-Content-Type-Options");
    return "XCTO=nosniff" + (h.get("strict-transport-security") ? " HSTS=on" : " HSTS=off (CDN adds)");
  });

  await step("Home page contains Organization or WebSite JSON-LD", async () => {
    const r = await get(BASE + "/zh");
    const t = await r.text();
    const hasOrg = t.includes('"@type":"Organization"');
    const hasSite = t.includes('"@type":"WebSite"');
    const hasOrgSpace = t.includes('"@type": "Organization"');
    const hasSiteSpace = t.includes('"@type": "WebSite"');
    if (!hasOrg && !hasSite && !hasOrgSpace && !hasSiteSpace) {
      throw new Error("no Organization/WebSite JSON-LD");
    }
    return (hasOrg || hasOrgSpace ? "Organization " : "") + (hasSite || hasSiteSpace ? "WebSite" : "");
  });

  await step("/zh has en+zh hreflang", async () => {
    const r = await get(BASE + "/zh");
    const t = await r.text();
    const hasEn = t.indexOf('hreflang="en"') >= 0 || t.indexOf('hrefLang="en') >= 0;
    const hasZh = t.indexOf('hreflang="zh"') >= 0 || t.indexOf('hrefLang="zh') >= 0;
    if (!hasEn || !hasZh) {
      throw new Error('missing en/zh hreflang in /zh (hasEn=' + hasEn + ' hasZh=' + hasZh + ')');
    }
  });
}

// ---------- Summary ----------
console.log("");
console.log("--- Summary ---");
console.log("  passed: " + passed);
console.log("  failed: " + failed);

if (failed > 0) {
  console.log("");
  console.log("Failures:");
  for (const e of errors) console.log("  - " + e.name + ": " + e.error);
  process.exit(1);
} else {
  console.log("");
  console.log("All smoke checks passed");
  process.exit(0);
}
