'use client'

import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Button } from '@cc-scale/ui'

interface DownloadItem {
  id: string
  titleEn: string
  titleZh: string
  fileUrl: string
  fileType: 'PDF' | 'XLS' | 'DOC'
  fileSize?: string
}

interface ProductDownloadsProps {
  downloads: DownloadItem[]
  titleEn?: string
  titleZh?: string
}

export function ProductDownloads({
  downloads,
  titleEn = 'Downloads',
  titleZh = '资料下载',
}: ProductDownloadsProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  if (!downloads || downloads.length === 0) {
    return null
  }

  const title = isZh ? titleZh : titleEn

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return <FileText className="h-6 w-6 text-red-500" />
      case 'XLS':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <section className="py-8">
      <h3 className="text-2xl font-bold text-[#0A1628] mb-6">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {downloads.map((download) => {
          const downloadTitle = isZh ? download.titleZh : download.titleEn
          return (
            <div
              key={download.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                {getFileIcon(download.fileType)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#0A1628] truncate">
                  {downloadTitle}
                </h4>
                {download.fileSize && (
                  <p className="text-sm text-gray-500">
                    {download.fileType} • {download.fileSize}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={download.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  {isZh ? '下载' : 'Download'}
                </a>
              </Button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
