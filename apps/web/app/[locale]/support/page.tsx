import dynamic from 'next/dynamic'

const SupportPageContent = dynamic(
  () => import('./SupportPageContent').then((mod) => mod.SupportPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
)

export default function SupportPage({ params: { locale } }: { params: { locale: 'en' | 'zh' } }) {
  return <SupportPageContent locale={locale} />
}
