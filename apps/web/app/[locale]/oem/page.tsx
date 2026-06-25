import type { Metadata } from 'next'
import { OEMPageContent } from './OEMPageContent'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? 'OEM/ODM服务 - CC Scale | 定制衡器解决方案' : 'OEM/ODM Services - CC Scale | Custom Weighing Solutions',
    description: isZh
      ? '专业衡器OEM和ODM服务。为您的企业提供定制设计、品牌包装和个性化生产方案。'
      : 'Professional OEM and ODM services for weighing scales. Custom design, branding, packaging, and tailored production for your business.',
    openGraph: {
      title: isZh ? 'OEM/ODM服务 - CC Scale | 定制衡器解决方案' : 'OEM/ODM Services - CC Scale | Custom Weighing Solutions',
      description: isZh
        ? '专业衡器OEM和ODM服务。为您的企业提供定制设计、品牌包装和个性化生产方案。'
        : 'Professional OEM and ODM services for weighing scales. Custom design, branding, packaging, and tailored production for your business.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default function OemPage({ params: { locale } }: { params: { locale: 'en' | 'zh' } }) {
  return <OEMPageContent locale={locale} />
}
