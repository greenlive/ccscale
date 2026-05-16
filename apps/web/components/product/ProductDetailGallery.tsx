'use client'

import { useLocale } from 'next-intl'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from '@/i18n/routing'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface DetailImage {
  id?: number
  imageUrl: string
  altEn?: string
  altZh?: string
  order?: number
}

interface ProductDetailGalleryProps {
  images: DetailImage[]
  titleEn?: string
  titleZh?: string
}

export function ProductDetailGallery({
  images,
  titleEn = 'Product Details',
  titleZh = '产品详情',
}: ProductDetailGalleryProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const goToPrevious = () => {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1)
  }

  const goToNext = () => {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  const currentImage = lightboxIndex !== null ? images[lightboxIndex] : null
  const currentAlt = currentImage
    ? (isZh ? (currentImage.altZh || currentImage.altEn || '') : (currentImage.altEn || currentImage.altZh || ''))
    : ''

  return (
    <>
      <section className="py-8">
        <h3 className="text-2xl font-bold text-primary mb-6">
          {isZh ? titleZh : titleEn}
        </h3>

        {/* Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => {
            const alt = isZh ? (image.altZh || image.altEn || '') : (image.altEn || image.altZh || '')
            return (
              <button
                key={image.id || index}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={alt || `View detail image ${index + 1}`}
              >
                <Image
                  src={image.imageUrl}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white hover:text-gray-300 focus:outline-none hidden md:block"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:text-gray-300 focus:outline-none hidden md:block"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <Image
                src={images[lightboxIndex].imageUrl}
                alt={currentAlt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Image Caption */}
            {currentAlt && (
              <p className="text-white text-center mt-4 text-sm">{currentAlt}</p>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((image, index) => {
                  const alt = isZh ? (image.altZh || image.altEn || '') : (image.altEn || image.altZh || '')
                  return (
                    <button
                      key={image.id || index}
                      onClick={() => setLightboxIndex(index)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden transition-opacity ${
                        index === lightboxIndex ? 'opacity-100 ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                      }`}
                      aria-label={`Go to image ${index + 1}: ${alt}`}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={alt}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Image Counter */}
            <p className="text-gray-400 text-center mt-2 text-xs">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
