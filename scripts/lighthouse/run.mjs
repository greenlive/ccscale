#!/usr/bin/env node
// scripts/lighthouse/run.mjs
// Run Lighthouse on one or more URLs and assert score thresholds.
// Requires: `lighthouse` (npm i -g lighthouse OR npx -y lighthouse)
// Usage:
//   node scripts/lighthouse/run.mjs https://www.zzscale.com
//   LH_THRESHOLDS=0.95 node scripts/lighthouse/run.mjs https://www.zzscale.com https://www.zzscale.com/en/products
//   LH_CHROME_PATH=/usr/bin/google-chrome node scripts/lighthouse/run.mjs https://www.zzscale.com

import { spawn } from "node:child_process";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: node scripts/lighthouse/run.mjs <url> [url2 ...]");
  process.exit(2);
}

const THRESHOLDS = {
  performance: Number(process.env.LH_THRESHOLD_PERF ?? 0.90),
  accessibility: Number(process.env.LH_THRESHOLD_A11Y ?? 0.95),
  "best-practices": Number(process.env.LH_THRESHOLD_BP ?? 0.95),
  seo: Number(process.env.LH_THRESHOLD_SEO ?? 0.95),
};

const OUT_DIR = resolve(process.cwd(), "lighthouse-reports");
mkdirSync(OUT_DIR, { recursive: true });

const CHROME_FLAGS = [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
];
if (process.env.LH_CHROME_PATH) {
  CHROME_FLAGS.push("--chrome-path=" + process.env.LH_CHROME_PATH);
}

const summary = [];

for (const url of args) {
  console.log("\n========================");
  console.log("URL:", url);
  console.log("========================");

  const slug = url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const outFile = resolve(OUT_DIR, slug + ".json");
  const htmlFile = resolve(OUT_DIR, slug + ".html");

  const lhArgs = [
    url,
    "--output=json",
    "--output=html",
    "--output-path=" + outFile.replace(/\.json$/, ""),
    "--quiet",
    "--chrome-flags=" + CHROME_FLAGS.join(" "),
    "--only-categories=performance,accessibility,best-practices,seo",
  ];

  const npxCmd = process.env.LH_USE_GLOBAL === "1" ? "lighthouse" : "npx";
  const npxArgs = process.env.LH_USE_GLOBAL === "1" ? lhArgs : ["-y", "lighthouse", ...lhArgs];

  await new Promise((resolveRun) => {
    const child = spawn(npxCmd, npxArgs, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code !== 0) {
        console.error("lighthouse exited with code", code);
      }
      resolveRun();
    });
  });

  if (!existsSync(outFile)) {
    summary.push({ url, ok: false, reason: "report file not generated" });
    continue;
  }

  const report = JSON.parse((await import("node:fs")).readFileSync(outFile, "utf8"));
  const cats = report.categories ?? {};
  const scores = {
    performance: cats.performance?.score,
    accessibility: cats.accessibility?.score,
    "best-practices": cats["best-practices"]?.score,
    seo: cats.seo?.score,
  };

  console.log("\nScores (0-100):");
  const failed = [];
  for (const [k, v] of Object.entries(scores)) {
    const pct = v == null ? "n/a" : Math.round(v * 100);
    const t = THRESHOLDS[k];
    const ok = v != null && v >= t;
    const mark = ok ? "PASS" : "FAIL";
    console.log("  " + mark + "  " + k.padEnd(16) + " " + pct + "  (threshold " + Math.round(t * 100) + ")");
    if (!ok) failed.push({ category: k, score: pct, threshold: Math.round(t * 100) });
  }

  // Core Web Vitals
  const audits = report.audits ?? {};
  const cwv = {
    LCP: audits["largest-contentful-paint"]?.displayValue,
    INP: audits["interactive"]?.displayValue, // Note: Lighthouse 11+ uses `interactive` proxy
    CLS: audits["cumulative-layout-shift"]?.displayValue,
    TBT: audits["total-blocking-time"]?.displayValue,
    FCP: audits["first-contentful-paint"]?.displayValue,
    SI:  audits["speed-index"]?.displayValue,
    TTI: audits["interactive"]?.displayValue,
  };
  console.log("\nCore Web Vitals:");
  for (const [k, v] of Object.entries(cwv)) {
    console.log("  " + k.padEnd(5) + " " + (v ?? "n/a"));
  }

  summary.push({ url, scores, cwv, failed, ok: failed.length === 0 });
}

console.log("\n========================");
console.log("Lighthouse summary");
console.log("========================");
let allOk = true;
for (const s of summary) {
  const pct = (k) => s.scores?.[k] != null ? Math.round(s.scores[k] * 100) : "n/a";
  console.log(
    (s.ok ? "PASS" : "FAIL") + "  " + s.url.padEnd(48) +
    " perf=" + pct("performance") +
    " a11y=" + pct("accessibility") +
    " bp=" + pct("best-practices") +
    " seo=" + pct("seo")
  );
  if (!s.ok) allOk = false;
}

console.log("\nReports written to:", OUT_DIR);
process.exit(allOk ? 0 : 1);