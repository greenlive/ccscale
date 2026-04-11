'use client'

import { useLocale } from 'next-intl'
import { usePathname, useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { cn } from '@cc-scale/ui'
import { blogCategories, type BlogCategory } from '@/types/blog'

interface BlogCategoriesProps {
  currentCategory?: string
}

export function BlogCategories({ currentCategory }: BlogCategoriesProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createCategoryUrl = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={createCategoryUrl('')}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          !currentCategory
            ? 'bg-accent text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        {isZh ? '全部' : 'All'}
      </Link>
      {Object.entries(blogCategories).map(([key, labels]) => (
        <Link
          key={key}
          href={createCategoryUrl(key)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            currentCategory === key
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {isZh ? labels.zh : labels.en}
        </Link>
      ))}
    </div>
  )
}
