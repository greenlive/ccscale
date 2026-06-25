import type { MetadataRoute } from 'next';

/**
 * Dynamic manifest.ts — Next.js will generate /manifest.webmanifest at build time
 * and serve it with the correct Content-Type header.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CC Scale - Professional Weighing Solutions',
    short_name: 'CC Scale',
    description: 'Professional weighing scale manufacturer and B2B exporter. OEM/ODM services for body scales, hanging scales, kitchen scales, and more.',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#f5f4ed',
    theme_color: '#141413',
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'shopping', 'productivity'],
    icons: [
      {
        src: '/apple-touch-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'View Products',
        short_name: 'Products',
        description: 'Browse our product catalog',
        url: '/en/products',
      },
      {
        name: 'Submit Inquiry',
        short_name: 'Inquiry',
        description: 'Request a quote',
        url: '/en/contact',
      },
      {
        name: 'OEM/ODM Services',
        short_name: 'OEM',
        description: 'Custom manufacturing services',
        url: '/en/oem',
      },
    ],
  };
}