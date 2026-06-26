import type { Metadata } from 'next'
import InquiryPageContent from '@/components/InquiryPageContent'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = params.locale === 'zh';
  return {
    title: isZh ? 'Inqury - CC Scale' : 'Submit Inquiry - CC Scale | Request a Quote',
    description: isZh
      ? 'Submit your product inquiry to CC Scale. Get a quote within 24 hours.'
      : 'Submit your product inquiry to CC Scale. Get a quote within 24 hours.',
    openGraph: {
      title: isZh ? 'Inqury - CC Scale' : 'Submit Inquiry - CC Scale',
      description: 'Request a B2B quote',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.zzscale.com/${params.locale}/inquiry`,
    },
    robots: { index: true, follow: true },
  };
}

export default function InquiryPage() {
  return <InquiryPageContent />
}
