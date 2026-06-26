import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ProductCategories from '@/components/ProductCategories';
import TrustBadges from '@/components/TrustBadges';
import Advantages from '@/components/Advantages';
import { OrganizationSchema, WebSiteSchema } from '@/components/SchemaOrg';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zzscale.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const title = isZh
    ? '涓撲笟琛″櫒鍒堕€犲晢涓庡嚭鍙ｅ晢 - CC Scale | OEM/ODM 琛″櫒瀹氬埗'
    : 'Professional Weighing Scale Manufacturer & Exporter | CC Scale';
  const description = isZh
    ? 'CC Scale 姘稿悍涓撲笟琛″櫒鍒堕€犲晢,20+ 骞磋涓氱粡楠?鍑哄彛 100+ 鍥藉銆傛彁渚涗綋閲嶇Г銆佸悐绉ゃ€佸帹鎴跨Г銆佸┐鍎跨Г绛?OEM/ODM 瀹氬埗鏈嶅姟銆?
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
