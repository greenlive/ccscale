'use client';

import { Input } from '@cc-scale/ui';

interface ProductTradeInfoProps {
  formData: {
    hsCode: string;
    paymentTerms: string;
    shippingTerms: string;
    warrantyInfo: string;
    fobPort: string;
    leadTime: string;
  };
  onChange: (data: ProductTradeInfoProps['formData']) => void;
}

const COMMON_PAYMENT_TERMS = ['T/T 30% Deposit', 'L/C at sight', 'PayPal', 'Western Union', 'T/T + L/C'];
const COMMON_SHIPPING_TERMS = ['FOB', 'CIF', 'EXW', 'DDP', 'CFR'];
const COMMON_WARRANTY = ['1 Year', '2 Years', 'Limited Lifetime'];
const COMMON_FOB_PORTS = [
  'Shanghai',
  'Ningbo',
  'Shenzhen',
  'Guangzhou',
  'Qingdao',
  'Tianjin',
  'Dalian',
  'Xiamen',
  'Hong Kong',
  'Other',
];
const COMMON_LEAD_TIMES = [
  '3-5 days',
  '7-10 days',
  '15-20 days',
  '20-30 days',
  '30-45 days',
  '45-60 days',
];

export function ProductTradeInfo({ formData, onChange }: ProductTradeInfoProps) {
  const handleChange = (field: keyof ProductTradeInfoProps['formData'], value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-warm mb-2">
            HS Code (海关编码)
          </label>
          <Input
            value={formData.hsCode}
            onChange={(e) => handleChange('hsCode', e.target.value)}
            placeholder="e.g. 8423.95.00.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal-warm mb-2">
            FOB Port (离港港口)
          </label>
          <select
            value={formData.fobPort || ''}
            onChange={(e) => handleChange('fobPort', e.target.value)}
            className="h-10 w-full px-3 border border-border-warm rounded-md text-sm bg-white focus:border-olive-gray focus:ring-1 focus:ring-olive-gray"
          >
            <option value="">Select FOB port</option>
            {COMMON_FOB_PORTS.map(port => (
              <option key={port} value={port}>{port}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-warm mb-2">
            Payment Terms (付款条款)
          </label>
          <select
            value={formData.paymentTerms}
            onChange={(e) => handleChange('paymentTerms', e.target.value)}
            className="h-10 w-full px-3 border border-border-warm rounded-md text-sm bg-white focus:border-olive-gray focus:ring-1 focus:ring-olive-gray"
          >
            <option value="">Select payment terms</option>
            {COMMON_PAYMENT_TERMS.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal-warm mb-2">
            Shipping Terms (贸易条款)
          </label>
          <select
            value={formData.shippingTerms}
            onChange={(e) => handleChange('shippingTerms', e.target.value)}
            className="h-10 w-full px-3 border border-border-warm rounded-md text-sm bg-white focus:border-olive-gray focus:ring-1 focus:ring-olive-gray"
          >
            <option value="">Select shipping terms</option>
            {COMMON_SHIPPING_TERMS.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-warm mb-2">
            Warranty (保修期)
          </label>
          <select
            value={formData.warrantyInfo}
            onChange={(e) => handleChange('warrantyInfo', e.target.value)}
            className="h-10 w-full px-3 border border-border-warm rounded-md text-sm bg-white focus:border-olive-gray focus:ring-1 focus:ring-olive-gray"
          >
            <option value="">Select warranty</option>
            {COMMON_WARRANTY.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal-warm mb-2">
            Lead Time (交期)
          </label>
          <select
            value={formData.leadTime || ''}
            onChange={(e) => handleChange('leadTime', e.target.value)}
            className="h-10 w-full px-3 border border-border-warm rounded-md text-sm bg-white focus:border-olive-gray focus:ring-1 focus:ring-olive-gray"
          >
            <option value="">Select lead time</option>
            {COMMON_LEAD_TIMES.map(lt => (
              <option key={lt} value={lt}>{lt}</option>
            ))}
          </select>
        </div>
      </div>

          </div>
  );
}
