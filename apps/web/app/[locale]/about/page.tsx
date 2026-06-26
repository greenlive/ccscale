import type { Metadata } from 'next';

import { AboutPageSchema, BreadcrumbSchema } from '@/components/SchemaOrg';
import AboutPageContent from './AboutPageContent';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '鍏充簬鎴戜滑 - CC Scale | 涓撲笟琛″櫒鍒堕€犲晢' : 'About Us - CC Scale | Professional Weighing Solutions Manufacturer',
    description: isZh
      ? '浜嗚ВCC Scale 20浣欏勾鍦ㄨ　鍣ㄨВ鍐虫柟妗堟柟闈㈢殑鍗撹秺缁忛獙銆侷SO璁よ瘉宸ュ巶锛屾湇鍔?00澶氫釜鍥藉銆?
      : 'Learn about CC Scale\'s 20+ years of excellence in weighing solutions. ISO certified factory with 100+ countries served.',
    openGraph: {
      title: isZh ? '鍏充簬鎴戜滑 - CC Scale | 涓撲笟琛″櫒鍒堕€犲晢' : 'About Us - CC Scale | Professional Weighing Solutions Manufacturer',
      description: isZh
        ? '浜嗚ВCC Scale 20浣欏勾鍦ㄨ　鍣ㄨВ鍐虫柟妗堟柟闈㈢殑鍗撹秺缁忛獙銆侷SO璁よ瘉宸ュ巶锛屾湇鍔?00澶氫釜鍥藉銆?
        : 'Learn about CC Scale\'s 20+ years of excellence in weighing solutions. ISO certified factory with 100+ countries served.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default function AboutPage({ params: { locale } }: Props) {
  const baseUrl = 'https://www.zzscale.com';
  const breadcrumbItems = [
    { name: locale === 'en' ? 'Home' : '棣栭〉', url: `${baseUrl}/${locale}` },
    { name: locale === 'en' ? 'About Us' : '鍏徃绠€浠?, url: `${baseUrl}/${locale}/about` },
  ];

  return (
    <>
      <AboutPageSchema locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <AboutPageContent locale={locale as 'en' | 'zh'} />
    </>
  );
}