'use client'

import { useLocale } from 'next-intl'

interface AttributeSpec {
  keyEn: string
  keyZh: string
  valueEn: string
  valueZh: string
}

interface ProductAttributesProps {
  specs: AttributeSpec[]
  titleEn?: string
  titleZh?: string
}

export function ProductAttributes({
  specs,
  titleEn = 'Specifications',
  titleZh = '规格参数',
}: ProductAttributesProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  if (!specs || specs.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <h3 className="text-2xl font-bold text-primary mb-6">
        {isZh ? titleZh : titleEn}
      </h3>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <dl className="divide-y divide-gray-100">
          {specs.map((spec, index) => {
            const key = isZh ? spec.keyZh : spec.keyEn
            const value = isZh ? spec.valueZh : spec.valueEn
            const isEven = index % 2 === 0

            return (
              <div
                key={index}
                className={`flex flex-col sm:flex-row ${
                  isEven ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <dt className="py-3 px-4 sm:w-1/3 text-gray-500 font-medium text-sm sm:text-base">
                  {key}
                </dt>
                <dd className="py-3 px-4 sm:w-2/3 text-primary font-medium text-sm sm:text-base">
                  {value}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
