#!/usr/bin/env node
// Detect UTF-8 BOM (EF BB BF) in source-controlled JSON/YAML/TOML files.
// Run in CI: `node scripts/check-bom.mjs`
import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const SKIP = new Set(['node_modules', '.next', '.git', 'dist', 'coverage', 'out', 'uploads', '.omc', '.agents', '.claude', '.cursor', '.codex', '.superpowers', '.windsurf', '.turbo', '.ai-bridge']);
const EXTS = new Set(['.json', '.yml', '.yaml', '.toml', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.css', '.md', '.html']);

let problems = 0;
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      try { walk(p); } catch {}
    } else if (EXTS.has(extname(e.name))) {
      try {
        const fd = readFileSync(p);
        if (fd[0] === 0xef && fd[1] === 0xbb && fd[2] === 0xbf) {
          console.error('BOM:', p);
          problems++;
        }
      } catch {}
    }
  }
}
walk(process.cwd());
if (problems > 0) {
  console.error(`\n\u274c Found ${problems} files with UTF-8 BOM.`);
  process.exit(1);
}
console.log('\u2705 No BOM found');


