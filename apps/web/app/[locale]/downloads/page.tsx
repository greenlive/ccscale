import { DownloadsPageContent } from './DownloadsPageContent'

export default function DownloadsPage({ params: { locale } }: { params: { locale: 'en' | 'zh' } }) {
  return <DownloadsPageContent locale={locale} />
}
