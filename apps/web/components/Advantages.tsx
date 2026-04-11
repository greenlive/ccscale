'use client';

import { useTranslations } from 'next-intl';
import { Factory, PenTool, Truck, ShieldCheck, Heart } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';

const advantages = [
  { icon: Factory, titleKey: 'factoryStrength', descKey: 'factoryStrengthDesc' },
  { icon: PenTool, titleKey: 'expertDesign', descKey: 'expertDesignDesc' },
  { icon: Truck, titleKey: 'onTimeDelivery', descKey: 'onTimeDeliveryDesc' },
  { icon: ShieldCheck, titleKey: 'premiumQuality', descKey: 'premiumQualityDesc' },
  { icon: Heart, titleKey: 'excellentService', descKey: 'excellentServiceDesc' },
];

export default function Advantages() {
  const t = useTranslations('advantages');
  const tHome = useTranslations('home');

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#0A1628]">
          {tHome('whyChooseUs')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {advantages.map((adv, index) => {
            const Icon = adv.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300 border-none">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors mb-4">
                    <Icon className="h-8 w-8 text-[#0A1628]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-[#0A1628]">{t(adv.titleKey)}</h3>
                  <p className="text-gray-600 text-sm">{t(adv.descKey)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
