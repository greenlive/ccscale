import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogCategories } from '@/components/blog/BlogCategories'
import type { Metadata } from 'next'

const mockBlogPosts = [
  {
    id: 1,
    slug: 'how-to-choose-body-scale',
    titleEn: 'How to Choose the Right Body Scale for Your Business',
    titleZh: '如何为您的企业选择合适的体重秤',
    excerptEn: 'A comprehensive guide to selecting the perfect body scale for commercial and industrial use.',
    excerptZh: '为商业和工业用途选择完美体重秤的综合指南。',
    contentEn: 'Detailed content about choosing body scales...',
    contentZh: '关于如何选择体重秤的详细内容...',
    coverImage: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
    category: 'industry',
    tags: ['body scale', 'buying guide', 'commercial'],
    isFeatured: true,
    isActive: true,
    publishedAt: new Date('2024-03-15'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 2,
    slug: 'new-product-launch-bs-300',
    titleEn: 'Introducing Our New Smart Body Scale BS-300',
    titleZh: '介绍我们的新型智能体重秤 BS-300',
    excerptEn: 'Discover the features of our latest smart body scale with advanced technology.',
    excerptZh: '了解我们最新的智能体重秤的先进技术功能。',
    contentEn: 'Product launch content...',
    contentZh: '产品发布内容...',
    coverImage: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
    category: 'product',
    tags: ['new product', 'smart scale', 'BS-300'],
    isFeatured: true,
    isActive: true,
    publishedAt: new Date('2024-03-10'),
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-10'),
  },
]

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'blog' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

function BlogListContent() {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0A1628] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {isZh ? '博客与资讯' : 'Blog & Insights'}
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            {isZh
              ? '行业动态、产品资讯和技术知识'
              : 'Industry news, product updates, and technical knowledge'}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <BlogCategories />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBlogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function BlogPage() {
  return <BlogListContent />
}
