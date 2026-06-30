const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
  
  // Vercel 浼樺寲閰嶇疆
  // 鎸囧畾鍦?Vercel 鐜涓笉闇€瑕佹墦鍖呯殑渚濊禆锛堜娇鐢ㄤ簯绔繍琛屾椂锛?
  
  images: {
    // Allow remote product images from any CDN (admin can change later)
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
    // SVG support: keep sharp defaults; social platforms prefer raster, so OG uses .svg path which many platforms accept
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Vercel Image Optimization 浣跨敤鍐呯疆 Sharp 鑷姩浼樺寲
  },
  
  // 鏈湴寮€鍙戠幆澧冮渶瑕?rewrites 鎸囧悜鍚庣锛岀敓浜х幆澧冪敱 Vercel 鐜鍙橀噺鎺у埗
  async rewrites() {
    // 鍙湁鍦?localhost 寮€鍙戠幆澧冩墠浣跨敤 rewrites
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
    // 鐢熶骇鐜涓嶈繘琛?rewrites锛孉PI 鐩存帴璋冪敤鐜鍙橀噺涓殑 URL
    return [];
  },
  
  typescript: { ignoreBuildErrors: true },
  experimental: {
    // Externalize serverless packages (Next 14.2 equivalent of serverExternalPackages)
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
    // Keep react-query out of barrel optimization (needed for useQuery named import)
    optimizePackageImports: ['lucide-react'],
    // optimizeCss: true, (requires critters package - disabled for compatibility)
  },
  
  // Vercel headers (configured in vercel.json, here as fallback)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*).svg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);