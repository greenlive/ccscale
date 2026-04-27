'use client';

import { cn } from '@cc-scale/ui';

const AVAILABLE_CERTIFICATIONS = [
  { code: 'CE', label: 'CE', desc: 'European Conformity' },
  { code: 'FCC', label: 'FCC', desc: 'Federal Communications Commission' },
  { code: 'RoHS', label: 'RoHS', desc: 'Restriction of Hazardous Substances' },
  { code: 'ISO9001', label: 'ISO 9001', desc: 'Quality Management System' },
  { code: 'ISO14001', label: 'ISO 14001', desc: 'Environmental Management' },
  { code: 'UL', label: 'UL', desc: 'Underwriters Laboratories' },
  { code: 'ETL', label: 'ETL', desc: 'Electrical Testing Labs' },
  { code: 'FDA', label: 'FDA', desc: 'Food and Drug Administration' },
  { code: 'CCC', label: 'CCC', desc: 'China Compulsory Certificate' },
  { code: 'CB', label: 'CB', desc: 'IECEE Certification' },
  { code: 'EPR', label: 'EPR', desc: 'Extended Producer Responsibility' },
  { code: 'WEEE', label: 'WEEE', desc: 'Waste Electrical Equipment' },
];

interface ProductCertificationsProps {
  certifications: string[];
  onChange: (certifications: string[]) => void;
}

export function ProductCertifications({ certifications, onChange }: ProductCertificationsProps) {
  const toggleCertification = (code: string) => {
    if (certifications.includes(code)) {
      onChange(certifications.filter(c => c !== code));
    } else {
      onChange([...certifications, code]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Certifications
        </label>
        <span className="text-xs text-gray-500">{certifications.length} selected</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {AVAILABLE_CERTIFICATIONS.map((cert) => (
          <button
            key={cert.code}
            type="button"
            onClick={() => toggleCertification(cert.code)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-full border transition-colors',
              certifications.includes(cert.code)
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
            )}
            title={cert.desc}
          >
            {cert.label}
          </button>
        ))}
      </div>

      {certifications.length > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500">
          Selected: {certifications.join(', ')}
        </div>
      )}
    </div>
  );
}
