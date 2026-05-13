export interface ProductCategory {
  id: number;
  nameEn: string;
  nameZh: string;
  slug: string;
  imageUrl?: string;
  descriptionEn?: string;
  descriptionZh?: string;
  order: number;
  isActive: boolean;
  products?: Product[];
}

export interface ProductSpec {
  id: number;
  productId: number;
  keyEn: string;
  keyZh: string;
  valueEn: string;
  valueZh: string;
  order: number;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altEn?: string;
  altZh?: string;
  order: number;
  isMain: boolean;
}

export interface Product {
  id: number;
  categoryId: number;
  sku: string;
  nameEn: string;
  nameZh: string;
  slug: string;
  descriptionEn?: string;
  descriptionZh?: string;
  shortDescEn?: string;
  shortDescZh?: string;
  mainImage?: string;
  videoUrl?: string;
  priceMin?: number;
  priceMax?: number;
  moq?: number;
  leadTime?: string;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
  category?: ProductCategory;
  images?: ProductImage[];
  specs?: ProductSpec[];
}

export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const response = await fetch(`/api/products/categories`);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  return [];
}

export async function getProducts(categoryId?: number): Promise<Product[]> {
  try {
    const url = categoryId
      ? `/api/products?categoryId=${categoryId}`
      : `/api/products`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
  return [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/slug/${slug}`);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }
  return null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?isFeatured=true`);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
  }
  return [];
}

// Inquiry functions
export interface CreateInquiryRequest {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  city?: string;
  message: string;
  items?: Array<{
    productId?: number;
    productNameEn?: string;
    productNameZh?: string;
    quantity?: number;
    unitPrice?: number;
  }>;
}

export interface InquiryResponse {
  id: number;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
}

export async function submitInquiry(data: CreateInquiryRequest): Promise<InquiryResponse | null> {
  try {
    const response = await fetch(`/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Failed to submit inquiry:', error);
  }
  return null;
}