'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Download, ZoomIn, X } from 'lucide-react'
import { Card, CardContent } from '@cc-scale/ui'
import { Button } from '@cc-scale/ui'
import Image from 'next/image'
import type { Certificate } from '@/types/certificate'

interface CertificateCardProps {
  certificate: Certificate
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'
  const [showModal, setShowModal] = useState(false)

  const name = isZh ? certificate.nameZh : certificate.nameEn
  const description = isZh ? certificate.descriptionZh : certificate.descriptionEn

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-none">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={certificate.imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="outline"
              className="bg-white text-primary border-white"
              onClick={() => setShowModal(true)}
            >
              <ZoomIn className="h-4 w-4 mr-2" />
              {isZh ? '查看大图' : 'View'}
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-primary mb-2">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mb-4">
              {description}
            </p>
          )}
          {certificate.pdfUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                {isZh ? '下载PDF' : 'Download PDF'}
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
              onClick={() => setShowModal(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative aspect-[4/3] bg-white rounded-lg overflow-hidden">
              <Image
                src={certificate.imageUrl}
                alt={name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
