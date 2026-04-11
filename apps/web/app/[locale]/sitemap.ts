import { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';

type SitemapItem = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

const productCategories = [
  { slug: 'body-scales' },
  { slug: 'hanging-scales' },
  { slug: 'kitchen-scales' },
  { slug: 'baby-scales' },
  { slug: 'dial-scales' },
  { slug: 'crane-scales' },
];

const products = [
  { slug: 'digital-body-scale-bs-200' },
  { slug: 'smart-body-scale-bf-200' },
  { slug: 'hanging-scale-hs-500' },
  { slug: 'crane-scale-cs-1000' },
  { slug: 'kitchen-scale-ks-300' },
  { slug: 'baby-scale-bs-100' },
];

const blogPosts = [
  { slug: 'how-to-choose-body-scale' },
  { slug: 'new-product-launch-bs-300' },
];

export default async function sitemap({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.ccscale.com';
  const lastMod = new Date();

  const pages: SitemapItem[] = [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/products`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/guarantee`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/${locale}/oem`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${locale}/support`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/${locale}/contact`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/ai-summary`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/${locale}/blog`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/inquiry`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${locale}/certifications`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/${locale}/cases`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];

  productCategories.forEach((category) => {
    pages.push({
      url: `${baseUrl}/${locale}/products/categories/${category.slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  products.forEach((product) => {
    pages.push({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  blogPosts.forEach((post) => {
    pages.push({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  return pages;
}

