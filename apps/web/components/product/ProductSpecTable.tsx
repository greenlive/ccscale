'use client'

import { useLocale } from 'next-intl'

interface ProductSpec {
  keyEn: string
  keyZh: string
  valueEn: string
  valueZh: string
}

interface ProductSpecTableProps {
  specs: ProductSpec[]
  titleEn?: string
  titleZh?: string
}

export function ProductSpecTable({
  specs,
  titleEn = 'Specifications',
  titleZh = '规格参数',
}: ProductSpecTableProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  if (!specs || specs.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <h3 className="text-2xl font-bold text-[#0A1628] mb-6">
        {isZh ? titleZh : titleEn}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {specs.map((spec, index) => {
              const key = isZh ? spec.keyZh : spec.keyEn
              const value = isZh ? spec.valueZh : spec.valueEn
              return (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-3 px-4 border border-gray-200 font-medium text-[#0A1628] w-1/3">
                    {key}
                  </td>
                  <td className="py-3 px-4 border border-gray-200 text-gray-600">
                    {value}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
