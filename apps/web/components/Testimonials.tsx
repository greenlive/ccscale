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
  const maxSwipeTime = 500;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(getApiUrl('testimonials?isActive=true'));
      if (response.ok) {
        const data = await response.json();
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

  useEffect(() => {
    if (testimonials.length <= itemsPerPage || isPaused) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length, totalPages, isPaused]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-warm-sand to-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="h-px w-12 bg-accent" />
            <h2 className="text-3xl font-bold text-center text-primary">
              {t('whatClientsSay')}
            </h2>
            <div className="h-px w-12 bg-accent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-whisper p-6 md:p-8 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 bg-gray-200 rounded-full" />
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
    <section className="py-16 bg-gradient-to-b from-warm-sand to-muted overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="h-px w-12 bg-accent" />
          <h2 className="text-3xl font-bold text-center text-primary">
            {t('whatClientsSay')}
          </h2>
          <div className="h-px w-12 bg-accent" />
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
          <div className={getGridClasses()}>
            {currentTestimonials.map((testimonial, index) => {
              const name = locale === 'en' ? testimonial.nameEn : testimonial.nameZh;
              const company = locale === 'en' ? testimonial.companyEn : testimonial.companyZh;
              const country = locale === 'en' ? testimonial.countryEn : testimonial.countryZh;
              const content = locale === 'en' ? testimonial.contentEn : testimonial.contentZh;

              return (
                <div
                  key={testimonial.id}
                  className="relative bg-white rounded-2xl shadow-whisper p-6 md:p-8 flex flex-col h-full transform transition-all duration-500 hover:shadow-ring-warm hover:-translate-y-2 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute -top-3 -left-2">
                    <div className="bg-accent/10 rounded-full p-2">
                      <Quote className="h-5 w-5 text-accent" />
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-dark-surface rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8 z-10">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <Quote className="h-8 w-8 mx-auto mb-4 text-accent" />
                      <p className="text-base leading-relaxed mb-4">
                        &ldquo;{content}&rdquo;
                      </p>
                      <p className="font-semibold">{name}</p>
                      <p className="text-sm text-gray-300">
                        {company && `${company}`}
                        {company && country && ' · '}
                        {country && country}
                      </p>
                      <div className="flex justify-center gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (testimonial.rating || 5)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-accent hover:text-white transition-colors"
                      >
                        {locale === 'en' ? 'Get Your Quote' : '获取报价'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="default-content transition-opacity duration-500 group-hover:opacity-0">
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

                    <div className="flex-grow mb-6">
                      <p className="text-gray-600 leading-relaxed line-clamp-5">
                        &ldquo;{content}&rdquo;
                      </p>
                    </div>

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
                        <p className="font-semibold text-primary truncate">{name}</p>
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
                </div>
              );
            })}
          </div>

          {testimonials.length > itemsPerPage && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 bg-white rounded-full p-3 shadow-whisper hover:bg-gray-50 transition-all hover:scale-110"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 bg-white rounded-full p-3 shadow-whisper hover:bg-gray-50 transition-all hover:scale-110"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}
        </div>

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