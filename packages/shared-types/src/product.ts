import type { LocalizedString } from './common';

export interface ProductCategory {
  id: number;
  name: LocalizedString;
  slug: string;
  imageUrl?: string;
  description?: LocalizedString;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  alt?: LocalizedString;
  order: number;
  isMain: boolean;
  createdAt: string;
}

export interface ProductSpec {
  id: number;
  productId: number;
  key: LocalizedString;
  value: LocalizedString;
  order: number;
  createdAt: string;
}

export interface Product {
  id: number;
  categoryId: number;
  sku: string;
  name: LocalizedString;
  slug: string;
  description?: LocalizedString;
  shortDesc?: LocalizedString;
  mainImage?: string;
  videoUrl?: string;
  priceMin?: number;
  priceMax?: number;
  moq?: number;
  leadTime?: string;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle?: LocalizedString;
  seoDesc?: LocalizedString;
  seoKeywords?: LocalizedString;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategory;
  images?: ProductImage[];
  specs?: ProductSpec[];
}
