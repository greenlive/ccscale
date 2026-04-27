'use client';

import { useLocale } from 'next-intl';
import { Factory, MapPin, Gauge } from 'lucide-react';

interface ProductFactoryShowcaseProps {
  manufacturerName?: string;
  factoryLocation?: string;
  productionCapacity?: string;
}

export function ProductFactoryShowcase({
  manufacturerName,
  factoryLocation,
  productionCapacity
}: ProductFactoryShowcaseProps) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';

  const hasContent = manufacturerName || factoryLocation || productionCapacity;
  if (!hasContent) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-transparent border border-blue-200 rounded-xl p-6">
      <h3 className="font-bold text-blue-700 mb-4 flex items-center gap-2">
        <Factory className="w-5 h-5" />
        {isZh ? '制造商信息' : 'Manufacturer Information'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {manufacturerName && (
          <div className="flex items-start gap-3">
            <Factory className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {isZh ? '制造商名称' : 'Manufacturer'}
              </div>
              <div className="font-medium text-gray-800">{manufacturerName}</div>
            </div>
          </div>
        )}
        {factoryLocation && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {isZh ? '工厂地址' : 'Location'}
              </div>
              <div className="font-medium text-gray-800">{factoryLocation}</div>
            </div>
          </div>
        )}
        {productionCapacity && (
          <div className="flex items-start gap-3">
            <Gauge className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {isZh ? '产能' : 'Production Capacity'}
              </div>
              <div className="font-medium text-gray-800">{productionCapacity}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
