'use client';

import { useLocale } from 'next-intl';
import { CreditCard, Ship, ShieldCheck } from 'lucide-react';

interface ProductTradeInfoProps {
  hsCode?: string;
  paymentTerms?: string;
  shippingTerms?: string;
  warrantyInfo?: string;
}

export function ProductTradeInfo({
  hsCode,
  paymentTerms,
  shippingTerms,
  warrantyInfo
}: ProductTradeInfoProps) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';

  const hasContent = hsCode || paymentTerms || shippingTerms || warrantyInfo;
  if (!hasContent) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-bold text-primary mb-4">
        {isZh ? '贸易信息' : 'Trade Information'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hsCode && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
              <span className="text-xs font-bold text-primary">HS</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {isZh ? '海关编码' : 'HS Code'}
              </div>
              <div className="font-medium text-gray-800">{hsCode}</div>
            </div>
          </div>
        )}
        {paymentTerms && (
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-primary mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {isZh ? '付款方式' : 'Payment Terms'}
              </div>
              <div className="font-medium text-gray-800">{paymentTerms}</div>
            </div>
          </div>
        )}
        {shippingTerms && (
          <div className="flex items-start gap-3">
            <Ship className="w-5 h-5 text-primary mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {isZh ? '贸易条款' : 'Shipping Terms'}
              </div>
              <div className="font-medium text-gray-800">{shippingTerms}</div>
            </div>
          </div>
        )}
        {warrantyInfo && (
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {isZh ? '保修期' : 'Warranty'}
              </div>
              <div className="font-medium text-gray-800">{warrantyInfo}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
