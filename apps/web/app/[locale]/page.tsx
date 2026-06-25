import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ProductCategories from '@/components/ProductCategories';
import TrustBadges from '@/components/TrustBadges';
import Advantages from '@/components/Advantages';
import { OrganizationSchema, WebSiteSchema } from '@/components/SchemaOrg';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ccscale.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const title = isZh
    ? '专业衡器制造商与出口商 - CC Scale | OEM/ODM 衡器定制'
    : 'Professional Weighing Scale Manufacturer & Exporter | CC Scale';
  const description = isZh
    ? 'CC Scale 永康专业衡器制造商,20+ 年行业经验,出口 100+ 国家。提供体重秤、吊秤、厨房秤、婴儿秤等 OEM/ODM 定制服务。'
    : 'CC Scale is a professional weighing scale manufacturer with 20+ years of experience, exporting to 100+ countries. OEM/ODM services for body scales, hanging scales, kitchen scales, baby scales, and more.';
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        'en-US': `${SITE_URL}/en`,
        'zh-CN': `${SITE_URL}/zh`,
        'x-default': `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: 'CC Scale',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630, alt: 'CC Scale' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.svg`],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <Hero locale={locale} />
      <TrustBadges locale={locale} />
      <Advantages locale={locale} />
      <ProductCategories locale={locale} />
    </>
  );
}
