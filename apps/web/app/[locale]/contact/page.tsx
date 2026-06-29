import type { Metadata } from 'next';

import { ContactPageSchema, BreadcrumbSchema, DefaultFAQSchema } from '@/components/SchemaOrg';
import ContactPageContent from './ContactPageContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '联系我们 - CC Scale | 获取报价和技术支持' : 'Contact Us - CC Scale | Get a Quote or Technical Support',
    description: isZh
      ? '与CC Scale联系以获取询盘、报价或技术支持。我们的专业团队将在24小时内为您回复。'
      : 'Get in touch with CC Scale for inquiries, quotes, or technical support. Our professional team responds within 24 hours.',
    openGraph: {
      title: isZh ? '联系我们 - CC Scale | 获取报价和技术支持' : 'Contact Us - CC Scale | Get a Quote or Technical Support',
      description: isZh
        ? '与CC Scale联系以获取询盘、报价或技术支持。我们的专业团队将在24小时内为您回复。'
        : 'Get in touch with CC Scale for inquiries, quotes, or technical support. Our professional team responds within 24 hours.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const baseUrl = 'https://www.zzscale.com';
  const breadcrumbItems = [
    { name: locale === 'en' ? 'Home' : '首页', url: `${baseUrl}/${locale}` },
    { name: locale === 'en' ? 'Contact' : '联系我们', url: `${baseUrl}/${locale}/contact` },
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
