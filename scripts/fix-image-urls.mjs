/**
 * Fix image/video URLs in the database
 *
 * Converts absolute URLs (e.g., http://localhost:8000/uploads/...)
 * to relative paths (e.g., /uploads/...) to ensure portability
 * across environments.
 *
 * Usage: node scripts/fix-image-urls.mjs
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config(); // fallback to .env

const prisma = new PrismaClient();

function fixUrl(url) {
  if (!url || typeof url !== 'string') return url;
  // Strip protocol + hostname, keep only path
  // e.g., "http://localhost:8000/uploads/product-image/xxx.jpg" → "/uploads/product-image/xxx.jpg"
  return url.replace(/^https?:\/\/[^\/]+(\/.*)$/, '$1');
}

function fixJsonField(value) {
  if (!value) return value;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return value;
    const fixed = parsed.map(url => fixUrl(url));
    return JSON.stringify(fixed);
  } catch {
    // Not valid JSON, try fixing as single URL
    return fixUrl(value);
  }
}

async function main() {
  console.log('Scanning products for absolute image/video URLs...\n');

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { mainImages: { not: null } },
        { detailImages: { not: null } },
        { videos: { not: null } },
      ],
    },
    select: { id: true, sku: true, nameEn: true, mainImages: true, detailImages: true, videos: true },
  });

  console.log(`Found ${products.length} products with media fields.\n`);

  let updatedCount = 0;
  let fixCount = 0;

  for (const product of products) {
    const fixedMain = fixJsonField(product.mainImages);
    const fixedDetail = fixJsonField(product.detailImages);
    const fixedVideos = fixJsonField(product.videos);

    const hasFix =
      fixedMain !== product.mainImages ||
      fixedDetail !== product.detailImages ||
      fixedVideos !== product.videos;

    if (hasFix) {
      console.log(`Fixing product #${product.id} (${product.sku}):`);
      if (fixedMain !== product.mainImages) {
        console.log(`  mainImages: ${product.mainImages} → ${fixedMain}`);
        fixCount++;
      }
      if (fixedDetail !== product.detailImages) {
        console.log(`  detailImages: ${product.detailImages} → ${fixedDetail}`);
        fixCount++;
      }
      if (fixedVideos !== product.videos) {
        console.log(`  videos: ${product.videos} → ${fixedVideos}`);
        fixCount++;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: {
          mainImages: fixedMain,
          detailImages: fixedDetail,
          videos: fixedVideos,
        },
      });
      updatedCount++;
    }
  }

  console.log(`\nDone! Updated ${updatedCount} products, fixed ${fixCount} URL fields.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
