'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Layers } from 'lucide-react';

interface ProductApplicationScenariosProps {
  scenariosEn: string;
  scenariosZh: string;
  mainImage?: string;
}

export function ProductApplicationScenarios({
  scenariosEn,
  scenariosZh,
  mainImage
}: ProductApplicationScenariosProps) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';
  const content = isZh ? scenariosZh : scenariosEn;

  if (!content) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-primary text-white px-6 py-4 font-semibold flex items-center gap-2">
        <Layers className="w-5 h-5" />
        {isZh ? '应用场景' : 'Application Scenarios'}
      </div>
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {mainImage && (
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={isZh ? '应用场景' : 'Application Scenarios'}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className={mainImage ? 'flex items-center' : 'col-span-2'}>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
