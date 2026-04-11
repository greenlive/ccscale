import { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';

const baseUrl = 'https://www.ccscale.com';

const staticPages = [
  { path: '', priority: 1.0, changefreq: 'weekly' as const },
  { path: 'about', priority: 0.8, changefreq: 'monthly' as const },
  { path: 'products', priority: 0.9, changefreq: 'weekly' as const },
  { path: 'guarantee', priority: 0.7, changefreq: 'monthly' as const },
  { path: 'oem', priority: 0.8, changefreq: 'monthly' as const },
  { path: 'support', priority: 0.6, changefreq: 'monthly' as const },
  { path: 'contact', priority: 0.9, changefreq: 'monthly' as const },
  { path: 'inquiry', priority: 0.8, changefreq: 'weekly' as const },
  { path: 'ai-summary', priority: 0.5, changefreq: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      const prefix = locale === 'en' ? '' : `/${locale}`;
      const pagePath = page.path === '' ? '' : `/${page.path}`;
      entries.push({
        url: `${baseUrl}${prefix}${pagePath}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq,
        priority: page.priority,
      });
    });
  });

  // Add root
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  return entries;
}
