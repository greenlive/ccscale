import dynamic from 'next/dynamic'

const DownloadsPageContent = dynamic(
  () => import('./DownloadsPageContent').then((mod) => mod.DownloadsPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
)

export default function DownloadsPage({ params: { locale } }: { params: { locale: 'en' | 'zh' } }) {
  return <DownloadsPageContent locale={locale} />
}
