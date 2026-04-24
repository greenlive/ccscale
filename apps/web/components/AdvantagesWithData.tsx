'use client';

import { useTranslations } from 'next-intl';
import { Factory, PenTool, Truck, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';

const advantages = [
  {
    icon: Factory,
    valueKey: 'factorySize',
    titleKey: 'factorySizeDesc',
  },
  {
    icon: PenTool,
    valueKey: 'equipment',
    titleKey: 'equipmentDesc',
  },
  {
    icon: ShieldCheck,
    valueKey: 'inspection',
    titleKey: 'inspectionDesc',
  },
  {
    icon: Truck,
    valueKey: 'capacity',
    titleKey: 'capacityDesc',
  },
];

export default function AdvantagesWithData() {
  const t = useTranslations('guarantee.advantages');
  const tHome = useTranslations('home');

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          {tHome('whyChooseUs')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {advantages.map((adv, index) => {
            const Icon = adv.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-none bg-white"
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center hover:bg-warm-sand transition-colors mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {t(adv.valueKey)}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {t(adv.titleKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
