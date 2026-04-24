'use client'

import { Play } from 'lucide-react'
import { useLocale } from 'next-intl'

interface ProductVideoProps {
  videoUrl: string
  titleEn?: string
  titleZh?: string
}

export function ProductVideo({
  videoUrl,
  titleEn = 'Product Video',
  titleZh = '产品视频',
}: ProductVideoProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  if (!videoUrl) {
    return null
  }

  let youtubeId = null
  const youtubeMatch = videoUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/
  )
  if (youtubeMatch) {
    youtubeId = youtubeMatch[1]
  }

  let youkuId = null
  const youkuMatch = videoUrl.match(/v\.youku\.com\/v_show\/id_([^\/\.]+)/)
  if (youkuMatch) {
    youkuId = youkuMatch[1]
  }

  const title = isZh ? titleZh : titleEn

  return (
    <section className="py-8">
      <h3 className="text-2xl font-bold text-primary mb-6">
        {title}
      </h3>
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : youkuId ? (
          <iframe
            src={`https://player.youku.com/embed/${youkuId}`}
            title={title}
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <video
            src={videoUrl}
            controls
            className="w-full h-full"
            poster="/video-poster.jpg"
          >
            {title}
          </video>
        )}
      </div>
    </section>
  )
}
