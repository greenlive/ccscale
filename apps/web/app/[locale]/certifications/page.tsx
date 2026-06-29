import { getTranslations } from 'next-intl/server'
import { useTranslations, useLocale } from 'next-intl'
import { CertificateCard } from '@/components/CertificateCard'
import { Shield, Award, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'
import type { Certificate } from '@/types/certificate'

/*
 * TODO: Replace with real data once a Certificate Prisma model + a
 * `GET /api/certificates` endpoint exist. Until then we keep the
 * placeholder list and surface a notice to visitors so we do not present
 * fabricated credentials as real ones (critical for B2B trust).
 */
const mockCertificates: Certificate[] = [
  {
    id: 1,
    nameEn: 'ISO 9001:2015 Quality Management',
    nameZh: 'ISO 9001:2015 质量管理体系认证',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
    pdfUrl: '/certificates/iso-9001.pdf',
    descriptionEn: 'Internationally recognized quality management standard',
    descriptionZh: '国际认可的质量管理标准',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    nameEn: 'CE Certification',
    nameZh: 'CE 认证',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
    pdfUrl: '/certificates/ce-certification.pdf',
    descriptionEn: 'European Conformity marking for EU market',
    descriptionZh: '欧盟市场的合格标志',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    nameEn: 'FDA Registration',
    nameZh: 'FDA 注册',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
    pdfUrl: '/certificates/fda-registration.pdf',
    descriptionEn: 'US Food and Drug Administration registration',
    descriptionZh: '美国食品药品监督管理局注册',
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    nameEn: 'ROHS Compliance',
    nameZh: 'ROHS 合规认证',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
    pdfUrl: '/certificates/rohs-compliance.pdf',
    descriptionEn: 'Restriction of Hazardous Substances directive',
    descriptionZh: '有害物质限制指令',
    order: 4,
    isActive: true,
  },
]

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'certifications' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

function CertificationsContent() {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-warm-silver" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {isZh ? '资质认证' : 'Certifications'}
          </h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {isZh
              ? '我们致力于提供符合国际标准的高品质产品'
              : 'We are committed to providing high-quality products that meet international standards'}
          </p>
        </div>
      </section>

      {/* Placeholder notice — replace with real data once Certificate model + endpoint exist */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 container mx-auto mt-6 rounded">
        <p className="text-sm text-yellow-800">
          {isZh
            ? '⚠️ 示例数据：以下认证为占位内容，待后端 Certificate 模块上线后展示真实资质证书。'
            : '⚠️ Placeholder data: The certificates below are sample content. Real credentials will be shown once the backend Certificate module ships.'}
        </p>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {isZh ? '国际认证' : 'International Certifications'}
              </h3>
              <p className="text-gray-600">
                {isZh
                  ? '所有产品均通过国际权威认证'
                  : 'All products are certified by international authorities'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {isZh ? '严格质检' : 'Strict Quality Control'}
              </h3>
              <p className="text-gray-600">
                {isZh
                  ? '每台产品出厂前经过多重检测'
                  : 'Every product undergoes multiple inspections before shipping'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {isZh ? '合规保障' : 'Compliance Guaranteed'}
              </h3>
              <p className="text-gray-600">
                {isZh
                  ? '符合目标市场的所有法规要求'
                  : 'Meet all regulatory requirements in target markets'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockCertificates
              .filter((c) => c.isActive)
              .sort((a, b) => a.order - b.order)
              .map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            {isZh ? '需要更多认证信息？' : 'Need More Certification Information?'}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {isZh
              ? '我们的团队可以提供完整的认证文件和测试报告'
              : 'Our team can provide complete certification documents and test reports'}
          </p>
        </div>
      </section>
    </div>
  )
}

export default function CertificationsPage() {
  return <CertificationsContent />
}
