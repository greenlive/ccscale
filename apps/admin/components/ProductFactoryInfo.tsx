'use client';

import { Input } from '@cc-scale/ui';

interface ProductFactoryInfoProps {
  formData: {
    manufacturerName: string;
    factoryLocation: string;
    productionCapacity: string;
    productionCapacityUnit: string;
  };
  onChange: (data: ProductFactoryInfoProps['formData']) => void;
}

const COMMON_CAPACITY_UNITS = [
  'pcs/month',
  'pcs/year',
  'units/month',
  'units/year',
  'sets/month',
  'sets/year',
  'tons/month',
  'tons/year',
  'containers/month',
];

export function ProductFactoryInfo({ formData, onChange }: ProductFactoryInfoProps) {
  const handleChange = (field: keyof ProductFactoryInfoProps['formData'], value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal-warm mb-2">
          Manufacturer Name
        </label>
        <Input
          value={formData.manufacturerName}
          onChange={(e) => handleChange('manufacturerName', e.target.value)}
          placeholder="e.g. CC Scale Co., Ltd"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-warm mb-2">
          Factory Location
        </label>
        <Input
          value={formData.factoryLocation}
          onChange={(e) => handleChange('factoryLocation', e.target.value)}
          placeholder="e.g. Guangdong, China"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-warm mb-2">
          Production Capacity (产量)
        </label>
        <div className="flex gap-2">
          <Input
            value={formData.productionCapacity}
            onChange={(e) => handleChange('productionCapacity', e.target.value)}
            placeholder="e.g. 50,000"
            className="flex-1"
          />
          <select
            value={formData.productionCapacityUnit || 'pcs/month'}
            onChange={(e) => handleChange('productionCapacityUnit', e.target.value)}
            className="h-10 px-3 border border-border-warm rounded-md text-sm bg-white focus:border-olive-gray focus:ring-1 focus:ring-olive-gray w-36"
          >
            {COMMON_CAPACITY_UNITS.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-stone-gray mt-1.5">
          Select unit or enter custom capacity above
        </p>
      </div>
    </div>
  );
}
