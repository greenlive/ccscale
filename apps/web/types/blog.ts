export interface BlogPost {
  id: number
  slug: string
  titleEn: string
  titleZh: string
  excerptEn?: string
  excerptZh?: string
  contentEn?: string
  contentZh?: string
  coverImage?: string
  authorId?: number
  category?: string
  tags: string[]
  isFeatured: boolean
  isActive: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type BlogCategory = 'industry' | 'product' | 'technical' | 'export'

export const blogCategories: {
  [key in BlogCategory]: { en: string; zh: string }
} = {
  industry: { en: 'Industry Guides', zh: '行业指南' },
  product: { en: 'Product News', zh: '新品发布' },
  technical: { en: 'Technical Articles', zh: '技术文章' },
  export: { en: 'Export Knowledge', zh: '出口知识' },
}
