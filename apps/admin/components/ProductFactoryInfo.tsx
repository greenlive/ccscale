'use client';

import { Input } from '@cc-scale/ui';

interface ProductFactoryInfoProps {
  formData: {
    manufacturerName: string;
    factoryLocation: string;
    productionCapacity: string;
  };
  onChange: (data: ProductFactoryInfoProps['formData']) => void;
}

export function ProductFactoryInfo({ formData, onChange }: ProductFactoryInfoProps) {
  const handleChange = (field: keyof ProductFactoryInfoProps['formData'], value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Manufacturer Name
        </label>
        <Input
          value={formData.manufacturerName}
          onChange={(e) => handleChange('manufacturerName', e.target.value)}
          placeholder="e.g. CC Scale Co., Ltd"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Factory Location
        </label>
        <Input
          value={formData.factoryLocation}
          onChange={(e) => handleChange('factoryLocation', e.target.value)}
          placeholder="e.g. Guangdong, China"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Production Capacity
        </label>
        <Input
          value={formData.productionCapacity}
          onChange={(e) => handleChange('productionCapacity', e.target.value)}
          placeholder="e.g. 50,000 pcs/month"
        />
      </div>
    </div>
  );
}
