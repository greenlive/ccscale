'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, Play } from 'lucide-react';

interface ProductGalleryProps {
  mainImage: string;
  images: string[];
  name: string;
  videoUrl?: string;
  onVideoClick?: () => void;
}

export function ProductGallery({ mainImage, images, name, videoUrl, onVideoClick }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const allImages = [mainImage, ...images.filter(img => img !== mainImage)].filter(Boolean);
  const currentImage = allImages[selectedIndex] || mainImage;

  const goNext = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % allImages.length);
    setImageError(false);
    setIsZooming(false);
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex(prev => (prev - 1 + allImages.length) % allImages.length);
    setImageError(false);
    setIsZooming(false);
  }, [allImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'Escape') setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goNext, goPrev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleImageClick = () => {
    if (allImages.length > 1) {
      setIsFullscreen(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <div className="relative">
        <div
          ref={imageContainerRef}
          className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-crosshair"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={handleImageClick}
        >
          {currentImage && !imageError ? (
            <>
              {/* Base Image */}
              <Image
                src={currentImage}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-contain transition-transform duration-200 ${isZooming ? 'scale-150' : ''}`}
                style={isZooming ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                } : undefined}
                priority
                onError={() => setImageError(true)}
              />

              {/* Zoom Overlay - Shows zoomed portion */}
              {isZooming && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${currentImage})`,
                    backgroundSize: '400%',
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}

              {/* Zoom Indicator */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-md">
                <ZoomIn className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">
                  {isZooming ? 'Zoomed View' : 'Hover to Zoom'}
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-105 z-10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-105 z-10"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-primary/80 text-white text-sm px-3 py-1 rounded-full">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Video Button */}
          {videoUrl && onVideoClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onVideoClick(); }}
              className="absolute top-3 right-3 w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg z-10"
              aria-label="Play video"
            >
              <Play className="w-5 h-5 ml-0.5" />
            </button>
          )}
        </div>

        {/* Zoom Instructions */}
        {isZooming && (
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500">
              Move mouse to explore • Click for fullscreen
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedIndex(idx); setImageError(false); setIsZooming(false); }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${idx + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                onError={() => {}}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-50"
            aria-label="Close"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-white/20"
            onClick={() => setIsFullscreen(false)}
          >
            {selectedIndex + 1} / {allImages.length} • Click to close
          </div>

          <div
            className="relative w-full h-full flex items-center justify-center p-8 cursor-pointer"
            onClick={() => setIsFullscreen(false)}
          >
            {currentImage && !imageError && (
              <Image
                src={currentImage}
                alt={name}
                fill
                sizes="100vw"
                className="object-contain max-h-[90vh]"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Previous"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Next"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-3 bg-black/50 rounded-xl max-w-[90vw] overflow-x-auto">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); setImageError(false); }}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedIndex === idx ? 'border-white scale-110' : 'border-transparent hover:border-white/50'
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} ${idx + 1}`}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  onError={() => {}}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}