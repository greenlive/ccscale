/**
 * React Query hooks for API data fetching
 * Provides caching, automatic refetching, and consistent loading/error states
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  // New JSON array string fields for enhanced product display
  mainImages?: string; // JSON array string e.g. '["url1","url2"]'
  detailImages?: string; // JSON array string e.g. '["url1","url2"]'
  videos?: string; // JSON array string e.g. '["url1","url2"]'
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
  customerCases?: CustomerCaseData[];
}

export interface CustomerCaseData {
  id: number;
  companyName: string;
  logoUrl?: string;
  quote?: string;
  productName?: string;
  region?: string;
  order: number;
}

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
  keyEn: string;
  keyZh: string;
  valueEn: string;
  valueZh: string;
  order: number;
}

export interface Testimonial {
  id: number;
  nameEn: string;
  nameZh: string;
  companyEn?: string;
  companyZh?: string;
  countryEn?: string;
  countryZh?: string;
  avatarUrl?: string;
  contentEn: string;
  contentZh: string;
  rating: number;
  order: number;
  isActive: boolean;
}

export interface Client {
  id: number;
  nameEn: string;
  nameZh: string;
  logoUrl: string;
  website?: string;
  order: number;
  isActive: boolean;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
}

// API fetch functions
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`/api${endpoint}`);
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

// Product Search Hook
export interface ProductSearchParams {
  q?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useProductSearch(params: ProductSearchParams) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set('q', params.q);
  if (params.categoryId) searchParams.set('categoryId', String(params.categoryId));
  if (params.minPrice !== undefined) searchParams.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) searchParams.set('maxPrice', String(params.maxPrice));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));

  const queryString = searchParams.toString();
  const enabled = (params.q?.length ?? 0) > 0 || !!params.categoryId;

  return useQuery({
    queryKey: [...queryKeys.products.all, 'search', params],
    queryFn: () => fetchApi<PaginatedResult<Product>>(`/products/search?${queryString}`),
    enabled,
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
    queryFn: () => fetchApi<Record<string, string>>('/site-settings'),
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

// Blog Hooks
export interface BlogPost {
  id: number;
  slug: string;
  titleEn: string;
  titleZh: string;
  excerptEn?: string;
  excerptZh?: string;
  contentEn?: string;
  contentZh?: string;
  coverImage?: string;
  category?: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function useBlogPosts(page: number = 1, category?: string) {
  const params = new URLSearchParams({ page: String(page), isActive: 'true' });
  if (category) params.set('category', category);

  return useQuery({
    queryKey: ['blog', 'list', page, category],
    queryFn: () => fetchApi<PaginatedResult<BlogPost>>(`/blog?${params}`),
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', 'slug', slug],
    queryFn: () => fetchApi<BlogPost>(`/blog/slug/${slug}`),
    enabled: !!slug,
  });
}

// Cases Hooks
export interface CustomerCase {
  id: number;
  companyName: string;
  logoUrl?: string;
  quote?: string;
  productName?: string;
  region?: string;
  order: number;
  isActive: boolean;
  product?: { id: number; nameEn: string; nameZh: string; slug: string };
}

export function useCases(page: number = 1) {
  return useQuery({
    queryKey: ['cases', 'list', page],
    queryFn: () => fetchApi<PaginatedResult<CustomerCase>>(`/cases?isActive=true&page=${page}`),
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
  message: string;
}

export function useSubmitInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InquiryData) =>
      fetch(`/api/inquiries`, {
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
      const response = await fetch(`/api/site-settings`);
      if (!response.ok) {
        return { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' };
      }
      const settings: Record<string, string> = await response.json();
      return {
        facebook: settings['social_facebook'] || '',
        instagram: settings['social_instagram'] || '',
        linkedin: settings['social_linkedin'] || '',
        twitter: settings['social_twitter'] || '',
        youtube: settings['social_youtube'] || '',
      };
    },
    staleTime: 60 * 60 * 1000,
  });
}
