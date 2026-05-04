/**
 * React Query hooks for API data fetching
 * Provides caching, automatic refetching, and consistent loading/error states
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface Product {
  id: number;
  name: string;
  nameEn?: string;
  nameZh?: string;
  slug: string;
  sku?: string;
  description?: string;
  descriptionEn?: string;
  descriptionZh?: string;
  shortDescEn?: string;
  shortDescZh?: string;
  mainImage?: string;
  categoryId?: number;
  category?: ProductCategory;
  images?: ProductImage[];
  specs?: ProductSpec[];
  videoUrl?: string;
  priceMin?: number;
  priceMax?: number;
  moq?: number;
  leadTime?: string;
  isActive: boolean;
  isFeatured?: boolean;
  seoTitleEn?: string;
  seoTitleZh?: string;
  seoDescEn?: string;
  seoDescZh?: string;
  seoKeywordsEn?: string;
  seoKeywordsZh?: string;
  createdAt: string;
  updatedAt: string;
  // B2B fields
  coreSellingPointsEn?: string;
  coreSellingPointsZh?: string;
  applicationScenariosEn?: string;
  applicationScenariosZh?: string;
  faqEn?: string;
  faqZh?: string;
  certifications?: string; // JSON array string e.g. '["CE","FCC"]'
  hsCode?: string;
  paymentTerms?: string;
  shippingTerms?: string;
  warrantyInfo?: string;
  packagingInfoEn?: string;
  packagingInfoZh?: string;
  manufacturerName?: string;
  factoryLocation?: string;
  productionCapacity?: string;
  // B2B trade extension
  fobPort?: string;
  tradeKeywords?: string; // JSON array string
  targetMarkets?: string; // JSON array string
  exportExperience?: string;
  productionCapacityUnit?: string;
  // Factory showcase (from site settings or product)
  factoryYears?: number;
  factoryCountries?: number;
  factoryCapacity?: string;
  factoryDescription?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  productCount?: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  altEn?: string;
  altZh?: string;
  order: number;
  isMain: boolean;
}

export interface ProductSpec {
  id: number;
  labelEn: string;
  labelZh: string;
  valueEn: string;
  valueZh: string;
  order: number;
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientCompany: string;
  clientTitle?: string;
  avatarUrl?: string;
  content: string;
  rating: number;
  isActive: boolean;
  order: number;
}

export interface Client {
  id: number;
  name: string;
  logoUrl: string;
  website?: string;
  isActive: boolean;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
}

// API fetch functions
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}/api${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

// Query Keys
export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (params?: Record<string, string>) => [...queryKeys.products.all, 'list', params] as const,
    detail: (slug: string) => [...queryKeys.products.all, 'detail', slug] as const,
    categories: ['products', 'categories'] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
    list: ['testimonials', 'list'] as const,
  },
  clients: {
    all: ['clients'] as const,
    list: ['clients', 'list'] as const,
  },
  settings: {
    all: ['settings'] as const,
    byKey: (key: string) => ['settings', key] as const,
  },
  social: {
    all: ['social'] as const,
  },
};

// Products Hooks
export function useProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => fetchApi<Product[]>('/products' + (params ? `?${new URLSearchParams(params)}` : '')),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => fetchApi<Product>(`/products/slug/${slug}`),
    enabled: !!slug,
  });
}

export function useRelatedProducts(productId: number, limit: number = 4) {
  return useQuery({
    queryKey: [...queryKeys.products.all, 'related', productId, limit],
    queryFn: () => fetchApi<Product[]>(`/products/related/${productId}?limit=${limit}`),
    enabled: !!productId,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: queryKeys.products.categories,
    queryFn: () => fetchApi<ProductCategory[]>('/products/categories'),
    staleTime: 30 * 60 * 1000, // Categories rarely change
  });
}

// Testimonials Hooks
export function useTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials.list,
    queryFn: () => fetchApi<Testimonial[]>('/testimonials?isActive=true'),
  });
}

// Clients Hooks
export function useClients() {
  return useQuery({
    queryKey: queryKeys.clients.list,
    queryFn: () => fetchApi<Client[]>('/clients?isActive=true'),
  });
}

// Site Settings Hooks
export function useSiteSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => fetchApi<SiteSetting[]>('/site-settings'),
    staleTime: 60 * 60 * 1000, // Settings rarely change
  });
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: queryKeys.settings.byKey(key),
    queryFn: () => fetchApi<SiteSetting>(`/site-settings/${key}`),
    enabled: !!key,
  });
}

// Inquiry Mutation
export interface InquiryData {
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  company?: string;
  country?: string;
  city?: string;
  message: string;
  source?: string;
  // 来源追踪字段
  trafficSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  items?: Array<{
    productId: number;
    productNameEn: string;
    productNameZh: string;
    quantity: number;
    unitPrice?: number;
  }>;
}

export interface InquiryResponse {
  id: number;
  inquiryNumber: string;
  message: string;
}

export function useSubmitInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InquiryData) =>
      fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to submit inquiry');
        }
        return response.json() as Promise<InquiryResponse>;
      }),
    onSuccess: () => {
      // Invalidate any cached inquiry-related data if needed
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

// Social Media Settings Hook
export function useSocialMediaSettings() {
  return useQuery({
    queryKey: queryKeys.social.all,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/site-settings/social-media`);
      if (!response.ok) {
        return { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' };
      }
      return response.json();
    },
    staleTime: 60 * 60 * 1000,
  });
}
