'use client';

import { useTranslations } from 'next-intl';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getApiUrl } from '@/lib/config/api';

interface Testimonial {
  id: number;
  nameEn: string;
  nameZh: string;
  companyEn?: string;
  companyZh?: string;
  countryEn?: string;
  countryZh?: string;
  avatarUrl?: string;
  contentEn: string;
  contentZh: string;
  rating?: number;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function Testimonials({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const itemsPerPage = 3;
  const minSwipeDistance = 50;
  const maxSwipeTime = 500; // 最大滑动时间（毫秒），超过则不视为有意滑动

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(getApiUrl('testimonials?isActive=true'));
      if (response.ok) {
        const data = await response.json();
        // Sort by order field
        const sorted = data.sort((a: Testimonial, b: Testimonial) => a.order - b.order);
        setTestimonials(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const goToPrevious = useCallback(() => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  }, [totalPages]);

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  }, [totalPages]);

  const goToPage = (index: number) => {
    setCurrentPage(index);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0]?.clientX ?? null;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = e.targetTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;

    const distance = touchStartXRef.current - touchEndXRef.current;
    const timeDiff = Date.now() - touchStartTimeRef.current;

    // 检查滑动距离和时间，避免误触
    if (Math.abs(distance) < minSwipeDistance || timeDiff > maxSwipeTime) return;

    if (distance > 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  const getCurrentTestimonials = () => {
    const start = currentPage * itemsPerPage;
    return testimonials.slice(start, start + itemsPerPage);
  };

  // Auto-play carousel
  useEffect(() => {
    if (testimonials.length <= itemsPerPage || isPaused) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length, totalPages, isPaused]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="h-px w-12 bg-accent"></div>
            <h2 className="text-3xl font-bold text-center text-[#0A1628]">
              {t('whatClientsSay')}
            </h2>
            <div className="h-px w-12 bg-accent"></div>
          </div>
          {/* Skeleton Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonials = getCurrentTestimonials();

  // Get dynamic grid classes based on number of items
  const getGridClasses = () => {
    const count = currentTestimonials.length;
    if (count === 1) {
      return 'grid grid-cols-1 max-w-xl mx-auto';
    } else if (count === 2) {
      return 'grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-px w-12 bg-accent"></div>
          <h2 className="text-3xl font-bold text-center text-[#0A1628]">
            {t('whatClientsSay')}
          </h2>
          <div className="h-px w-12 bg-accent"></div>
        </div>

        <div
          className="relative max-w-6xl mx-auto touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          tabIndex={0}
          aria-label={locale === 'en' ? 'Testimonials carousel' : '客户评价轮播'}
        >
          {/* Testimonials Grid */}
          <div className={getGridClasses()}>
            {currentTestimonials.map((testimonial, index) => {
              const name = locale === 'en' ? testimonial.nameEn : testimonial.nameZh;
              const company = locale === 'en' ? testimonial.companyEn : testimonial.companyZh;
              const country = locale === 'en' ? testimonial.countryEn : testimonial.countryZh;
              const content = locale === 'en' ? testimonial.contentEn : testimonial.contentZh;

              return (
                <div
                  key={testimonial.id}
                  className="relative bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col h-full transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-3 -left-2">
                    <div className="bg-accent/10 rounded-full p-2">
                      <Quote className="h-5 w-5 text-accent" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= (testimonial.rating || 5)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-grow mb-6">
                    <p className="text-gray-600 leading-relaxed line-clamp-5">
                      &ldquo;{content}&rdquo;
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    {testimonial.avatarUrl ? (
                      <img
                        src={testimonial.avatarUrl}
                        alt={name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-accent/20"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center">
                        <span className="text-lg font-semibold text-accent">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0A1628] truncate">{name}</p>
                      {(company || country) && (
                        <p className="text-xs text-gray-500 truncate">
                          {company && `${company}`}
                          {company && country && ' · '}
                          {country && country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > itemsPerPage && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Dots Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? 'w-8 bg-accent'
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Testimonial Counter */}
        {testimonials.length > itemsPerPage && (
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              {locale === 'en'
                ? `Showing ${currentPage * itemsPerPage + 1}-${Math.min((currentPage + 1) * itemsPerPage, testimonials.length)} of ${testimonials.length} testimonials`
                : `显示 ${currentPage * itemsPerPage + 1}-${Math.min((currentPage + 1) * itemsPerPage, testimonials.length)} / ${testimonials.length} 条客户评价`}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
