'use client'

import { useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Calendar, Clock, Tag } from 'lucide-react'
import { Card, CardContent } from '@cc-scale/ui'
import Image from 'next/image'
import type { BlogPost } from '@/types/blog'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  const title = isZh ? post.titleZh : post.titleEn
  const excerpt = (isZh ? post.excerptZh : post.excerptEn) || ''
  const date = post.publishedAt || post.createdAt
  const formattedDate = new Date(date).toLocaleDateString(
    isZh ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  const content = (isZh ? post.contentZh : post.contentEn) || ''
  const readingTime = Math.max(1, Math.ceil(content.length / 500))

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-none h-full">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formattedDate}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {readingTime} {isZh ? '分钟' : 'min'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#0A1628] group-hover:text-accent transition-colors mb-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-gray-600 line-clamp-3">
              {excerpt}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
