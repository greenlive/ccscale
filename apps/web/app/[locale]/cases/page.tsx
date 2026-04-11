import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { ClientShowcase } from '@/components/ClientShowcase'
import { Card, CardContent } from '@cc-scale/ui'
import { Users, Building2, Globe, Calendar } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { ClientCase, ShipmentPhoto } from '@/types/case'

const mockClientCases: ClientCase[] = [
  {
    id: 1,
    nameEn: 'Global Imports Inc.',
    nameZh: '全球进口公司',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    countryEn: 'USA',
    countryZh: '美国',
    industryEn: 'Retail',
    industryZh: '零售',
    descriptionEn: 'Long-term partner since 2018, importing body scales for US market.',
    descriptionZh: '自2018年起的长期合作伙伴，为美国市场进口体重秤。',
    year: 2018,
    isActive: true,
    order: 1,
  },
  {
    id: 2,
    nameEn: 'EuroTrade GmbH',
    nameZh: '欧洲贸易有限公司',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    countryEn: 'Germany',
    countryZh: '德国',
    industryEn: 'Distribution',
    industryZh: '分销',
    descriptionEn: 'Leading distributor of weighing equipment in Europe.',
    descriptionZh: '欧洲领先的衡器设备分销商。',
    year: 2019,
    isActive: true,
    order: 2,
  },
]

const mockShipmentPhotos: ShipmentPhoto[] = [
  {
    id: 1,
    titleEn: 'Container Loading',
    titleZh: '集装箱装货',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    isActive: true,
  },
  {
    id: 2,
    titleEn: 'Factory Inspection',
    titleZh: '工厂检验',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    isActive: true,
  },
]

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'cases' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

function CasesContent() {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0A1628] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Building2 className="h-16 w-16 mx-auto mb-6 text-blue-300" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {isZh ? '客户案例' : 'Case Studies'}
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            {isZh
              ? '全球客户的信赖之选，共同成长的合作伙伴'
              : 'Trusted by global clients, partners for mutual growth'}
          </p>
        </div>
      </section>

      <ClientShowcase cases={mockClientCases} />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-[#0A1628] mb-2">
                500+
              </h3>
              <p className="text-gray-600">
                {isZh ? '全球客户' : 'Global Clients'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-[#0A1628] mb-2">
                80+
              </h3>
              <p className="text-gray-600">
                {isZh ? '国家和地区' : 'Countries & Regions'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-[#0A1628] mb-2">
                15+
              </h3>
              <p className="text-gray-600">
                {isZh ? '年行业经验' : 'Years Experience'}
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#0A1628] text-center mb-12">
            {isZh ? '出货展示' : 'Shipment Gallery'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockShipmentPhotos
              .filter(p => p.isActive)
              .map((photo) => {
                const title = isZh ? photo.titleZh : photo.titleEn
                return (
                  <Card key={photo.id} className="overflow-hidden border-none group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={photo.imageUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#0A1628]">{title}</h3>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A1628] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {isZh ? '成为我们的合作伙伴' : 'Become Our Partner'}
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            {isZh
              ? '加入我们的全球合作伙伴网络，共同开拓市场'
              : 'Join our global partner network and explore markets together'}
          </p>
        </div>
      </section>
    </div>
  )
}

export default function CasesPage() {
  return <CasesContent />
}
