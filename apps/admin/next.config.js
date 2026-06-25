/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
  
  // Vercel 优化配置

  
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // 本地开发环境需要 rewrites
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
        {
          source: '/uploads/:path*',
          destination: 'http://localhost:8000/uploads/:path*',
        },
      ];
    }
    return [];
  },
  
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
    optimizePackageImports: ['lucide-react'],
    // optimizeCss: true, (requires critters - disabled for compat)
  },
};

module.exports = nextConfig;