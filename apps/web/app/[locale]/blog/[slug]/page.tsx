import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Calendar, Clock, Share2, Tag } from 'lucide-react'
import { Button } from '@cc-scale/ui'
import Image from 'next/image'
import type { Metadata } from 'next'

const mockBlogPosts = [
  {
    id: 1,
    slug: 'how-to-choose-body-scale',
    titleEn: 'How to Choose the Right Body Scale for Your Business',
    titleZh: '如何为您的企业选择合适的体重秤',
    excerptEn: 'A comprehensive guide to selecting the perfect body scale for commercial and industrial use.',
    excerptZh: '为商业和工业用途选择完美体重秤的综合指南。',
    contentEn: `
      <h2>Introduction</h2>
      <p>Choosing the right body scale for your business is an important decision that can impact your operations and customer satisfaction.</p>

      <h2>Key Factors to Consider</h2>
      <ul>
        <li>Capacity and accuracy requirements</li>
        <li>Environment where the scale will be used</li>
        <li>Connectivity and data management needs</li>
        <li>Budget and total cost of ownership</li>
      </ul>

      <h2>Conclusion</h2>
      <p>By carefully evaluating your needs and considering these factors, you can select the perfect scale for your business.</p>
    `,
    contentZh: `
      <h2>介绍</h2>
      <p>为您的企业选择合适的体重秤是一个重要的决定，会影响您的运营和客户满意度。</p>

      <h2>需要考虑的关键因素</h2>
      <ul>
        <li>容量和精度要求</li>
        <li>秤的使用环境</li>
        <li>连接性和数据管理需求</li>
        <li>预算和总体拥有成本</li>
      </ul>

      <h2>结论</h2>
      <p>通过仔细评估您的需求并考虑这些因素，您可以为您的企业选择完美的秤。</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
    category: 'industry',
    tags: ['body scale', 'buying guide', 'commercial'],
    isFeatured: true,
    isActive: true,
    publishedAt: new Date('2024-03-15'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
  },
]

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const post = mockBlogPosts.find(p => p.slug === slug)
  if (!post) {
    return { title: 'Post Not Found' }
  }

  const isZh = locale === 'zh'
  const title = isZh ? post.titleZh : post.titleEn
  const description = isZh ? post.excerptZh : post.excerptEn

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export function generateStaticParams() {
  const locales = ['en', 'zh']
  const params: Array<{ locale: string; slug: string }> = []

  locales.forEach((locale) => {
    mockBlogPosts.forEach((post) => {
      params.push({ locale, slug: post.slug })
    })
  })

  return params
}

function BlogPostContent({ post }: { post: typeof mockBlogPosts[0] }) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  const title = isZh ? post.titleZh : post.titleEn
  const content = isZh ? post.contentZh : post.contentEn
  const date = post.publishedAt || post.createdAt
  const formattedDate = new Date(date).toLocaleDateString(
    isZh ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
  const readingTime = Math.max(1, Math.ceil((content?.length || 0) / 500))

  return (
    <article>
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-[#0A1628] mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isZh ? '返回博客' : 'Back to Blog'}
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formattedDate}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {readingTime} {isZh ? '分钟阅读' : 'min read'}
              </span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.coverImage && (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content || '' }}
          />

          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {isZh ? '分享这篇文章' : 'Share this article'}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  {isZh ? '分享' : 'Share'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}

export default function BlogPostPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const post = mockBlogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  return <BlogPostContent post={post} />
}
