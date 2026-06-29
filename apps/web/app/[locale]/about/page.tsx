import type { Metadata } from 'next';

import { AboutPageSchema, BreadcrumbSchema } from '@/components/SchemaOrg';
import AboutPageContent from './AboutPageContent';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '关于我们 - CC Scale | 专业衡器制造商' : 'About Us - CC Scale | Professional Weighing Solutions Manufacturer',
    description: isZh
      ? '了解CC Scale 20多年在衡器解决方案方面的卓越经验。ISO认证工厂，服务100多个国家。'
      : 'Learn about CC Scale\'s 20+ years of excellence in weighing solutions. ISO certified factory with 100+ countries served.',
    openGraph: {
      title: isZh ? '关于我们 - CC Scale | 专业衡器制造商' : 'About Us - CC Scale | Professional Weighing Solutions Manufacturer',
      description: isZh
        ? '了解CC Scale 20多年在衡器解决方案方面的卓越经验。ISO认证工厂，服务100多个国家。'
        : 'Learn about CC Scale\'s 20+ years of excellence in weighing solutions. ISO certified factory with 100+ countries served.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default function AboutPage({ params: { locale } }: Props) {
  const baseUrl = 'https://www.zzscale.com';
  const breadcrumbItems = [
    { name: locale === 'en' ? 'Home' : '首页', url: `${baseUrl}/${locale}` },
    { name: locale === 'en' ? 'About Us' : '公司简介', url: `${baseUrl}/${locale}/about` },
  ];

  return (
    <>
      <AboutPageSchema locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <AboutPageContent locale={locale as 'en' | 'zh'} />
    </>
  );
}
