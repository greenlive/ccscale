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

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CC Scale',
    url: 'https://www.ccscale.com',
    logo: 'https://www.ccscale.com/logo.png',
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

export function generateBlogPostingSchema(post: any, locale: string) {
  const isZh = locale === 'zh';
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
      name: 'CC Scale',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CC Scale',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ccscale.com/logo.png',
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
