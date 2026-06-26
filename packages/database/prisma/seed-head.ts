import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

/**
 * Generate a strong random password (24 chars) for the seeded admin/editor.
 * Logged ONCE on stdout. Refuses to seed in production without ALLOW_SEED=1.
 */
function generatePassword(): string {
  return randomBytes(18).toString('base64url'); // ~24 url-safe chars
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== '1') {
    throw new Error(
      'Refusing to run seed in production. Set ALLOW_SEED=1 if you really need to re-seed (NOT recommended for password seeding).',
    );
  }

  console.log('Starting seed...');

  // Create admin user (password is strong & random; logged once)
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || generatePassword();
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`[seed] Generated admin password (write this down): ${adminPassword}`);
  }
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zzscale.com' },
    update: {},
    create: {
      email: 'admin@zzscale.com',
      password: await bcrypt.hash(adminPassword, 12),
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create editor user
  const editorPassword = process.env.SEED_EDITOR_PASSWORD || generatePassword();
  if (!process.env.SEED_EDITOR_PASSWORD) {
    console.log(`[seed] Generated editor password (write this down): ${editorPassword}`);
  }
  const editor = await prisma.user.upsert({
    where: { email: 'editor@zzscale.com' },
    update: {},
    create: {
      email: 'editor@zzscale.com',
