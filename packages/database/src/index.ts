import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Vercel Serverless 环境优化：
// - 使用 globalThis 保持连接池在冷启动之间复用
// - Vercel 会自动在函数实例之间共享 globalThis
const globalForPrisma = globalThis as typeof globalThis & {
  __prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    // Vercel Serverless 优化配置
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// 生产环境（Vercel）下保持单例
if (process.env.NODE_ENV !== 'development') {
  globalForPrisma.__prisma = prisma;
}

// 优雅关闭 - Vercel 函数结束时清理连接
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export * from '@prisma/client';