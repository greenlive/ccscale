'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductDetailImagesProps {
  images: string[]  // detailImages URLs (JSON parsed array)
  productName?: string
}

export function ProductDetailImages({
  images,
  productName = 'Product',
}: ProductDetailImagesProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Close lightbox on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return
    if (e.key === 'Escape') setLightboxIndex(null)
    if (e.key === 'ArrowLeft') {
      setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1)
    }
    if (e.key === 'ArrowRight') {
      setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1)
    }
  }, [lightboxIndex, images.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex])

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

  return (
    <>
      {/* Vertical Stack Layout */}
      <div className="w-full space-y-2">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative w-full bg-gray-100 cursor-pointer overflow-hidden min-h-[200px] max-h-[800px]"
            onClick={() => openLightbox(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openLightbox(index)
              }
            }}
            aria-label={`View ${productName} detail image ${index + 1}`}
          >
            <Image
              src={imageUrl}
              alt={`${productName} detail image ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain hover:opacity-95 transition-opacity"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-2"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-2"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-2"
                aria-label="Next image"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div
            className="relative w-full h-full max-w-[95vw] max-h-[95vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={images[lightboxIndex]}
                alt={`${productName} detail image ${lightboxIndex + 1}`}
                fill
                sizes="95vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}