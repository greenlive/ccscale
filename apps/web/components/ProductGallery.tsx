'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn, Play, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  mainImage?: string;
  mainImages?: string | string[];
  detailImages?: string | string[];
  videos?: string | string[];
  name: string;
  videoUrl?: string;
  onVideoClick?: () => void;
}

// Parse image sources from various input formats
function parseImageSources(props: ProductGalleryProps): string[] {
  const images: string[] = [];

  // Handle mainImages (new format)
  if (props.mainImages) {
    if (Array.isArray(props.mainImages)) {
      images.push(...props.mainImages);
    } else {
      try {
        const parsed = JSON.parse(props.mainImages);
        if (Array.isArray(parsed)) {
          images.push(...parsed);
        } else if (typeof parsed === 'string') {
          images.push(parsed);
        }
      } catch {
        // Not valid JSON, treat as single URL
        images.push(props.mainImages);
      }
    }
  }

  // Handle detailImages (new format)
  if (props.detailImages) {
    if (Array.isArray(props.detailImages)) {
      images.push(...props.detailImages);
    } else {
      try {
        const parsed = JSON.parse(props.detailImages);
        if (Array.isArray(parsed)) {
          images.push(...parsed);
        } else if (typeof parsed === 'string') {
          images.push(parsed);
        }
      } catch {
        images.push(props.detailImages);
      }
    }
  }

  // Fallback to mainImage (single image)
  if (images.length === 0 && props.mainImage) {
    images.push(props.mainImage);
  }

  return images;
}

// Parse video sources
function parseVideoSources(props: ProductGalleryProps): string[] {
  const videos: string[] = [];

  if (props.videos) {
    if (Array.isArray(props.videos)) {
      videos.push(...props.videos);
    } else {
      try {
        const parsed = JSON.parse(props.videos);
        if (Array.isArray(parsed)) {
          videos.push(...parsed);
        } else if (typeof parsed === 'string') {
          videos.push(parsed);
        }
      } catch {
        videos.push(props.videos);
      }
    }
  }

  // Fallback to videoUrl
  if (videos.length === 0 && props.videoUrl) {
    videos.push(props.videoUrl);
  }

  return videos;
}

export function ProductGallery(props: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const thumbnailListRef = useRef<HTMLDivElement>(null);
  const mainImageContainerRef = useRef<HTMLDivElement>(null);

  const images = parseImageSources(props);
  const videos = parseVideoSources(props);
  const hasVideo = videos.length > 0;
  const totalItems = images.length + (hasVideo ? 1 : 0);

  // Reset when props change
  useEffect(() => {
    setSelectedIndex(0);
    setIsVideoSelected(false);
    setImageError({});
  }, [props.mainImage, props.mainImages, props.detailImages, props.videos]);

  const scrollThumbnailIntoView = (index: number) => {
    if (!thumbnailListRef.current) return;
    const thumbnails = thumbnailListRef.current.querySelectorAll('.thumbnail-item');
    const target = thumbnails[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleThumbnailClick = (index: number) => {
    if (index < images.length) {
      setIsVideoSelected(false);
      setSelectedIndex(index);
      scrollThumbnailIntoView(index);
    } else {
      // Video thumbnail
      setIsVideoSelected(true);
      setSelectedIndex(index);
    }
  };

  const handlePrevNext = (direction: 'prev' | 'next') => {
    if (isVideoSelected) return;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = selectedIndex > 0 ? selectedIndex - 1 : totalItems - (hasVideo ? 2 : 1);
      if (newIndex >= images.length) newIndex = images.length - 1;
    } else {
      newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    }

    setIsVideoSelected(false);
    setSelectedIndex(newIndex);
    scrollThumbnailIntoView(newIndex);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageContainerRef.current) return;
    const rect = mainImageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const scrollThumbnails = (direction: 'up' | 'down') => {
    if (!thumbnailListRef.current) return;
    const scrollAmount = 88; // thumbnail height + gap
    thumbnailListRef.current.scrollBy({
      top: direction === 'up' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const canScrollUp = thumbnailListRef.current ? thumbnailListRef.current.scrollTop > 0 : false;
  const canScrollDown = thumbnailListRef.current
    ? thumbnailListRef.current.scrollTop < thumbnailListRef.current.scrollHeight - thumbnailListRef.current.clientHeight - 5
    : false;

  const currentImage = isVideoSelected ? null : images[selectedIndex];

  // Render thumbnail items
  const renderThumbnails = () => {
    const items: React.ReactNode[] = [];

    // Image thumbnails
    images.forEach((src, idx) => {
      items.push(
        <div
          key={`img-${idx}`}
          className={`thumbnail-item w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
            !isVideoSelected && selectedIndex === idx
              ? 'border-2 border-primary ring-2 ring-primary/20'
              : 'border-2 border-gray-200 hover:border-primary/50'
          }`}
          onClick={() => handleThumbnailClick(idx)}
        >
          <img
            src={src}
            alt={`${props.name} - ${idx + 1}`}
            className="w-full h-full object-cover"
            onError={() => setImageError((prev) => ({ ...prev, [idx]: true }))}
          />
        </div>
      );
    });

    // Video thumbnail
    if (hasVideo) {
      items.push(
        <div
          key="video-thumb"
          className={`thumbnail-item w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
            isVideoSelected
              ? 'border-2 border-primary ring-2 ring-primary/20'
              : 'border-2 border-gray-200 hover:border-primary/50'
          }`}
          onClick={() => handleThumbnailClick(images.length)}
        >
          {/* Video thumbnail with play overlay */}
          <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
            <video
              src={videos[0]}
              className="w-full h-full object-cover opacity-50"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Left: Vertical Thumbnails with Scroll Arrows */}
      <div className="relative flex flex-col items-center w-24 flex-shrink-0">
        {/* Up Arrow */}
        {canScrollUp && (
          <button
            onClick={() => scrollThumbnails('up')}
            className="absolute -top-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
            aria-label="Scroll up"
          >
            <ChevronUp className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Thumbnail List */}
        <div
          ref={thumbnailListRef}
          className="flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollbar-thin w-full py-1"
          style={{ scrollbarWidth: 'thin' }}
        >
          {renderThumbnails()}
        </div>

        {/* Down Arrow */}
        {canScrollDown && (
          <button
            onClick={() => scrollThumbnails('down')}
            className="absolute -bottom-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Right: Main Image Area with Zoom */}
      <div className="flex-1 relative flex gap-4">
        {/* Main Image Container */}
        <div
          ref={mainImageContainerRef}
          className="relative flex-1 aspect-square lg:aspect-auto lg:h-[500px] bg-gray-100 rounded-xl overflow-hidden cursor-crosshair group"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={() => !isVideoSelected && setShowFullscreen(true)}
        >
          {/* Image or Video */}
          {isVideoSelected ? (
            <video
              src={videos[0]}
              controls
              autoPlay
              className="w-full h-full object-contain"
              playsInline
            />
          ) : currentImage && !imageError[selectedIndex] ? (
            <img
              src={currentImage}
              alt={props.name}
              className="w-full h-full object-contain"
              onError={() => setImageError((prev) => ({ ...prev, [selectedIndex]: true }))}
            />
          ) : (
            /* Default placeholder when no main image */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg className="w-20 h-20 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-400 text-sm font-medium">No Main Image</span>
              {hasVideo && (
                <span className="text-gray-400 text-xs mt-1">Video available</span>
              )}
            </div>
          )}

          {/* Alibaba-style Zoom Effect - Image moves opposite to mouse */}
          {showZoom && !isVideoSelected && currentImage && (
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                cursor: 'crosshair',
              }}
            >
              <div
                className="absolute w-full h-full"
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '200%',
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </div>
          )}

          {/* Zoom Indicator */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-md">
            <ZoomIn className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">
              {showZoom ? 'Zoomed View' : 'Hover to Zoom'}
            </span>
          </div>

          {/* Previous/Next Arrows */}
          {!isVideoSelected && images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevNext('prev'); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevNext('next'); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {!isVideoSelected && images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-50"
            aria-label="Close"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          <Image
            src={currentImage}
            alt={props.name}
            fill
            sizes="100vw"
            className="object-contain max-h-[90vh]"
            onError={() => setShowFullscreen(false)}
          />

          {/* Fullscreen Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevNext('prev'); setShowFullscreen(false); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevNext('next'); setShowFullscreen(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}