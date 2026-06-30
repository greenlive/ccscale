/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
  
  // Vercel 优化配置

  
  images: {
    remotePatterns: [
      // Allow-list of hostnames whose images Next.js may fetch and
      // optimise. Configure with NEXT_PUBLIC_IMAGE_REMOTE_HOSTS
      // (comma-separated) in deployment. The defaults below match the
      // zzscale.com production layout (api.zzscale.com serves the
      // /uploads static directory; cdn.zzscale.com is reserved for
      // future CDN assets). Edit when adding a new origin.
      { protocol: 'https', hostname: 'api.zzscale.com' },
      { protocol: 'https', hostname: 'cdn.zzscale.com' },
      { protocol: 'https', hostname: 'www.zzscale.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
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