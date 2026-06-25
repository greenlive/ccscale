'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { EmblaCarouselType } from 'embla-carousel';

interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  className?: string;
}

export default function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  loop = false,
  className = '',
}: CarouselProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const slideCount = childrenArray.length;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: loop && slideCount > 1,
      skipSnaps: false,
      dragFree: false,
    },
    autoPlay && slideCount > 1 ? [Autoplay({ delay: autoPlayInterval, stopOnInteraction: false })] : [],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((embla: EmblaCarouselType) => {
    setSelectedIndex(embla.selectedScrollSnap());
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (slideCount === 0) return null;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => {
        // Only stop autoplay on devices with hover capability (desktop); mobile touch is unaffected
        if (window.matchMedia('(hover: hover)').matches) {
          emblaApi?.plugins()?.autoplay?.stop();
        }
      }}
      onMouseLeave={() => {
        if (window.matchMedia('(hover: hover)').matches) {
          emblaApi?.plugins()?.autoplay?.play();
        }
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] pl-6 first:pl-0"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && slideCount > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-whisper hover:bg-white hover:shadow-ring-warm transition-all hover:scale-110 z-10 text-charcoal-warm disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous slides"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-whisper hover:bg-white hover:shadow-ring-warm transition-all hover:scale-110 z-10 text-charcoal-warm disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next slides"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {showDots && scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'w-8 bg-terracotta'
                  : 'w-2.5 bg-warm-silver hover:bg-stone-gray'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
