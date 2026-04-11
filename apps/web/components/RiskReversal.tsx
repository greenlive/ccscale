'use client';

import { useTranslations } from 'next-intl';
import { RefreshCw, Shield, Clock, Package } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';

const guarantees = [
  { icon: RefreshCw, titleKey: 'freeSample', descKey: 'freeSampleDesc' },
  { icon: Shield, titleKey: 'qualityGuarantee', descKey: 'qualityGuaranteeDesc' },
  { icon: Clock, titleKey: 'deliveryGuarantee', descKey: 'deliveryGuaranteeDesc' },
  { icon: Package, titleKey: 'warranty', descKey: 'warrantyDesc' },
];

export default function RiskReversal() {
  const t = useTranslations('guarantee.riskReversal');

  return (
    <section className="py-16 bg-gradient-to-br from-accent/5 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-none bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-[#0A1628] mb-3">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-gray-600">
                    {t(item.descKey)}
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
