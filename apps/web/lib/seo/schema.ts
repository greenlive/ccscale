export function generateProductSchema(product: any, locale: string) {
  const isZh = locale === 'zh';
  const name = isZh ? product.nameZh : product.nameEn;
  const description = isZh ? product.descriptionZh : product.descriptionEn;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: product.image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.priceMin,
      availability: 'https://schema.org/InStock',
    },
  };
}

export function generateOrganizationSchema(companyName?: string) {
  const name = companyName || 'CC Scale';
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: 'https://www.zzscale.com',
    logo: 'https://www.zzscale.com/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-XXX-XXXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese'],
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateBlogPostingSchema(post: any, locale: string, companyName?: string) {
  const isZh = locale === 'zh';
  const publisherName = companyName || 'CC Scale';
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: isZh ? post.titleZh : post.titleEn,
    description: isZh ? post.excerptZh : post.excerptEn,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: publisherName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.zzscale.com/logo.svg',
      },
    },
  };
}

export function generateVideoSchema(videoUrl: string, title: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    embedUrl: videoUrl,
    thumbnailUrl: '/video-thumbnail.jpg',
  };
}
