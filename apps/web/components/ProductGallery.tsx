'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, ZoomIn, Play } from 'lucide-react';

interface ProductGalleryProps {
  mainImage: string;
  name: string;
  videoUrl?: string;
  onVideoClick?: () => void;
}

export function ProductGallery({ mainImage, name, videoUrl, onVideoClick }: ProductGalleryProps) {
  const [imageError, setImageError] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const currentImage = mainImage;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left: Vertical Scrollable Thumbnails - Main Image + Video Only */}
      <div className="hidden lg:flex flex-col gap-2 w-20 flex-shrink-0 overflow-y-auto max-h-[500px] scrollbar-thin">
        {/* Main Image Thumbnail */}
        <div
          className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary ring-2 ring-primary/20"
        >
          <Image
            src={mainImage}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            onError={() => {}}
          />
        </div>
        {/* Video Thumbnail */}
        {videoUrl && onVideoClick && (
          <button
            onClick={onVideoClick}
            className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-all flex items-center justify-center bg-gray-100 flex-shrink-0"
          >
            <div className="flex flex-col items-center">
              <Play className="w-6 h-6 text-primary" />
              <span className="text-xs text-gray-500">Video</span>
            </div>
          </button>
        )}
      </div>

      {/* Right: Main Image with Arrows Navigation */}
      <div className="flex-1 relative">
        <div
          ref={imageContainerRef}
          className="relative aspect-square lg:aspect-auto lg:h-[500px] bg-gray-100 rounded-xl overflow-hidden cursor-crosshair group"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={handleImageClick}
        >
          {currentImage && !imageError ? (
            <>
              <Image
                src={currentImage}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className={`object-contain transition-transform duration-200 ${isZooming ? 'scale-150' : ''}`}
                style={isZooming ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                } : undefined}
                priority
                onError={() => setImageError(true)}
              />

              {/* Zoom Overlay */}
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
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          {/* Zoom Indicator */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-md">
            <ZoomIn className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">
              {isZooming ? 'Zoomed View' : 'Hover to Zoom'}
            </span>
          </div>

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

        {/* Mobile: Main Image + Video Button Below */}
        <div className="flex gap-2 overflow-x-auto pb-2 mt-4 lg:hidden">
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-primary">
            <Image
              src={mainImage}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              onError={() => {}}
            />
          </div>
          {videoUrl && onVideoClick && (
            <button
              onClick={onVideoClick}
              className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-all flex items-center justify-center bg-gray-100"
            >
              <Play className="w-5 h-5 text-primary" />
            </button>
          )}
        </div>
      </div>

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
            Click to close
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
        </div>
      )}
    </div>
  );
}
