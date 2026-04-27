'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface ProductFAQProps {
  faqEn?: string;
  faqZh?: string;
}

export function ProductFAQ({ faqEn, faqZh }: ProductFAQProps) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  let faqs: FAQItem[] = [];
  try {
    faqs = JSON.parse(isZh ? (faqZh || '[]') : (faqEn || '[]'));
  } catch {
    try {
      faqs = JSON.parse(faqEn || '[]');
    } catch {
      return null;
    }
  }

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-primary text-white px-6 py-4 font-semibold flex items-center gap-2">
        {isZh ? '常见问题' : 'Frequently Asked Questions'}
      </div>
      <div className="divide-y divide-gray-100">
        {faqs.map((faq, index) => (
          <div key={index} className="p-4">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between text-left gap-4"
            >
              <span className="font-medium text-primary">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="mt-3 text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
