'use client';

import { useLocale } from 'next-intl';
import { Award } from 'lucide-react';

const CERTIFICATION_INFO: Record<string, { label: string; descEn: string; descZh: string }> = {
  'CE': { label: 'CE', descEn: 'European Conformity', descZh: '欧盟符合性认证' },
  'FCC': { label: 'FCC', descEn: 'Federal Communications Commission', descZh: '美国联邦通信委员会认证' },
  'RoHS': { label: 'RoHS', descEn: 'Restriction of Hazardous Substances', descZh: '有害物质限制指令' },
  'ISO9001': { label: 'ISO 9001', descEn: 'Quality Management System', descZh: '质量管理体系' },
  'ISO14001': { label: 'ISO 14001', descEn: 'Environmental Management System', descZh: '环境管理体系' },
  'UL': { label: 'UL', descEn: 'Underwriters Laboratories', descZh: '保险商实验室认证' },
  'ETL': { label: 'ETL', descEn: 'Electrical Testing Labs', descZh: '电气测试实验室认证' },
  'FDA': { label: 'FDA', descEn: 'Food and Drug Administration', descZh: '美国食品药品监督管理局认证' },
  'CCC': { label: 'CCC', descEn: 'China Compulsory Certificate', descZh: '中国强制性产品认证' },
  'CB': { label: 'CB', descEn: 'IECEE Certification', descZh: '国际电工委员会认证' },
  'EPR': { label: 'EPR', descEn: 'Extended Producer Responsibility', descZh: '生产者责任延伸' },
  'WEEE': { label: 'WEEE', descEn: 'Waste Electrical Equipment', descZh: '废旧电气设备指令' },
};

interface ProductCertificationsProps {
  certifications: string;
}

export function ProductCertifications({ certifications }: ProductCertificationsProps) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';

  let certList: string[] = [];
  try {
    certList = JSON.parse(certifications);
  } catch {
    return null;
  }

  if (!certList || certList.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-transparent border border-green-200 rounded-xl p-6">
      <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5" />
        {isZh ? '产品认证' : 'Certifications'}
      </h3>
      <div className="flex flex-wrap gap-3">
        {certList.map((cert) => {
          const info = CERTIFICATION_INFO[cert];
          return (
            <div
              key={cert}
              className="bg-white border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2"
              title={info ? (isZh ? info.descZh : info.descEn) : cert}
            >
              <Award className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-700">{info?.label || cert}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
