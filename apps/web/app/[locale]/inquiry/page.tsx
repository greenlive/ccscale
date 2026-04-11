import dynamic from 'next/dynamic'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@cc-scale/ui'

const InquiryPageContent = dynamic(
  () => import('@/components/InquiryPageContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1628]"></div>
      </div>
    )
  }
)

export default function InquiryPage() {
  return <InquiryPageContent />
}
