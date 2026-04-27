'use client';

import { Input } from '@cc-scale/ui';

interface ProductTradeInfoProps {
  formData: {
    hsCode: string;
    paymentTerms: string;
    shippingTerms: string;
    warrantyInfo: string;
  };
  onChange: (data: ProductTradeInfoProps['formData']) => void;
}

const COMMON_PAYMENT_TERMS = ['T/T 30% Deposit', 'L/C at sight', 'PayPal', 'Western Union', 'T/T + L/C'];
const COMMON_SHIPPING_TERMS = ['FOB', 'CIF', 'EXW', 'DDP', 'CFR'];
const COMMON_WARRANTY = ['1 Year', '2 Years', 'Limited Lifetime'];

export function ProductTradeInfo({ formData, onChange }: ProductTradeInfoProps) {
  const handleChange = (field: keyof ProductTradeInfoProps['formData'], value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HS Code (海关编码)
          </label>
          <Input
            value={formData.hsCode}
            onChange={(e) => handleChange('hsCode', e.target.value)}
            placeholder="e.g. 8423.95.00.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Terms (付款条款)
          </label>
          <select
            value={formData.paymentTerms}
            onChange={(e) => handleChange('paymentTerms', e.target.value)}
            className="h-10 w-full px-3 border border-gray-200 rounded-md text-sm"
          >
            <option value="">Select payment terms</option>
            {COMMON_PAYMENT_TERMS.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Terms (贸易条款)
          </label>
          <select
            value={formData.shippingTerms}
            onChange={(e) => handleChange('shippingTerms', e.target.value)}
            className="h-10 w-full px-3 border border-gray-200 rounded-md text-sm"
          >
            <option value="">Select shipping terms</option>
            {COMMON_SHIPPING_TERMS.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warranty (保修期)
          </label>
          <select
            value={formData.warrantyInfo}
            onChange={(e) => handleChange('warrantyInfo', e.target.value)}
            className="h-10 w-full px-3 border border-gray-200 rounded-md text-sm"
          >
            <option value="">Select warranty</option>
            {COMMON_WARRANTY.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Payment/Shipping Terms
        </label>
        <Input
          value={formData.paymentTerms}
          onChange={(e) => handleChange('paymentTerms', e.target.value)}
          placeholder="Or enter custom payment terms"
        />
      </div>
    </div>
  );
}
