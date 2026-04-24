'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';

const comparisonItems = [
  {
    categoryKey: 'paymentMethod',
    normalKey: 'paymentMethodNormal',
    ccScaleKey: 'paymentMethodCc',
  },
  {
    categoryKey: 'qualityAssurance2',
    normalKey: 'qualityAssuranceNormal',
    ccScaleKey: 'qualityAssuranceCc',
  },
  {
    categoryKey: 'deliveryPromise',
    normalKey: 'deliveryPromiseNormal',
    ccScaleKey: 'deliveryPromiseCc',
  },
];

export default function SupplierComparison() {
  const t = useTranslations('guarantee');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t('comparisonTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('comparisonSubtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden border-none shadow-whisper">
            <CardContent className="p-0">
              {/* Header */}
              <div className="grid grid-cols-3 bg-primary text-white">
                <div className="p-6 border-r border-white/20">
                  <span className="text-lg font-semibold opacity-80">
                    {t('comparisonTitle')}
                  </span>
                </div>
                <div className="p-6 border-r border-white/20 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="h-5 w-5 text-red-300" />
                    <span className="text-lg font-semibold">{t('normalSupplier')}</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-accent to-accent/80 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-200" />
                    <span className="text-lg font-bold">{t('ccScale')}</span>
                  </div>
                </div>
              </div>

              {/* Rows */}
              {comparisonItems.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="p-6 border-r border-gray-200">
                    <span className="font-semibold text-primary">
                      {t(item.categoryKey)}
                    </span>
                  </div>
                  <div className="p-6 border-r border-gray-200 text-gray-600">
                    {t(item.normalKey)}
                  </div>
                  <div className="p-6 bg-accent/5 text-primary font-medium">
                    {t(item.ccScaleKey)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
