import type { Metadata } from 'next';

import GuaranteePageContent from './GuaranteePageContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '我们的保障 - CC Scale | B2B买家的质量保证' : 'Our Guarantee - CC Scale | Quality Assurance for B2B Buyers',
    description: isZh
      ? 'CC Scale的全面保障涵盖资金安全、质量保证、交付可靠和沟通效率，让您放心采购。'
      : 'CC Scale\'s comprehensive guarantee covers fund security, quality assurance, delivery reliability, and communication efficiency for worry-free procurement.',
    openGraph: {
      title: isZh ? '我们的保障 - CC Scale | B2B买家的质量保证' : 'Our Guarantee - CC Scale | Quality Assurance for B2B Buyers',
      description: isZh
        ? 'CC Scale的全面保障涵盖资金安全、质量保证、交付可靠和沟通效率，让您放心采购。'
        : 'CC Scale\'s comprehensive guarantee covers fund security, quality assurance, delivery reliability, and communication efficiency for worry-free procurement.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default function GuaranteePage() {
  return <GuaranteePageContent />;
}