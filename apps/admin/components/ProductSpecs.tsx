'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';

interface SpecItem {
  id: string;
  keyEn: string;
  keyZh: string;
  valueEn: string;
  valueZh: string;
  order: number;
}

interface ProductSpecsProps {
  specs: SpecItem[];
  onChange: (specs: SpecItem[]) => void;
}

export function ProductSpecs({ specs, onChange }: ProductSpecsProps) {
  const addSpec = () => {
    const newSpec: SpecItem = {
      id: Math.random().toString(36).substr(2, 9),
      keyEn: '',
      keyZh: '',
      valueEn: '',
      valueZh: '',
      order: specs.length,
    };
    onChange([...specs, newSpec]);
  };

  const removeSpec = (id: string) => {
    onChange(specs.filter(s => s.id !== id));
  };

  const updateSpec = (id: string, field: keyof SpecItem, value: string) => {
    onChange(specs.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Specifications
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSpec}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Spec
        </Button>
      </div>

      <div className="space-y-3">
        {specs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <p>No specifications yet</p>
            <p className="text-sm mt-1">Click &quot;Add Spec&quot; to add product specifications</p>
          </div>
        ) : (
          specs.map((spec, index) => (
            <div
              key={spec.id}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="mt-8 text-gray-400 cursor-grab">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Key (English)
                    </label>
                    <Input
                      value={spec.keyEn}
                      onChange={(e) => updateSpec(spec.id, 'keyEn', e.target.value)}
                      placeholder="e.g. Weight Capacity"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Key (中文)
                    </label>
                    <Input
                      value={spec.keyZh}
                      onChange={(e) => updateSpec(spec.id, 'keyZh', e.target.value)}
                      placeholder="例如：最大称重"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Value (English)
                    </label>
                    <Input
                      value={spec.valueEn}
                      onChange={(e) => updateSpec(spec.id, 'valueEn', e.target.value)}
                      placeholder="e.g. 150kg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Value (中文)
                    </label>
                    <Input
                      value={spec.valueZh}
                      onChange={(e) => updateSpec(spec.id, 'valueZh', e.target.value)}
                      placeholder="例如：150公斤"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSpec(spec.id)}
                  className="mt-8 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
