import type { Metadata } from 'next';

import { ContactPageSchema, BreadcrumbSchema, DefaultFAQSchema } from '@/components/SchemaOrg';
import ContactPageContent from './ContactPageContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '鑱旂郴鎴戜滑 - CC Scale | 鑾峰彇鎶ヤ环鍜屾妧鏈敮鎸? : 'Contact Us - CC Scale | Get a Quote or Technical Support',
    description: isZh
      ? '涓嶤C Scale鑱旂郴浠ヨ幏鍙栬鐩樸€佹姤浠锋垨鎶€鏈敮鎸併€傛垜浠殑涓撲笟鍥㈤槦灏嗗湪24灏忔椂鍐呬负鎮ㄥ洖澶嶃€?
      : 'Get in touch with CC Scale for inquiries, quotes, or technical support. Our professional team responds within 24 hours.',
    openGraph: {
      title: isZh ? '鑱旂郴鎴戜滑 - CC Scale | 鑾峰彇鎶ヤ环鍜屾妧鏈敮鎸? : 'Contact Us - CC Scale | Get a Quote or Technical Support',
      description: isZh
        ? '涓嶤C Scale鑱旂郴浠ヨ幏鍙栬鐩樸€佹姤浠锋垨鎶€鏈敮鎸併€傛垜浠殑涓撲笟鍥㈤槦灏嗗湪24灏忔椂鍐呬负鎮ㄥ洖澶嶃€?
        : 'Get in touch with CC Scale for inquiries, quotes, or technical support. Our professional team responds within 24 hours.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const baseUrl = 'https://www.zzscale.com';
  const breadcrumbItems = [
    { name: locale === 'en' ? 'Home' : '棣栭〉', url: `${baseUrl}/${locale}` },
    { name: locale === 'en' ? 'Contact' : '鑱旂郴鎴戜滑', url: `${baseUrl}/${locale}/contact` },
  ];

  return (
    <>
      <ContactPageSchema locale={locale} />
      <DefaultFAQSchema locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ContactPageContent />
    </>
  );
}