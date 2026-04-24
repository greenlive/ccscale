'use client'

import { useLocale } from 'next-intl'
import { Card, CardContent } from '@cc-scale/ui'
import Image from 'next/image'
import type { ClientCase } from '@/types/case'

interface ClientShowcaseProps {
  cases: ClientCase[]
  titleEn?: string
  titleZh?: string
}

export function ClientShowcase({
  cases,
  titleEn = 'Our Clients',
  titleZh = '我们的客户',
}: ClientShowcaseProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'
  const title = isZh ? titleZh : titleEn

  const activeCases = cases.filter(c => c.isActive).sort((a, b) => a.order - b.order)

  if (activeCases.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-warm-sand">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {activeCases.map((clientCase) => {
            const name = isZh ? clientCase.nameZh : clientCase.nameEn
            return (
              <div key={clientCase.id} className="flex items-center justify-center">
                {clientCase.logoUrl ? (
                  <div className="relative w-32 h-20 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image
                      src={clientCase.logoUrl}
                      alt={name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Card className="w-full p-4 text-center">
                    <CardContent>
                      <p className="font-semibold text-primary">{name}</p>
                      <p className="text-sm text-gray-500">
                        {isZh ? clientCase.countryZh : clientCase.countryEn}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
