'use client';

import { useLocale } from 'next-intl';
import { Package } from 'lucide-react';

interface ProductPackagingInfoProps {
  packagingInfoEn?: string;
  packagingInfoZh?: string;
}

export function ProductPackagingInfo({
  packagingInfoEn,
  packagingInfoZh
}: ProductPackagingInfoProps) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';
  const content = isZh ? packagingInfoZh : packagingInfoEn;

  if (!content) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-primary text-white px-6 py-4 font-semibold flex items-center gap-2">
        <Package className="w-5 h-5" />
        {isZh ? '包装信息' : 'Packaging Information'}
      </div>
      <div className="p-6">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}
