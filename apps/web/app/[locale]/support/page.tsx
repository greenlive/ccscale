import dynamic from 'next/dynamic'
import type { Metadata } from 'next'

const SupportPageContent = dynamic(
  () => import('./SupportPageContent').then((mod) => mod.SupportPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
)

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '技术支持 - CC Scale | 产品文档和帮助中心' : 'Technical Support - CC Scale | Product Documentation & Help',
    description: isZh
      ? '查找CC Scale产品的用户手册、技术文档、常见问题解答和支持资源。我们为您提供全面的售后服务。'
      : 'Find user manuals, technical documentation, FAQs, and support resources for CC Scale products. Comprehensive after-sales service.',
    openGraph: {
      title: isZh ? '技术支持 - CC Scale | 产品文档和帮助中心' : 'Technical Support - CC Scale | Product Documentation & Help',
      description: isZh
        ? '查找CC Scale产品的用户手册、技术文档、常见问题解答和支持资源。我们为您提供全面的售后服务。'
        : 'Find user manuals, technical documentation, FAQs, and support resources for CC Scale products. Comprehensive after-sales service.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default function SupportPage({ params: { locale } }: { params: { locale: 'en' | 'zh' } }) {
  return <SupportPageContent locale={locale} />
}
