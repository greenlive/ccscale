import { getTranslations } from 'next-intl/server';
import { Clock, Award, Globe, Building2 } from 'lucide-react';

const badges = [
  { icon: Building2, valueKey: 'yearsExperience', labelKey: 'yearsExperienceLabel' },
  { icon: Globe, valueKey: 'countries', labelKey: 'countriesLabel' },
  { icon: Award, valueKey: 'certs', labelKey: 'certsLabel' },
  { icon: Clock, valueKey: 'response', labelKey: 'responseLabel' },
];

export default async function TrustBadges({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'guarantee.trustBadges' });

  return (
    <div className="py-8 border-t border-white/20">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="text-center rounded-xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-sm motion-safe:transition motion-safe:hover:bg-white/10"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                  <Icon className="h-6 w-6 text-warm-silver shrink-0" aria-hidden />
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tabular-nums">
                    {t(badge.valueKey)}
                  </span>
                </div>
                <p className="text-warm-silver/95 text-xs sm:text-sm leading-snug px-1">
                  {t(badge.labelKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
