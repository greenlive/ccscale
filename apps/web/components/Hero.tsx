'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import TrustBadges from '@/components/TrustBadges';

export default function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative bg-gradient-to-br from-primary via-[#1e3a5f] to-primary text-primary-foreground py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Photo wash + soft orbs (reduced motion disables float) */}
      <div className="absolute inset-0 opacity-[0.12]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920')] bg-cover bg-center" />
      </div>
      <div
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/25 blur-3xl motion-safe:animate-pulse motion-reduce:animate-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl motion-safe:animate-pulse motion-reduce:animate-none [animation-delay:1s]"
        aria-hidden
      />

      <div className="container mx-auto px-4 relative z-10 max-w-[1400px]">
        <p className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm sm:text-sm">
          {t('trustRibbon')}
        </p>
        <div className="max-w-3xl rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-6 sm:mb-8 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button asChild size="lg" className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-black/20">
              <Link href="/products">
                {t('exploreProducts')}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 border-white/60 bg-transparent text-white hover:bg-white/15 hover:text-white"
            >
              <Link href="/contact">
                {t('getQuote')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <TrustBadges />
    </section>
  );
}
