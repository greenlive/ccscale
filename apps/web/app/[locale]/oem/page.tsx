import dynamic from 'next/dynamic'

const OEMPageContent = dynamic(
  () => import('./OEMPageContent').then((mod) => mod.OEMPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
)

export default function OemPage({ params: { locale } }: { params: { locale: 'en' | 'zh' } }) {
  return <OEMPageContent locale={locale} />
}
