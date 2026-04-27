'use client';

import { useLocale } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

interface ProductBulletPointsProps {
  pointsEn: string;
  pointsZh: string;
}

export function ProductBulletPoints({ pointsEn, pointsZh }: ProductBulletPointsProps) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';

  let points: string[] = [];
  try {
    points = JSON.parse(isZh ? pointsZh : pointsEn);
  } catch {
    try {
      points = JSON.parse(pointsEn);
    } catch {
      return null;
    }
  }

  if (!points || points.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary/5 to-transparent border border-gray-200 rounded-xl p-6">
      <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        {isZh ? '核心卖点' : 'Key Features'}
      </h3>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
