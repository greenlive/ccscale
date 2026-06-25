// Stub for ISR product demo
// Real product data comes from API; this stub allows the demo page to type-check.
export interface ProductStub {
  id: string;
  slug: string;
  nameEn: string;
  nameZh: string;
  seoDescEn: string;
  seoDescZh: string;
}

export async function getProductBySlug(slug: string, locale: string): Promise<ProductStub | null> {
  return {
    id: slug,
    slug,
    nameEn: slug,
    nameZh: slug,
    seoDescEn: 'Product description',
    seoDescZh: '\u4ea7\u54c1\u63cf\u8ff0',
  };
}
