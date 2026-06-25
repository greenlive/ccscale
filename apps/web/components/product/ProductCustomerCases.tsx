'use client'

import { useLocale } from 'next-intl'
import Image from 'next/image'
import { Star, MessageSquare } from 'lucide-react'

interface CustomerCase {
  companyName: string
  logo?: string
  quote?: string
  region?: string
}

interface ProductCustomerCasesProps {
  cases?: CustomerCase[]
  titleEn?: string
  titleZh?: string
}

export function ProductCustomerCases({
  cases,
  titleEn = 'Trusted by Global Buyers',
  titleZh = '全球买家信赖',
}: ProductCustomerCasesProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  if (!cases || cases.length === 0) return null

  const hasQuote = cases.some((c) => c.quote)

  return (
    <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200 rounded-xl p-6">
      <h3 className="font-bold text-amber-700 mb-4 flex items-center gap-2">
        <Star className="w-5 h-5" />
        {isZh ? titleZh : titleEn}
      </h3>

      {/* Quotes */}
      {hasQuote && (
        <div className="space-y-3 mb-4">
          {cases.filter((c) => c.quote).slice(0, 2).map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border border-amber-100">
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="text-xs text-gray-500 text-right">
                — {item.companyName}
                {item.region && ` · ${item.region}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logo Wall */}
      <div className="flex flex-wrap gap-3">
        {cases.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
          >
            {item.logo ? (
              <Image
                src={item.logo}
                alt={item.companyName}
                width={24}
                height={24}
                className="w-6 h-6 rounded object-cover"
                unoptimized
              />
            ) : (
              <div className="w-6 h-6 rounded bg-warm-sand flex items-center justify-center text-xs text-stone-gray">
                {item.companyName?.charAt(0) || '?'}
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">{item.companyName}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
